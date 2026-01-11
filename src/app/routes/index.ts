import express from "express";
import AuthRouter from "../modules/auth/auth.routes";
import UserRouters from "../modules/user/user.routes";

import { BookingRoutes } from "../modules/bookings/booking.routes";
import { CategoryRoutes } from "../modules/categories/category.routes";
import { ServiceRoutes } from "../modules/services/service.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/user",
    route: UserRouters,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
