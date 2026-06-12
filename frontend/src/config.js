export const IS_PRODUCTION = false;

export const getApiUrl = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : window.location.origin; 
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = getApiUrl();
  return `${baseUrl}${imagePath}`;
};



export const PAYMENT_CONFIG = {
  click: {
    serviceId: IS_PRODUCTION ? "JONLI_CLICK_ID" : "TEST_CLICK_ID",
    merchantId: IS_PRODUCTION ? "JONLI_MERCHANT_ID" : "TEST_MERCHANT_ID",
  },
  payme: {
    merchantId: IS_PRODUCTION ? "JONLI_PAYME_ID" : "TEST_PAYME_ID",
  }
};