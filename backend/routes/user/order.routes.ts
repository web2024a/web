import { Router } from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import * as orderMiddleware from '../../middleware/order.middleware';
import * as orderController from '../../controllers/order.controller';
import { wrapAsync } from '../../utils/response';

export const userOrderRouter = Router();

userOrderRouter.post(
  '/create',
  authMiddleware.verifyAccessToken,
  orderMiddleware.createOrderRules(),
  wrapAsync(orderController.createOrder)
);

userOrderRouter.get(
  '/',
  authMiddleware.verifyAccessToken,
  wrapAsync(orderController.getOrders)
);

userOrderRouter.put(
  '/update-status',
  authMiddleware.verifyAccessToken,
  wrapAsync(orderController.updateOrderStatus)
);
