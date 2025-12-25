import { User } from '@/src/models/user.model'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/src/config/db'
import jwt from 'jsonwebtoken'

await connectDB()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: 'Please verify your email to login' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '30d'
    })

    const response = NextResponse.json({
      message: 'Login successful',
      success: true
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
