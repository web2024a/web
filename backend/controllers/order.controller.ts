import { Request, Response } from 'express';
import { OrderModel } from '../database/models/order.model';

export const createOrder = async (req: Request, res: Response) => {
  const { products, total_price, address, phone } = req.body;

  const order = await OrderModel.create({
    user: req.jwtDecoded.id,
    products,
    total_price,
    address,
    phone,
  });

  return res.status(201).json({ message: 'Tạo đơn hàng thành công', order });
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await OrderModel.find({ user: req.jwtDecoded.id }).populate('products.product');

  return res.status(200).json({ message: 'Lấy danh sách đơn hàng thành công', orders });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!order) {
    return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  }

  return res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công', order });
};
