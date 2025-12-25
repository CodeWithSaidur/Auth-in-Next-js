import { User } from '@/src/models/user.model'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

type EmailType = 'VERIFY' | 'RESET'

interface SendEmailParams {
  email: string
  emailType: EmailType
  userId: string
}

const TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

const createToken = () => crypto.randomBytes(32).toString('hex')

export const sendEmail = async ({
  email,
  emailType,
  userId
}: SendEmailParams) => {
  const token = createToken()
  console.log(token)

  const expiry = Date.now() + TOKEN_EXPIRY

  const updateData =
    emailType === 'VERIFY'
      ? { vToken: token, vTokenExpiry: expiry }
      : { fpToken: token, fpTokenExpiry: expiry }

  await User.findByIdAndUpdate(userId, updateData)
  console.log('Pass DB Query')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!
    }
  })

  console.log('Pass Transpoter')

  const actionPath = emailType === 'VERIFY' ? 'verify' : 'reset'
  const actionText =
    emailType === 'VERIFY' ? 'verify your email' : 'reset your password'

  const mailOptions = {
    from: process.env.SMTP_FROM!,
    to: email,
    subject:
      emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
    html: `
      <p>
        Click <a href="${process.env.DOMAIN}/api/users/${actionPath}?token=${token}&id=${userId}">
        here</a> to ${actionText}.
      </p>
    `
  }

  return transporter.sendMail(mailOptions)
}
