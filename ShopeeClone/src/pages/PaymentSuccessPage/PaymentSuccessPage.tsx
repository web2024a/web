import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho các state
interface PaymentSuccessPageState {
  paymentStatus: string | null;
  orderId: string | null;
  amount: number | null;
}

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
    const vnp_TxnRef = queryParams.get('vnp_TxnRef');
    const vnp_Amount = queryParams.get('vnp_Amount');
    const vnp_OrderInfo = queryParams.get('vnp_OrderInfo');

    // Kiểm tra mã phản hồi từ VNPAY
    if (vnp_ResponseCode === '00') {
      setPaymentStatus('Thanh toán thành công!');
      setOrderId(vnp_TxnRef);
      setAmount(parseFloat(vnp_Amount || '0') / 100); // Chuyển đổi từ VND sang VNĐ
    } else {
      setPaymentStatus('Thanh toán thất bại!');
    }
  }, [location]);

  return (
    <div>
      <h1>{paymentStatus}</h1>
      {paymentStatus === 'Thanh toán thành công!' && (
        <div>
          <p>Mã đơn hàng: {orderId}</p>
          <p>Số tiền đã thanh toán: {amount} VND</p>
        </div>
      )}
      {paymentStatus === 'Thanh toán thất bại!' && (
        <p>Vui lòng thử lại sau.</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
