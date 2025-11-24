import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whrirlmtsowzlabnyaib.supabase.co'

// 🟢 1. ลบ process.env ทิ้ง แล้วเอา Key ยาวๆ (anon public) จากเว็บ Supabase มาวางในเครื่องหมายคำพูด
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocmlybG10c293emxhYm55YWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDAwNjEsImV4cCI6MjA3OTQ3NjA2MX0.DuV2dKehR52rKHnccJf7Z-ivuzxZBGZ9lR5dHAuA4tA' 

// 🟢 2. ต้องมีคำว่า export ข้างหน้า const
export const supabase = createClient(supabaseUrl, supabaseKey)