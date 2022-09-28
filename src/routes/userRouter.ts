import express from 'express';
const router = express.Router();
import requireAuth from '../middleware/requireAuth';

import {
  user_update_profile,
  user_delete,
  user_update_password,
} from '../controllers/userController';

router.use(requireAuth);

router.patch('/updateprofile', user_update_profile);
router.patch('/updateprofile/password', user_update_password);
router.patch('/userprofile/delete', user_delete);

export default router;
