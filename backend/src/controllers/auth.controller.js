import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 4. Remove password before sending response
    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      message: 'User created successfully',
      user: safeUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};