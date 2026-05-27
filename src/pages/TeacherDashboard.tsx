import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiUsers, FiPlus, FiBarChart, FiSettings } from 'react-icons/fi';
import { apiService } from '../services/apiService';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const result = await apiService.getTeacherDashboard();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-sm text-blue-300">Manage your courses</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/teacher/create-course')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <FiPlus /> AI Create Course
            </motion.button>
            <button onClick={handleLogout} className="text-white/60 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiBook />}
            title="My Courses"
            value={data?.statistics?.total_courses || 0}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<FiUsers />}
            title="Total Students"
            value={data?.statistics?.total_students || 0}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<FiBarChart />}
            title="Active Enrollments"
            value={data?.statistics?.active_enrollments || 0}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<FiSettings />}
            title="Pending Submissions"
            value={data?.statistics?.pending_submissions || 0}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* My Courses */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
          {data?.my_courses && data.my_courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.my_courses.map((course: any, index: number) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer"
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{course.course_code}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">{course.enrollment_count || 0} students</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      course.status === 'published'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No courses yet</p>
              <button
                onClick={() => navigate('/teacher/create-course')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Create Your First Course with AI
              </button>
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        {data?.recent_submissions && data.recent_submissions.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Submissions</h2>
            <div className="space-y-4">
              {data.recent_submissions.map((submission: any) => (
                <motion.div
                  key={submission.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="p-4 rounded-xl border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{submission.assignment_title}</h4>
                      <p className="text-white/60 text-sm">{submission.student_name}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">
                      Grade
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-white/60 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
}
