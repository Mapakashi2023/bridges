import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sql } from '../config/database';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `SELECT id, username, email, first_name, last_name, role, phone, status, created_at FROM users WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND role = $${paramIndex++}`;
      params.push(role);
    }

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      query += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), offset);

    const users = await sql(query, params);

    const countQuery = `SELECT COUNT(*) FROM users WHERE 1=1` +
      (role ? ` AND role = '${role}'` : '') +
      (status ? ` AND status = '${status}'` : '') +
      (search ? ` AND (username ILIKE '%${search}%' OR email ILIKE '%${search}%')` : '');

    const totalCount = await sql(countQuery);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(totalCount[0].count)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const users = await sql`
      SELECT id, username, email, first_name, last_name, role, phone,
             address, date_of_birth, profile_image_url, status, created_at
      FROM users WHERE id = ${id}
    `;

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role,
      phone,
      address,
      date_of_birth
    } = req.body;

    if (!username || !email || !password || !role) {
      res.status(400).json({
        success: false,
        error: 'Username, email, password, and role are required'
      });
      return;
    }

    const existingUsers = await sql`
      SELECT id FROM users WHERE username = ${username} OR email = ${email}
    `;

    if (existingUsers.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUsers = await sql`
      INSERT INTO users (
        username, email, password_hash, first_name, last_name,
        role, phone, address, date_of_birth, status
      ) VALUES (
        ${username}, ${email}, ${passwordHash}, ${first_name || null},
        ${last_name || null}, ${role}, ${phone || null},
        ${address || null}, ${date_of_birth || null}, 'active'
      ) RETURNING id, username, email, first_name, last_name, role,
                  phone, status, created_at
    `;

    res.status(201).json({
      success: true,
      data: newUsers[0],
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      first_name,
      last_name,
      role,
      phone,
      address,
      date_of_birth,
      status,
      profile_image_url
    } = req.body;

    const updatedUsers = await sql`
      UPDATE users SET
        username = COALESCE(${username}, username),
        email = COALESCE(${email}, email),
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        role = COALESCE(${role}, role),
        phone = COALESCE(${phone}, phone),
        address = COALESCE(${address}, address),
        date_of_birth = COALESCE(${date_of_birth}, date_of_birth),
        status = COALESCE(${status}, status),
        profile_image_url = COALESCE(${profile_image_url}, profile_image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username, email, first_name, last_name, role,
                phone, status, created_at
    `;

    if (updatedUsers.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedUsers[0],
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedUsers = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `;

    if (deletedUsers.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
      return;
    }

    const updatedUsers = await sql`
      UPDATE users SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username, email, first_name, last_name, role, status
    `;

    if (updatedUsers.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedUsers[0],
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUsers = await sql`
      UPDATE users SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username
    `;

    if (updatedUsers.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
};
