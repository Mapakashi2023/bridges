import { Request, Response } from 'express';
import { sql } from '../config/database';

export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const totalStudents = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'student'`;
    const totalTeachers = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'teacher'`;
    const totalCourses = await sql`SELECT COUNT(*) as count FROM courses`;
    const publishedCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE status = 'published'`;
    const totalEnrollments = await sql`SELECT COUNT(*) as count FROM enrollments`;
    const activeEnrollments = await sql`SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'`;
    const completedEnrollments = await sql`SELECT COUNT(*) as count FROM enrollments WHERE status = 'completed'`;

    const recentEnrollments = await sql`
      SELECT e.*, u.first_name || ' ' || u.last_name as student_name,
             c.title as course_title, c.course_code
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrollment_date DESC
      LIMIT 10
    `;

    const popularCourses = await sql`
      SELECT c.*, COUNT(e.id) as enrollment_count,
             u.first_name || ' ' || u.last_name as instructor_name
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.status = 'published'
      GROUP BY c.id, u.first_name, u.last_name
      ORDER BY enrollment_count DESC
      LIMIT 5
    `;

    const enrollmentTrends = await sql`
      SELECT DATE(enrollment_date) as date, COUNT(*) as count
      FROM enrollments
      WHERE enrollment_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(enrollment_date)
      ORDER BY date
    `;

    res.json({
      success: true,
      data: {
        statistics: {
          total_users: Number(totalUsers[0].count),
          total_students: Number(totalStudents[0].count),
          total_teachers: Number(totalTeachers[0].count),
          total_courses: Number(totalCourses[0].count),
          published_courses: Number(publishedCourses[0].count),
          total_enrollments: Number(totalEnrollments[0].count),
          active_enrollments: Number(activeEnrollments[0].count),
          completed_enrollments: Number(completedEnrollments[0].count)
        },
        recent_enrollments: recentEnrollments,
        popular_courses: popularCourses,
        enrollment_trends: enrollmentTrends
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};

export const getTeacherDashboard = async (req: any, res: Response): Promise<void> => {
  try {
    const teacherId = req.user.userId;

    const myCourses = await sql`
      SELECT c.*, COUNT(DISTINCT e.id) as enrollment_count
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = ${teacherId}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    const totalStudents = await sql`
      SELECT COUNT(DISTINCT e.student_id) as count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ${teacherId}
    `;

    const activeEnrollments = await sql`
      SELECT COUNT(*) as count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ${teacherId} AND e.status = 'active'
    `;

    const pendingSubmissions = await sql`
      SELECT COUNT(*) as count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN lessons l ON a.lesson_id = l.id
      JOIN course_modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE c.instructor_id = ${teacherId} AND s.graded_at IS NULL
    `;

    const recentSubmissions = await sql`
      SELECT s.*, a.title as assignment_title,
             u.first_name || ' ' || u.last_name as student_name,
             c.title as course_title
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON s.student_id = u.id
      JOIN lessons l ON a.lesson_id = l.id
      JOIN course_modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE c.instructor_id = ${teacherId}
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: {
        statistics: {
          total_courses: myCourses.length,
          total_students: Number(totalStudents[0].count),
          active_enrollments: Number(activeEnrollments[0].count),
          pending_submissions: Number(pendingSubmissions[0].count)
        },
        my_courses: myCourses,
        recent_submissions: recentSubmissions
      }
    });
  } catch (error) {
    console.error('Get teacher dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};

export const getStudentDashboard = async (req: any, res: Response): Promise<void> => {
  try {
    const studentId = req.user.userId;

    const myEnrollments = await sql`
      SELECT e.*, c.title, c.course_code, c.thumbnail_url,
             u.first_name || ' ' || u.last_name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.student_id = ${studentId} AND e.status = 'active'
      ORDER BY e.enrollment_date DESC
    `;

    const totalEnrollments = await sql`
      SELECT COUNT(*) as count FROM enrollments WHERE student_id = ${studentId}
    `;

    const completedCourses = await sql`
      SELECT COUNT(*) as count FROM enrollments
      WHERE student_id = ${studentId} AND status = 'completed'
    `;

    const averageProgress = await sql`
      SELECT AVG(progress_percentage) as avg
      FROM enrollments
      WHERE student_id = ${studentId} AND status = 'active'
    `;

    const upcomingAssignments = await sql`
      SELECT a.*, l.title as lesson_title, c.title as course_title,
             s.submitted_at, s.score
      FROM assignments a
      JOIN lessons l ON a.lesson_id = l.id
      JOIN course_modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ${studentId}
      WHERE e.student_id = ${studentId}
        AND e.status = 'active'
        AND a.due_date >= CURRENT_TIMESTAMP
      ORDER BY a.due_date
      LIMIT 5
    `;

    const recentGrades = await sql`
      SELECT s.*, a.title as assignment_title, a.max_score,
             c.title as course_title
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN lessons l ON a.lesson_id = l.id
      JOIN course_modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE s.student_id = ${studentId} AND s.graded_at IS NOT NULL
      ORDER BY s.graded_at DESC
      LIMIT 5
    `;

    res.json({
      success: true,
      data: {
        statistics: {
          total_enrollments: Number(totalEnrollments[0].count),
          active_enrollments: myEnrollments.length,
          completed_courses: Number(completedCourses[0].count),
          average_progress: Number(averageProgress[0].avg || 0).toFixed(2)
        },
        my_enrollments: myEnrollments,
        upcoming_assignments: upcomingAssignments,
        recent_grades: recentGrades
      }
    });
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};
