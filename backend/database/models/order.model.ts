import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'users', required: true },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: 'products', required: true },
        buy_count: { type: Number, required: true },
        price: { type: Number, required: true },
        price_before_discount: { type: Number, required: true },
      },
    ],
    total_price: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['WAIT_FOR_CONFIRMATION', 'CONFIRMED', 'DELIVERING', 'CANCELED', 'COMPLETED'],
      default: 'WAIT_FOR_CONFIRMATION',
    },
    payment_status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model('orders', OrderSchema);
