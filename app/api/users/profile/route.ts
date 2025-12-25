import { connectDB } from '@/src/config/db'
import { User } from '@/src/models/user.model'
import { Get_Data } from '@/src/utils/data'
import { NextRequest, NextResponse } from 'next/server'

await connectDB()

export async function GET(req: NextRequest) {
  const userid = await Get_Data(req)

  const user = await User.findById({ _id: userid }).select('-password')

  return NextResponse.json(
    { message: 'User profile fetched successfully', user },
    { status: 200 }
  )
}
