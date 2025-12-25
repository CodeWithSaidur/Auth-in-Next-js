import { connectDB } from '@/src/config/db'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { User } from '@/src/models/user.model'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/src/utils/mail'

await connectDB()

export function GET() {
  return NextResponse.json({
    message: 'Signup route works!'
  })
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json()
    console.log(reqBody)

    const { username, email, password } = reqBody

    const user = await User.findOne({ email })
    if (user) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    console.log('User Exist') // log

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })
    const savedUser = await newUser.save()
    console.log('User Save Sussessfullly')

    // send Email verification
    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id })

    return NextResponse.json(
      { message: 'User created successfully', user: savedUser },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during signup' },
      { status: 500 }
    )
  }
}
