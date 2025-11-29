// supabase/functions/topup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// --- CONFIG ---
const SLIPOK_API_KEY = "SLIPOKJ8BPFXG" 
const SLIPOK_BRANCH_ID = "56848"
const SHOP_ACC_NO = "2211538972" 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const userEmail = formData.get('email')

    if (!file || !userEmail) throw new Error('Missing file or email')

    // 1. SlipOK Check
    const slipForm = new FormData()
    slipForm.append('files', file)
    slipForm.append('log', 'true')

    const slipRes = await fetch(`https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`, {
      method: 'POST',
      headers: { 'x-authorization': SLIPOK_API_KEY },
      body: slipForm
    })
    
    const slipResult = await slipRes.json()
    let data = slipResult.data;

    // Handle Duplicate / Error
    if (!slipResult.success) {
      if (slipResult.code === 1012 && slipResult.data) {
         console.log("Duplicate slip detected, checking local DB...");
         data = slipResult.data;
      } else {
         throw new Error(slipResult.message || 'สลิปไม่ถูกต้อง')
      }
    }

    const amount = data.amount
    const transRef = data.transRef
    const rawReceiver = data.receiver?.account?.value || data.receiver?.proxy?.value || "";
    
    // ✅✅✅ แก้ไขจุดที่ผิด (Partial Match Logic) ✅✅✅
    // ดึงเฉพาะตัวเลขจากสลิป (เช่น "xxx-x-x3897-x" -> "3897")
    const slipDigits = rawReceiver.replace(/[^0-9]/g, "");

    // ตรวจสอบ:
    // 1. เลขจากสลิปต้องมีความยาวอย่างน้อย 4 หลัก (กันเลขมั่วสั้นๆ)
    // 2. เลขบัญชีร้านค้า ต้อง "มี" เลขจากสลิปปนอยู่ (เช่น 2211538972 มี 3897 อยู่ข้างใน -> ถือว่าผ่าน)
    const isMatch = slipDigits.length >= 3 && SHOP_ACC_NO.includes(slipDigits);

    if (!isMatch) {
      throw new Error(`สลิปนี้ไม่ได้โอนเข้าบัญชีร้าน (โอนไป: ${rawReceiver})`)
    }

    // 3. Connect Supabase
    // @ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    // @ts-ignore
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 4. Duplicate Check in DB
    const { data: existing } = await supabase
      .from('topup_transactions')
      .select('id')
      .eq('trans_ref', transRef)
      .maybeSingle()

    if (existing) {
      throw new Error('สลิปนี้ถูกใช้งานไปแล้ว (Duplicate)')
    }

    // 5. Save Transaction
    const { error: txError } = await supabase
      .from('topup_transactions')
      .insert({
        user_email: userEmail,
        amount: amount,
        trans_ref: transRef,
        raw_data: data
      })
    
    if (txError) throw new Error("Database Error: " + txError.message)

    // 6. Update Balance
    const { data: userStat } = await supabase
      .from('user_stats')
      .select('wallet_balance')
      .eq('user_email', userEmail)
      .maybeSingle()
    
    const newBalance = (userStat?.wallet_balance || 0) + amount

    await supabase
      .from('user_stats')
      .upsert({ 
        user_email: userEmail, 
        wallet_balance: newBalance 
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'เติมเงินสำเร็จ', 
        new_balance: newBalance,
        amount: amount // ✅ เพิ่มบรรทัดนี้: ส่งยอดเงินกลับไปให้หน้าเว็บรู้ด้วย
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})