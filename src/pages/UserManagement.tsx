import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { apiService } from '../services/apiService';
import toast, { Toaster } from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await apiService.getUsers(filters);
      if (result.success) {
        setUsers(result.data.users || []);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'student',
      phone: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser.id) {
        await apiService.updateUser(editingUser.id, editingUser);
        toast.success('User updated!');
      } else {
        await apiService.createUser(editingUser);
        toast.success('User created!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(id);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-8">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-blue-300">Manage all platform users</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <FiPlus /> Create User
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
              />
            </div>

            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              onClick={() => setFilters({ role: '', status: '', search: '' })}
              className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 flex items-center justify-center gap-2"
            >
              <FiFilter /> Reset
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      className="border-b border-white/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {user.first_name?.charAt(0) || user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-white/60 text-sm">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/80">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-500/20 text-red-300'
                            : user.role === 'teacher'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-300'
                            : user.status === 'inactive'
                            ? 'bg-gray-500/20 text-gray-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditUser(user)}
                            className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-white/60">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showModal && editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingUser.id ? 'Edit User' : 'Create User'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Username</label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                </div>

                {!editingUser.id && (
                  <div>
                    <label className="block text-white mb-2">Password</label>
                    <input
                      type="password"
                      value={editingUser.password}
                      onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">First Name</label>
                    <input
                      type="text"
                      value={editingUser.first_name}
                      onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editingUser.last_name}
                      onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-2">Status</label>
                    <select
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
                >
                  {editingUser.id ? 'Update' : 'Create'} User
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
