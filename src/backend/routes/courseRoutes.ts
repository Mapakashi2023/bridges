import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseModules,
  createCourseModule,
  getModuleLessons,
  createLesson
} from '../controllers/courseController';
import { authenticate, isTeacher, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.use(authenticate);

router.post('/', isTeacher, createCourse);
router.put('/:id', isTeacher, updateCourse);
router.delete('/:id', isAdmin, deleteCourse);

router.get('/:courseId/modules', getCourseModules);
router.post('/:courseId/modules', isTeacher, createCourseModule);

router.get('/modules/:moduleId/lessons', getModuleLessons);
router.post('/modules/:moduleId/lessons', isTeacher, createLesson);

export default router;
