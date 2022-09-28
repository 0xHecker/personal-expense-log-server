import express from 'express';
const router = express.Router();
import requireAuth from '../middleware/requireAuth';

import {
  auth_login,
  auth_register,
  auth_user,
  auth_logout,
} from '../controllers/authController';

router.get('/me', requireAuth, auth_user);

router.post('/login', auth_login);

router.post('/logout', requireAuth, auth_logout);

router.post('/register', auth_register);

export default router;
