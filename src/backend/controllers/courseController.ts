import { Request, Response } from 'express';
import { sql } from '../config/database';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category, level, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT c.*, u.first_name || ' ' || u.last_name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND c.status = $${paramIndex++}`;
      params.push(status);
    }

    if (category) {
      query += ` AND c.category = $${paramIndex++}`;
      params.push(category);
    }

    if (level) {
      query += ` AND c.level = $${paramIndex++}`;
      params.push(level);
    }

    if (search) {
      query += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex} OR c.course_code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), offset);

    const courses = await sql(query, params);

    const countQuery = `SELECT COUNT(*) FROM courses WHERE 1=1` +
      (status ? ` AND status = '${status}'` : '') +
      (category ? ` AND category = '${category}'` : '') +
      (level ? ` AND level = '${level}'` : '');

    const totalCount = await sql(countQuery);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(totalCount[0].count)
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const courses = await sql`
      SELECT c.*, u.first_name || ' ' || u.last_name as instructor_name,
             u.email as instructor_email
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ${id}
    `;

    if (courses.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    const modules = await sql`
      SELECT * FROM course_modules
      WHERE course_id = ${id}
      ORDER BY order_index
    `;

    const enrollmentCount = await sql`
      SELECT COUNT(*) as total FROM enrollments WHERE course_id = ${id}
    `;

    res.json({
      success: true,
      data: {
        ...courses[0],
        modules,
        enrollment_count: Number(enrollmentCount[0].total)
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course'
    });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      course_code,
      instructor_id,
      category,
      level,
      duration_weeks,
      credits,
      thumbnail_url,
      status = 'draft'
    } = req.body;

    if (!title || !course_code) {
      res.status(400).json({
        success: false,
        error: 'Title and course code are required'
      });
      return;
    }

    const existingCourses = await sql`
      SELECT id FROM courses WHERE course_code = ${course_code}
    `;

    if (existingCourses.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Course code already exists'
      });
      return;
    }

    const newCourses = await sql`
      INSERT INTO courses (
        title, description, course_code, instructor_id, category,
        level, duration_weeks, credits, thumbnail_url, status
      ) VALUES (
        ${title}, ${description || null}, ${course_code},
        ${instructor_id || null}, ${category || null}, ${level || null},
        ${duration_weeks || null}, ${credits || null},
        ${thumbnail_url || null}, ${status}
      ) RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newCourses[0],
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create course'
    });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      course_code,
      instructor_id,
      category,
      level,
      duration_weeks,
      credits,
      thumbnail_url,
      status
    } = req.body;

    const updatedCourses = await sql`
      UPDATE courses SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        course_code = COALESCE(${course_code}, course_code),
        instructor_id = COALESCE(${instructor_id}, instructor_id),
        category = COALESCE(${category}, category),
        level = COALESCE(${level}, level),
        duration_weeks = COALESCE(${duration_weeks}, duration_weeks),
        credits = COALESCE(${credits}, credits),
        thumbnail_url = COALESCE(${thumbnail_url}, thumbnail_url),
        status = COALESCE(${status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCourses.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedCourses[0],
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update course'
    });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCourses = await sql`
      DELETE FROM courses WHERE id = ${id} RETURNING id
    `;

    if (deletedCourses.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete course'
    });
  }
};

export const getCourseModules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const modules = await sql`
      SELECT * FROM course_modules
      WHERE course_id = ${courseId}
      ORDER BY order_index
    `;

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules'
    });
  }
};

export const createCourseModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { title, description, order_index } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Module title is required'
      });
      return;
    }

    const newModules = await sql`
      INSERT INTO course_modules (course_id, title, description, order_index)
      VALUES (${courseId}, ${title}, ${description || null}, ${order_index || 0})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newModules[0],
      message: 'Module created successfully'
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create module'
    });
  }
};

export const getModuleLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;

    const lessons = await sql`
      SELECT * FROM lessons
      WHERE module_id = ${moduleId}
      ORDER BY order_index
    `;

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lessons'
    });
  }
};

export const createLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const {
      title,
      content,
      content_type,
      video_url,
      duration_minutes,
      order_index,
      is_preview = false
    } = req.body;

    if (!title || !content_type) {
      res.status(400).json({
        success: false,
        error: 'Title and content type are required'
      });
      return;
    }

    const newLessons = await sql`
      INSERT INTO lessons (
        module_id, title, content, content_type, video_url,
        duration_minutes, order_index, is_preview
      ) VALUES (
        ${moduleId}, ${title}, ${content || null}, ${content_type},
        ${video_url || null}, ${duration_minutes || null},
        ${order_index || 0}, ${is_preview}
      ) RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newLessons[0],
      message: 'Lesson created successfully'
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create lesson'
    });
  }
};
