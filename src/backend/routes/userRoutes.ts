import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetPassword
} from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', isAdmin, getAllUsers);
router.get('/:id', getUserById);
router.post('/', isAdmin, createUser);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);
router.patch('/:id/status', isAdmin, updateUserStatus);
router.post('/:id/reset-password', isAdmin, resetPassword);

export default router;
