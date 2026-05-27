import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiAward, FiClock, FiTrendingUp } from 'react-icons/fi';
import { apiService } from '../services/apiService';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const result = await apiService.getStudentDashboard();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
              <p className="text-sm text-blue-300">Welcome back, {user.first_name || 'Student'}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="text-white/60 hover:text-white">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiBook />}
            title="Enrolled Courses"
            value={data?.statistics?.active_enrollments || 0}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<FiAward />}
            title="Completed"
            value={data?.statistics?.completed_courses || 0}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<FiTrendingUp />}
            title="Average Progress"
            value={`${data?.statistics?.average_progress || 0}%`}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<FiClock />}
            title="Total Enrollments"
            value={data?.statistics?.total_enrollments || 0}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* My Courses */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
          {data?.my_enrollments && data.my_enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.my_enrollments.map((enrollment: any, index: number) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer"
                  onClick={() => navigate(`/student/courses/${enrollment.course_id}`)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{enrollment.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{enrollment.course_code}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white font-bold">{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${enrollment.progress_percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">{enrollment.instructor_name || 'Instructor'}</span>
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">
                      Continue
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">You're not enrolled in any courses yet</p>
              <button
                onClick={() => navigate('/student/explore')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        {data?.upcoming_assignments && data.upcoming_assignments.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📝 Upcoming Assignments</h2>
            <div className="space-y-4">
              {data.upcoming_assignments.map((assignment: any) => (
                <motion.div
                  key={assignment.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="p-4 rounded-xl border border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{assignment.assignment_title}</h4>
                      <p className="text-white/60 text-sm mb-2">{assignment.course_title}</p>
                      <p className="text-sm text-orange-300">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
                      {assignment.submitted_at ? 'View' : 'Submit'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Grades */}
        {data?.recent_grades && data.recent_grades.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">🏆 Recent Grades</h2>
            <div className="space-y-4">
              {data.recent_grades.map((grade: any) => (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{grade.assignment_title}</h4>
                      <p className="text-white/60 text-sm">{grade.course_title}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        (grade.score / grade.max_score) * 100 >= 70 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {grade.score}/{grade.max_score}
                      </div>
                      <p className="text-white/60 text-sm">
                        {Math.round((grade.score / grade.max_score) * 100)}%
                      </p>
                    </div>
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
