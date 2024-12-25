import { Request, Response } from 'express';
import axios from 'axios';
import { zaloPayConfig, createSignature } from '../constants/zaloPay'; // Đảm bảo bạn đã cấu hình zaloPayConfig đúng

// Tạo đơn thanh toán
export const createPayment = async (req: Request, res: Response) => {
  const { amount, description, orderId } = req.body;

  try {
    // Tạo payload gửi tới ZaloPay
    const data = {
      app_id: zaloPayConfig.appId, // Lấy AppID từ cấu hình
      partner_code: zaloPayConfig.partnerCode, // Lấy PartnerCode từ cấu hình
      amount, // Số tiền thanh toán
      description, // Mô tả thanh toán
      order_id: orderId, // Mã đơn hàng
      return_url: zaloPayConfig.callbackUrl, // URL callback khi thanh toán thành công
      redirect_url: zaloPayConfig.redirectUrl, // URL sau khi người dùng hoàn tất thanh toán
      create_date: Date.now(), // Thời gian tạo đơn hàng
      currency: 'VND', // Đơn vị tiền tệ
    };

    // Tạo chữ ký từ dữ liệu trên
    const signature = createSignature(data, zaloPayConfig.key1); // key1 là khóa bí mật dùng để tạo chữ ký
    data['signature'] = signature;

    // Gửi yêu cầu tới ZaloPay để tạo đơn thanh toán
    const response = await axios.post(zaloPayConfig.apiUrl, data);

    // Kiểm tra kết quả trả về từ ZaloPay
    if (response.data.return_code === 1) {
      return res.status(200).json({
        message: 'Tạo đơn thanh toán thành công',
        orderUrl: response.data.order_url, // URL để chuyển hướng người dùng tới trang thanh toán của ZaloPay
      });
    }

    return res.status(400).json({
      message: 'Tạo đơn thanh toán thất bại',
      error: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống', error });
  }
};

// Xử lý callback từ ZaloPay khi thanh toán hoàn tất
export const handleCallback = async (req: Request, res: Response) => {
  const { order_id, result_code } = req.body; // Lấy order_id và kết quả thanh toán từ ZaloPay

  try {
    const paymentStatus = result_code === 1 ? 'PAID' : 'FAILED'; // Xác định trạng thái thanh toán

    // Gửi yêu cầu cập nhật trạng thái thanh toán cho hệ thống của bạn
    await axios.post(
      'http://localhost:4000/user/update-payment-status', // URL cập nhật trạng thái thanh toán
      { purchaseId: order_id, paymentStatus }, // Dữ liệu gửi đi
      {
        headers: {
          Authorization: `Bearer <server_token>`, // Thay bằng token nếu cần thiết
        },
      }
    );

    // Trả về phản hồi cho ZaloPay
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ message: 'Lỗi callback từ ZaloPay', error });
  }
};

// Xử lý chuyển hướng người dùng sau khi thanh toán
export const handleRedirect = (req: Request, res: Response) => {
  // Lấy các thông tin cần thiết từ URL (nếu cần)
  const { order_id, result_code } = req.query;

  if (result_code === '1') {
    // Thành công
    res.redirect(`/payment-success?order_id=${order_id}`);
  } else {
    // Thất bại
    res.redirect(`/payment-fail?order_id=${order_id}`);
  }
};
