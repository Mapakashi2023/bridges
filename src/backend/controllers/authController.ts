import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../config/database';
import { AuthRequest, AuthResponse, APIResponse } from '../types';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: AuthRequest = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
      return;
    }

    const users = await sql`
      SELECT * FROM users
      WHERE username = ${username} AND status = 'active'
    `;

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
      return;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    const response: APIResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role = 'student',
      phone,
      address,
      date_of_birth
    } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
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
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        phone,
        address,
        date_of_birth,
        status
      ) VALUES (
        ${username},
        ${email},
        ${passwordHash},
        ${first_name || null},
        ${last_name || null},
        ${role},
        ${phone || null},
        ${address || null},
        ${date_of_birth || null},
        'active'
      ) RETURNING *
    `;

    const user = newUsers[0];
    const { password_hash, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response: APIResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;

    const users = await sql`
      SELECT id, username, email, first_name, last_name, role, phone,
             address, date_of_birth, profile_image_url, status, created_at
      FROM users WHERE id = ${userId}
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
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      date_of_birth,
      profile_image_url
    } = req.body;

    const updatedUsers = await sql`
      UPDATE users SET
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        address = COALESCE(${address}, address),
        date_of_birth = COALESCE(${date_of_birth}, date_of_birth),
        profile_image_url = COALESCE(${profile_image_url}, profile_image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, username, email, first_name, last_name, role, phone,
                address, date_of_birth, profile_image_url, status, created_at
    `;

    res.json({
      success: true,
      data: updatedUsers[0],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};
