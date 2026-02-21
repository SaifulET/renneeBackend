import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import validationRequest from '../../middlewares/validationRequest';
import { DiscountController } from './discount.controller';
import { DiscountValidation } from './discount.validation';

const router = express.Router();

// /api/v1/discounts/creatediscount
router.post(
    '/creatediscount',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validationRequest(DiscountValidation.createDiscountValidationSchema),
    DiscountController.createDiscount,
);

// /api/v1/discounts/getalldiscounts
router.get('/getalldiscounts', DiscountController.getAllDiscounts);

router.get('/getdiscount/:id', DiscountController.getDiscountById);

router.patch(
    '/updatediscount/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validationRequest(DiscountValidation.updateDiscountValidationSchema),
    DiscountController.updateDiscount,
);


router.delete(
    '/deletediscount/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    DiscountController.deleteDiscount,
);

export const DiscountRoutes = router;
