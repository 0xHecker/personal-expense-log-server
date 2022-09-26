import express from 'express';
const router = express.Router();

import {
  user_update_profile,
  user_delete,
  user_update_password,
} from '../controllers/userController';

router.patch('/updateprofile', user_update_profile);
router.patch('/updateprofile/password', user_update_password);

export default router;
