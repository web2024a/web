import { body } from 'express-validator';
import helpersMiddleware from './helpers.middleware';

export const createOrderRules = () => [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Danh sách sản phẩm phải là một mảng và không được rỗng')
    .custom((products) => {
      const isValid = products.every(
        (item: any) =>
          typeof item.product === 'string' &&
          typeof item.buy_count === 'number' &&
          item.buy_count > 0 &&
          typeof item.price === 'number' &&
          typeof item.price_before_discount === 'number'
      );
      if (!isValid) {
        throw new Error('Sản phẩm không hợp lệ');
      }
      return true;
    }),
  body('address').isString().withMessage('Địa chỉ không hợp lệ').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('phone').isString().withMessage('Số điện thoại không hợp lệ').notEmpty().withMessage('Số điện thoại là bắt buộc'),
  body('total_price')
    .isNumeric()
    .withMessage('Tổng giá trị đơn hàng phải là số')
    .notEmpty()
    .withMessage('Tổng giá trị không được để trống'),
  helpersMiddleware.entityValidator,
];
