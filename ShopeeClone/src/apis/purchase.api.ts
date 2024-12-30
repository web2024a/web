import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
interface CreatePaymentResponse {
  orderUrl: string;
}
const URL = 'purchases'
const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    if (!body || body.length === 0) {
      return Promise.reject(new Error('Không có sản phẩm nào để mua'));
    }
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body);
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponse<{deleted_count:number}>>(`${URL}`, {
      data: purchaseIds
    })
  },
  createPayment(body: { amount: number; description: string; orderId: string }) {
    return http.post<SuccessResponse<CreatePaymentResponse>>(`${URL}/create-payment`, body);
  },
  handleCallback(body: { orderId: string; resultCode: number }) {
    return http.post<SuccessResponse<{ status: string }>>(`${URL}/payment-callback`, body);
  },
}
export default purchaseApi
