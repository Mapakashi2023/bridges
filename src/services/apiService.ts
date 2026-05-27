const API_URL = 'http://localhost:8888/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  }

  // Dashboard APIs
  async getAdminDashboard() {
    const response = await fetch(`${API_URL}/dashboard/admin`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getTeacherDashboard() {
    const response = await fetch(`${API_URL}/dashboard/teacher`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getStudentDashboard() {
    const response = await fetch(`${API_URL}/dashboard/student`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // User Management
  async getUsers(params?: { role?: string; status?: string; search?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/users?${query}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getUserById(id: number) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createUser(userData: any) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async updateUser(id: number, userData: any) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async deleteUser(id: number) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateUserStatus(id: number, status: string) {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // Course Management
  async getCourses(params?: { status?: string; category?: string; search?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/courses?${query}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getCourseById(id: number) {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createCourse(courseData: any) {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(courseData),
    });
    return response.json();
  }

  async updateCourse(id: number, courseData: any) {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(courseData),
    });
    return response.json();
  }

  async deleteCourse(id: number) {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Course Modules
  async getCourseModules(courseId: number) {
    const response = await fetch(`${API_URL}/courses/${courseId}/modules`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createModule(courseId: number, moduleData: any) {
    const response = await fetch(`${API_URL}/courses/${courseId}/modules`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(moduleData),
    });
    return response.json();
  }

  // Lessons
  async getModuleLessons(moduleId: number) {
    const response = await fetch(`${API_URL}/courses/modules/${moduleId}/lessons`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createLesson(moduleId: number, lessonData: any) {
    const response = await fetch(`${API_URL}/courses/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(lessonData),
    });
    return response.json();
  }

  // Enrollments
  async enrollStudent(studentId: number, courseId: number) {
    const response = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ student_id: studentId, course_id: courseId }),
    });
    return response.json();
  }

  async getStudentEnrollments(studentId: number) {
    const response = await fetch(`${API_URL}/enrollments/student/${studentId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getCourseEnrollments(courseId: number) {
    const response = await fetch(`${API_URL}/enrollments/course/${courseId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateEnrollmentProgress(enrollmentId: number, progress: number, grade?: number) {
    const response = await fetch(`${API_URL}/enrollments/${enrollmentId}/progress`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ progress_percentage: progress, grade }),
    });
    return response.json();
  }

  async markLessonComplete(enrollmentId: number, lessonId: number, timeSpent: number = 0) {
    const response = await fetch(`${API_URL}/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ time_spent_minutes: timeSpent }),
    });
    return response.json();
  }

  async getEnrollmentProgress(enrollmentId: number) {
    const response = await fetch(`${API_URL}/enrollments/${enrollmentId}/progress`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
