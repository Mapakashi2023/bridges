import { neon } from '@neondatabase/serverless';

function getSqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(url);
}

export const sql = getSqlClient();

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
        phone VARCHAR(20),
        address TEXT,
        date_of_birth DATE,
        profile_image_url TEXT,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        course_code VARCHAR(50) UNIQUE NOT NULL,
        instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        category VARCHAR(100),
        level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        duration_weeks INTEGER,
        credits INTEGER,
        thumbnail_url TEXT,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS course_modules (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        content_type VARCHAR(50) CHECK (content_type IN ('video', 'text', 'pdf', 'quiz', 'assignment')),
        video_url TEXT,
        duration_minutes INTEGER,
        order_index INTEGER NOT NULL,
        is_preview BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completion_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
        progress_percentage DECIMAL(5,2) DEFAULT 0,
        grade DECIMAL(5,2),
        UNIQUE(student_id, course_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        time_spent_minutes INTEGER DEFAULT 0,
        UNIQUE(enrollment_id, lesson_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP,
        max_score DECIMAL(5,2) DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        submission_text TEXT,
        file_url TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        score DECIMAL(5,2),
        feedback TEXT,
        graded_at TIMESTAMP,
        graded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE(assignment_id, student_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        time_limit_minutes INTEGER,
        passing_score DECIMAL(5,2) DEFAULT 70,
        max_attempts INTEGER DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
        options JSONB,
        correct_answer TEXT NOT NULL,
        points DECIMAL(5,2) DEFAULT 1,
        order_index INTEGER NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        score DECIMAL(5,2),
        answers JSONB,
        attempt_number INTEGER DEFAULT 1
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS discussions (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS discussion_replies (
        id SERIAL PRIMARY KEY,
        discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused')),
        notes TEXT,
        UNIQUE(course_id, student_id, date)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
        certificate_number VARCHAR(100) UNIQUE NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        certificate_url TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)
    `;

    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function createAdminUser() {
  try {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    const existing = await sql`
      SELECT id FROM users WHERE username = ${process.env.ADMIN_USERNAME}
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO users (
          username,
          email,
          password_hash,
          first_name,
          last_name,
          role,
          status
        ) VALUES (
          ${process.env.ADMIN_USERNAME},
          'admin@bridges.edu',
          ${hashedPassword},
          'World',
          'Administrator',
          'admin',
          'active'
        )
      `;
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    return true;
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
    throw error;
  }
}
