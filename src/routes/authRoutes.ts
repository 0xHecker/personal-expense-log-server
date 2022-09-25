import express from 'express';
const router = express.Router();
import {
  auth_login,
  auth_register,
  auth_user,
  auth_logout,
} from '../controllers/authController';

router.get('/me', auth_user);

router.post('/signin', auth_login);

router.post('/logout', auth_logout);

router.post('/register', auth_register);
export default router;
