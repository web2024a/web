import { userOrderRouter } from "./order.routes";
import { userPurchaseRouter } from "./purchase.route";
import { userUserRouter } from "./user-user.route";

const userRoutes = {
  prefix: '/',
  routes: [
    {
      path: 'user',
      route: userUserRouter
    },
    {
      path: 'purchases',
      route: userPurchaseRouter
    },
    {
      path: 'orders',
      route: userOrderRouter,
    },
  ]
}

export default userRoutes