import { NextRequest } from 'next/server'
import Jwt from 'jsonwebtoken'

export const Get_Data = (req: NextRequest) => {
  try {
    const token = req.cookies.get('token')?.value || ''
    const decoded: any = Jwt.verify(token, process.env.JWT_SECRET!)
    return decoded.id // return user id : user._id
  } catch (error) {
    throw new Error('Error in getting data from token')
  }
}
