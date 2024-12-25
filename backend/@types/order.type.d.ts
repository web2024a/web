// src/types/order.type.ts
export interface Order {
    _id: string;
    user: string;  // ID người dùng
    products: {
      product_id: string;
      buy_count: number;
      price: number;
      price_before_discount: number;
    }[];  // Danh sách sản phẩm trong đơn hàng
    status: string;  // Trạng thái đơn hàng (ví dụ: "PENDING", "CONFIRMED", "SHIPPED")
    payment_status: string;  // Trạng thái thanh toán (ví dụ: "PENDING", "PAID", "FAILED")
    address: string;  // Địa chỉ giao hàng
    phone: string;  // Số điện thoại
    createdAt: string;  // Thời gian tạo
    updatedAt: string;  // Thời gian cập nhật
  }
  