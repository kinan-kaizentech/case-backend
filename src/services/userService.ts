import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { DatabaseService } from './databaseService';
import { User, UserProfile, RegisterRequest, LoginRequest } from '../types';

const SALT_ROUNDS = 10;

export class UserService {
  private db;

  constructor() {
    this.db = DatabaseService.getInstance().getDatabase();
  }

  /**
   * Register a new user
   */
  public async register(data: RegisterRequest): Promise<UserProfile> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password length
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    // Validate birthday format if provided
    if (data.birthday) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.birthday)) {
        throw new Error('Birthday must be in YYYY-MM-DD format');
      }
      
      // Validate if it's a valid date
      const date = new Date(data.birthday);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid birthday date');
      }
    }

    // Check if email already exists
    const existingUser = this.db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Generate UUID
    const userId = uuidv4();
    const now = new Date().toISOString();

    // Insert user
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, password, name, birthday, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(userId, data.email, hashedPassword, data.name, data.birthday || null, now, now);

    // Return user profile (without password)
    return {
      id: userId,
      email: data.email,
      name: data.name,
      birthday: data.birthday,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Login user
   */
  public async login(data: LoginRequest): Promise<UserProfile> {
    // Validate input
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = this.db.prepare(`
      SELECT id, email, password, name, birthday, created_at, updated_at
      FROM users
      WHERE email = ?
    `).get(data.email) as User | undefined;

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user profile (without password)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      birthday: user.birthday,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Get user profile by UUID
   */
  public getProfile(userId: string): UserProfile | null {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error('Invalid user ID format');
    }

    const user = this.db.prepare(`
      SELECT id, email, name, birthday, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(userId) as User | undefined;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      birthday: user.birthday,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
