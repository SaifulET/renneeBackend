import express from "express";
import AuthRouter from "../modules/auth/auth.routes";
import UserRouters from "../modules/user/user.routes";

import { BookingRoutes } from "../modules/bookings/booking.routes";
import { CategoryRoutes } from "../modules/categories/category.routes";
import { ServiceRoutes } from "../modules/services/service.routes";
import SettingsRoutes from "../modules/settings/settings.routres";
import contactRoutes from "../modules/contact/contact.router";
import { DiscountRoutes } from "../modules/discounts/discount.routes";
import { MessageRoutes } from "../modules/message/message.routes";


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
  {
    path: "/settings",
    route: SettingsRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/discounts",
    route: DiscountRoutes,
  },
  {
    path: "/message",
    route: MessageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
