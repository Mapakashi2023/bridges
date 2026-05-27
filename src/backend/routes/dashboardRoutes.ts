import { Router } from 'express';
import {
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard
} from '../controllers/dashboardController';
import { authenticate, isAdmin, isTeacher } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/admin', isAdmin, getAdminDashboard);
router.get('/teacher', isTeacher, getTeacherDashboard);
router.get('/student', getStudentDashboard);

export default router;
