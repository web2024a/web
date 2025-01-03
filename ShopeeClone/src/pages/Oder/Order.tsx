import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import paymentapi from 'src/apis/payment.api'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/context/app.context'
import http from 'src/utils/http'
import { FormatCurrency } from 'src/utils/utils'

export default function Order() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const location = useLocation()
  const { purchaseIds } = location.state || {}
  const [address, setAddress] = useState('')
  const [nameOrder, setNameOrder] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod') // Mặc định là 'COD'
  const [phone, setPhone] = useState('')
  const [url, setUrl] = useState('')
  const paymantmutation = useMutation({
    mutationFn: paymentapi.postPaymant
  })
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const { data: purchasesData } = useQuery({
    queryKey: ['orderPurchases', purchaseIds],
    queryFn: () => purchaseApi.getPurchases({ status: 0 }),
    enabled: Boolean(purchaseIds)
  })

  const purchases = (purchasesData?.data.data || []).filter((purchase) => purchaseIds?.includes(purchase._id))

  const totalAmount = purchases.reduce((total, purchase) => total + purchase.product.price * purchase.buy_count, 0)

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const handleBuyPurchase = async () => {
    if (!address.trim() || !nameOrder.trim() || !phone.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng!', {
        position: 'top-center',
        autoClose: 2000
      })
      return
    }

    if (checkedPurchases.length > 0) {
      // Tính toán tổng tiền và mô tả
      const totalAmount = checkedPurchases.reduce(
        (total, purchase) => total + purchase.product.price * purchase.buy_count,
        0
      )
      const description = `Đơn hàng cho ${nameOrder} - ${checkedPurchases.length} sản phẩm`

      // Tạo body gửi API createPayment
      const body = {
        amount: totalAmount,
        bankCode: 'NCB'
        // orderId: new Date().getTime().toString(), // Hoặc có thể dùng một mã đơn hàng từ server
      }

      if (paymentMethod === 'vnp') {
        // Tạo đơn thanh toán ZaloPay
        const result = await http.post('/payment/create_payment_url', body)
        // setUrl(result.data.url as string)
        window.location.href = result.data.url
        // paymantmutation.mutate(body)
      } else {
        // Xử lý thanh toán khi nhận hàng hoặc các phương thức khác

        buyProductMutation.mutate(
          checkedPurchases.map((purchase) => ({
            product_id: purchase.product._id,
            buy_count: purchase.buy_count,
            address,
            name_order: nameOrder,
            phone
          })),
          {
            onError: (error) => {
              toast.error('Đặt hàng thất bại, vui lòng thử lại!', {
                position: 'top-center',
                autoClose: 2000
              })
            }
          }
        )
      }
    } else {
      toast.warning('Bạn chưa chọn sản phẩm nào để đặt hàng!', {
        position: 'top-center',
        autoClose: 2000
      })
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {/* Thông tin đơn hàng */}
        <div className='mb-5'>
          <h2 className='text-xl font-semibold'>Thông tin đơn hàng</h2>
          <ul>
            {purchases.map((purchase) => (
              <li key={purchase._id} className='flex justify-between py-2 border-b'>
                <span>
                  {purchase.product.name} x {purchase.buy_count}
                </span>
                <span>₫{FormatCurrency(purchase.product.price * purchase.buy_count)}</span>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex justify-end'>
            <strong>Tổng tiền: ₫{FormatCurrency(totalAmount)}</strong>
          </div>
        </div>

        {/* Nhập địa chỉ, số điện thoại, tên người nhận */}
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700'>Tên Người nhận</label>
          <Input
            type='text'
            placeholder='Nhập tên'
            value={nameOrder}
            onChange={(e) => setNameOrder(e.target.value)}
            className='mt-2 w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700'>Địa chỉ giao hàng</label>
          <Input
            type='text'
            placeholder='Nhập địa chỉ'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='mt-2 w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
          <Input
            type='tel'
            placeholder='Nhập số điện thoại'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='mt-2 w-full p-2 border border-gray-300 rounded'
          />
        </div>

        {/* Phương thức thanh toán */}
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700'>Phương thức thanh toán</label>
          <select
            className='mt-2 w-full p-2 border border-gray-300 rounded'
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value='vnp'>VNP</option>
            <option value='cod'>Thanh toán khi nhận hàng</option>
          </select>
        </div>

        <div className='mt-6'>
          <Button onClick={handleBuyPurchase} className='h-12 w-full bg-green-500 text-white text-sm'>
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  )
}
