// src/utils/auctionUtils.js

export const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';

export const getCardImageUrl = (cardImagePath, cardId) => {
    if (!cardImagePath || !cardId) return '';
    const fileId = cardId.replace(' - Only#1', '');
    return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`;
};

export const getAuctionThumbnail = (item) => {
    if (item.card_image_path === 'CUSTOM_ITEM') {
        try { 
            const images = JSON.parse(item.proof_image); 
            return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image'; 
        } catch { 
            return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; 
        }
    }
    if (!item.card_image_path || !item.card_id) return '';
    const fileId = item.card_id.replace(' - Only#1', '');
    return `/cards/${encodePath(item.card_image_path)}/${encodeURIComponent(fileId)}.png`;
};