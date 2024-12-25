// src/config/zaloPay.ts
import crypto from 'crypto';

export const zaloPayConfig = {
  appId: '2554', // App ID từ Sandbox
  partnerCode: '2554', // Partner Code (thường giống App ID trong môi trường Sandbox)
  key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn', // Key1 từ Sandbox
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf', // Key2 từ Sandbox
  apiUrl: 'https://sandbox.zalopay.vn/v2/createorder', // API URL cho Sandbox
  callbackUrl: 'http://localhost:4000/payment-callback', // Thay bằng URL callback của bạn
  redirectUrl: 'http://localhost:4000/payment-redirect', // Thay bằng URL redirect của bạn
};

// Hàm tạo chữ ký cho dữ liệu gửi đi
export const createSignature = (data: any, key: string) => {
  const rawData = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');

  return crypto.createHmac('sha256', key).update(rawData).digest('hex');
};
