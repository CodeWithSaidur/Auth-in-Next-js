'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onLogin = async () => {
    try {
      setLoading(true)
      const res = await axios.post('/api/users/login', user)
      toast.success('Login successful')

      console.log(res.data)

      router.push('/profile')
    } catch (error) {
      console.log('Error in Login')
      toast.error('Login failed')
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

  return (
    <div>
      <h1 className="text-center mt-3">Login</h1>
      <div className="flex flex-col gap-5 max-w-md mx-auto mt-5">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded"
          value={user.password}
          onChange={e => setUser({ ...user, password: e.target.value })}
        />
        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {loading ? 'OnLogin...' : 'Login'}
        </button>
        <Link href="/signup">Signup</Link>
      </div>
    </div>
  )
}
