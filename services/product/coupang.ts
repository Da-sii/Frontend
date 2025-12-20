import CryptoJS from 'crypto-js';

const METHOD = 'POST';
const DOMAIN = 'https://api-gateway.coupang.com';
const URL = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/search';

const ACCESS_KEY = process.env.EXPO_PUBLIC_COUPANG_ACCESS_KEY;
const SECRET_KEY = process.env.EXPO_PUBLIC_COUPANG_SECRET_KEY;

function generateAuthorization(path: string, requestBody: object) {
  const datetime = new Date().toISOString().substr(0, 19).concat('Z');
  const message = datetime + METHOD + path + JSON.stringify(requestBody);

  const signature = CryptoJS.HmacSHA256(message, SECRET_KEY as string).toString(
    CryptoJS.enc.Hex,
  );

  return `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
}

export const searchCoupangProduct = async (keyword: string) => {
  if (!ACCESS_KEY || !SECRET_KEY) {
    return { productUrl: null, price: null };
  }

  const requestBody = { keyword, limit: 1 };

  try {
    const authorization = generateAuthorization(URL, requestBody);
    const response = await fetch(DOMAIN + URL, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    if (data.rCode !== '0') {
      console.error('Coupang API Error:', data.rMessage);
      return { productUrl: null, price: null };
    }
    const product = data.data?.productData?.[0];
    if (!product || !product.productUrl) {
      console.warn('쿠팡에서 유효한 상품 URL을 찾을 수 없음');
      return { productUrl: null, price: null };
    }
    return {
      productUrl: product.productUrl,

    };
  } catch (error) {
    console.error('Failed to fetch Coupang product:', error);
    return { productUrl: null, price: null };
  }
};
