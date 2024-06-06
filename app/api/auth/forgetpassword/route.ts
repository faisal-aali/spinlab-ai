import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../../util/db';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

const query = promisify(pool.query).bind(pool);

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ message: 'Reset URL logged in console.' });

  }
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const rows: any = await query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Email does not exist.' });
    }

    // Generate JWT token with bcrypt
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    bcrypt.hash(user.id.toString(), saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing user ID.' });
      }
      const resetUrl = `http://localhost:3000/reset/${hash}`; // Construct the reset URL with localhost:3000
      console.log('Reset URL:', resetUrl); // Log the reset URL
      res.json({ message: 'Reset URL logged in console.' });
    });

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
