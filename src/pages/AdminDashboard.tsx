import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardData {
  statistics: {
    total_users: number;
    total_students: number;
    total_teachers: number;
    total_courses: number;
    published_courses: number;
    total_enrollments: number;
    active_enrollments: number;
    completed_enrollments: number;
  };
  recent_enrollments: any[];
  popular_courses: any[];
  enrollment_trends: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:8888/api'
        : '/api';

      const response = await fetch(`${API_URL}/dashboard/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Connection error. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-xl text-white/80">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-200 px-8 py-6 rounded-2xl max-w-md"
        >
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-lg font-semibold mb-2">Connection Error</div>
          <div>{error}</div>
        </motion.div>
      </div>
    );
  }

  const stats = data?.statistics;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-2xl">🎓</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Admin Dashboard
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl"
                  >
                    ✨
                  </motion.span>
                </h1>
                <p className="text-sm text-blue-300">Welcome back, {user.first_name || 'Admin'}</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">👤</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"
                />
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-20 right-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                      onClick={handleLogout}
                      className="w-full px-6 py-3 text-left text-white flex items-center gap-3"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/teacher/create-course')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              ⚡
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold mb-1">AI Course Creator</h3>
              <p className="text-blue-100 text-sm">Create courses with AI assistance</p>
            </div>
            <span className="text-2xl">→</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/users')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              👥
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold mb-1">User Management</h3>
              <p className="text-emerald-100 text-sm">Manage students, teachers, and admins</p>
            </div>
            <span className="text-2xl">→</span>
          </motion.button>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon="👥"
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatCard
            title="Total Students"
            value={stats?.total_students || 0}
            icon="🎓"
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <StatCard
            title="Total Teachers"
            value={stats?.total_teachers || 0}
            icon="👨‍🏫"
            gradient="from-purple-500 to-pink-500"
            delay={0.3}
          />
          <StatCard
            title="Total Courses"
            value={stats?.total_courses || 0}
            icon="📚"
            gradient="from-orange-500 to-red-500"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Published"
            value={stats?.published_courses || 0}
            icon="✅"
            gradient="from-teal-500 to-green-500"
            delay={0.5}
          />
          <StatCard
            title="Total Enrollments"
            value={stats?.total_enrollments || 0}
            icon="📝"
            gradient="from-blue-500 to-indigo-500"
            delay={0.6}
          />
          <StatCard
            title="Active"
            value={stats?.active_enrollments || 0}
            icon="🔥"
            gradient="from-red-500 to-pink-500"
            delay={0.7}
          />
          <StatCard
            title="Completed"
            value={stats?.completed_enrollments || 0}
            icon="🏆"
            gradient="from-yellow-500 to-orange-500"
            delay={0.8}
          />
        </div>

        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 mb-8 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Recent Enrollments
            </h2>
            {data?.recent_enrollments && data.recent_enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_enrollments.map((enrollment: any, index: number) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="border-b border-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-white">{enrollment.student_name}</td>
                        <td className="px-6 py-4 text-white/80">{enrollment.course_title}</td>
                        <td className="px-6 py-4">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              enrollment.status === 'active'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}
                          >
                            {enrollment.status}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${enrollment.progress_percentage}%` }}
                                transition={{ duration: 1, delay: 1 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              />
                            </div>
                            <span className="text-white/80 text-sm font-semibold min-w-[3rem]">
                              {enrollment.progress_percentage}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/60"
              >
                <span className="text-6xl mb-4 block">📭</span>
                <p>No recent enrollments</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Popular Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              Popular Courses
            </h2>
            {data?.popular_courses && data.popular_courses.length > 0 ? (
              <div className="space-y-4">
                {data.popular_courses.map((course: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="bg-gradient-to-r from-white/5 to-transparent backdrop-blur-xl rounded-2xl p-6 border-l-4 border-blue-500 hover:border-purple-500 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">{course.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <span>📖</span> {course.course_code}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>👨‍🏫</span> {course.instructor_name || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-2 rounded-xl text-white font-bold shadow-lg"
                      >
                        {course.enrollment_count} 👥
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/60"
              >
                <span className="text-6xl mb-4 block">📚</span>
                <p>No courses yet</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  gradient: string;
  delay: number;
}

function StatCard({ title, value, icon, gradient, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 from-white/10 to-transparent rounded-3xl transition-opacity duration-300" />
      <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="text-5xl"
            >
              {icon}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
              className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl opacity-20`}
            />
          </div>
          <p className="text-sm text-white/60 font-medium mb-2">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold text-white"
          >
            <CountUp end={value} duration={2} delay={delay} />
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function CountUp({ end, duration, delay }: { end: number; duration: number; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return <>{count}</>;
}
