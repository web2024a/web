import http from 'src/utils/http'

const paymentapi = {
  postPaymant(body: { amount: any; bankCode: string }) {
    return http.post('/payment/create_payment_url', body)
  }
}
export default paymentapi
