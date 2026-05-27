import { Request, Response } from 'express';
import { sql } from '../config/database';

export const enrollStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      res.status(400).json({
        success: false,
        error: 'Student ID and Course ID are required'
      });
      return;
    }

    const existingEnrollments = await sql`
      SELECT id FROM enrollments
      WHERE student_id = ${student_id} AND course_id = ${course_id}
    `;

    if (existingEnrollments.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Student is already enrolled in this course'
      });
      return;
    }

    const newEnrollments = await sql`
      INSERT INTO enrollments (student_id, course_id, status, progress_percentage)
      VALUES (${student_id}, ${course_id}, 'active', 0)
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newEnrollments[0],
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll student'
    });
  }
};

export const getStudentEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const enrollments = await sql`
      SELECT e.*, c.title, c.course_code, c.thumbnail_url,
             u.first_name || ' ' || u.last_name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.student_id = ${studentId}
      ORDER BY e.enrollment_date DESC
    `;

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Get student enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollments'
    });
  }
};

export const getCourseEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT e.*, u.username, u.email, u.first_name, u.last_name
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      WHERE e.course_id = $1
    `;
    const params: any[] = [courseId];
    let paramIndex = 2;

    if (status) {
      query += ` AND e.status = $${paramIndex++}`;
      params.push(status);
    }

    query += ` ORDER BY e.enrollment_date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), offset);

    const enrollments = await sql(query, params);

    const countQuery = `SELECT COUNT(*) FROM enrollments WHERE course_id = ${courseId}` +
      (status ? ` AND status = '${status}'` : '');
    const totalCount = await sql(countQuery);

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(totalCount[0].count)
        }
      }
    });
  } catch (error) {
    console.error('Get course enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course enrollments'
    });
  }
};

export const updateEnrollmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'completed', 'dropped', 'suspended'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
      return;
    }

    const updatedEnrollments = await sql`
      UPDATE enrollments SET
        status = ${status},
        completion_date = ${status === 'completed' ? sql`CURRENT_TIMESTAMP` : null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedEnrollments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedEnrollments[0],
      message: 'Enrollment status updated successfully'
    });
  } catch (error) {
    console.error('Update enrollment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update enrollment status'
    });
  }
};

export const updateEnrollmentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { progress_percentage, grade } = req.body;

    const updatedEnrollments = await sql`
      UPDATE enrollments SET
        progress_percentage = COALESCE(${progress_percentage}, progress_percentage),
        grade = COALESCE(${grade}, grade)
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedEnrollments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedEnrollments[0],
      message: 'Enrollment progress updated successfully'
    });
  } catch (error) {
    console.error('Update enrollment progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update enrollment progress'
    });
  }
};

export const markLessonComplete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId, lessonId } = req.params;
    const { time_spent_minutes = 0 } = req.body;

    const existing = await sql`
      SELECT * FROM lesson_progress
      WHERE enrollment_id = ${enrollmentId} AND lesson_id = ${lessonId}
    `;

    if (existing.length > 0) {
      await sql`
        UPDATE lesson_progress SET
          completed = true,
          completed_at = CURRENT_TIMESTAMP,
          time_spent_minutes = ${time_spent_minutes}
        WHERE enrollment_id = ${enrollmentId} AND lesson_id = ${lessonId}
      `;
    } else {
      await sql`
        INSERT INTO lesson_progress (enrollment_id, lesson_id, completed, completed_at, time_spent_minutes)
        VALUES (${enrollmentId}, ${lessonId}, true, CURRENT_TIMESTAMP, ${time_spent_minutes})
      `;
    }

    const enrollment = await sql`
      SELECT e.*, c.id as course_id
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = ${enrollmentId}
    `;

    if (enrollment.length > 0) {
      const totalLessons = await sql`
        SELECT COUNT(*) as total
        FROM lessons l
        JOIN course_modules m ON l.module_id = m.id
        WHERE m.course_id = ${enrollment[0].course_id}
      `;

      const completedLessons = await sql`
        SELECT COUNT(*) as completed
        FROM lesson_progress lp
        JOIN lessons l ON lp.lesson_id = l.id
        JOIN course_modules m ON l.module_id = m.id
        WHERE lp.enrollment_id = ${enrollmentId}
          AND lp.completed = true
          AND m.course_id = ${enrollment[0].course_id}
      `;

      const progress = totalLessons[0].total > 0
        ? (completedLessons[0].completed / totalLessons[0].total) * 100
        : 0;

      await sql`
        UPDATE enrollments SET progress_percentage = ${progress}
        WHERE id = ${enrollmentId}
      `;
    }

    res.json({
      success: true,
      message: 'Lesson marked as complete'
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark lesson as complete'
    });
  }
};

export const getEnrollmentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await sql`
      SELECT e.*, c.title as course_title, c.course_code
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = ${enrollmentId}
    `;

    if (enrollment.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
      return;
    }

    const lessonsProgress = await sql`
      SELECT lp.*, l.title, l.content_type, l.duration_minutes, m.title as module_title
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      JOIN course_modules m ON l.module_id = m.id
      WHERE lp.enrollment_id = ${enrollmentId}
      ORDER BY m.order_index, l.order_index
    `;

    res.json({
      success: true,
      data: {
        enrollment: enrollment[0],
        lessons_progress: lessonsProgress
      }
    });
  } catch (error) {
    console.error('Get enrollment progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollment progress'
    });
  }
};
