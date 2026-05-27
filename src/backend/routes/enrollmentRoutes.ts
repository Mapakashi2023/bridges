import { Router } from 'express';
import {
  enrollStudent,
  getStudentEnrollments,
  getCourseEnrollments,
  updateEnrollmentStatus,
  updateEnrollmentProgress,
  markLessonComplete,
  getEnrollmentProgress
} from '../controllers/enrollmentController';
import { authenticate, isTeacher, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', isAdmin, enrollStudent);
router.get('/student/:studentId', getStudentEnrollments);
router.get('/course/:courseId', isTeacher, getCourseEnrollments);
router.get('/:enrollmentId/progress', getEnrollmentProgress);
router.patch('/:id/status', isTeacher, updateEnrollmentStatus);
router.patch('/:id/progress', isTeacher, updateEnrollmentProgress);
router.post('/:enrollmentId/lessons/:lessonId/complete', markLessonComplete);

export default router;
