import { Router } from 'express'
import * as purchaseController from '../../controllers/purchase.controller'
import authMiddleware from '../../middleware/auth.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'
import { wrapAsync } from '../../utils/response'

const adminPurchaseRouter = Router()

/**
 * [Get purchases by status]
 * @queryParam status: string (optional)
 * @route admin/purchases
 * @method get
 */
adminPurchaseRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(purchaseController.getPurchases),
)

/**
 * [Admin update purchase status]
 * @bodyParam purchase_id: string, status: string
 * @route admin/purchases/update-status
 * @method put
 */
adminPurchaseRouter.put(
  '/update-status',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('purchase_id'), // Kiểm tra định dạng ID hợp lệ
  helpersMiddleware.entityValidator,
  wrapAsync(purchaseController.adminUpdatePurchaseStatus),
)

/**
 * [Update payment status]
 * @bodyParam purchase_id: string, payment_status: string
 * @route admin/purchases/update-payment-status
 * @method put
 */
adminPurchaseRouter.put(
  '/update-payment-status',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule('purchase_id'), // Kiểm tra định dạng ID hợp lệ
  helpersMiddleware.entityValidator,
  wrapAsync(purchaseController.updatePaymentStatus),
)

export default adminPurchaseRouter
