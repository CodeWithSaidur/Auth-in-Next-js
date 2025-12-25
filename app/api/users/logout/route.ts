import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true
    })

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error in logout'
      },
      {
        status: 500
      }
    )
  }
}
