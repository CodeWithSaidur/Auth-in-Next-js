import { User } from '@/src/models/user.model'

const html = (title: string, message: string, success = true) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      background: #0f172a;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .card {
      background: #020617;
      padding: 2rem 2.5rem;
      border-radius: 12px;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    h1 {
      color: ${success ? '#22c55e' : '#ef4444'};
      margin-bottom: 0.75rem;
    }
    p {
      color: #94a3b8;
    }
    a {
      display: inline-block;
      margin-top: 1.5rem;
      color: #38bdf8;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/login">Go to Login</a>
  </div>
</body>
</html>
`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return new Response(
        html('Verification Failed', 'Verification token is missing.', false),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const user = await User.findOneAndUpdate(
      {
        vToken: token,
        vTokenExpiry: { $gt: Date.now() }
      },
      {
        $set: { isVerified: true },
        $unset: { vToken: 1, vTokenExpiry: 1 }
      },
      { new: true }
    )

    if (!user) {
      return new Response(
        html(
          'Invalid Token',
          'The verification link is invalid or expired.',
          false
        ),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    return new Response(
      html('Email Verified 🎉', 'Your account has been successfully verified.'),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch {
    return new Response(
      html(
        'Server Error',
        'Something went wrong while verifying your account.',
        false
      ),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}
