'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSignup = async () => {
    try {
      setLoading(true)
      const res = await axios.post('/api/users/signup', user)
      toast.success('Signup successful')

      console.log(res.data)

      router.push('/login')
    } catch (error) {
      console.log('Error in Signup')
      toast.error('Signup failed')
    }
  }

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

  return (
    <div>
      <h1 className="text-center mt-3">Signup</h1>
      <div className="flex flex-col gap-5 max-w-md mx-auto mt-5">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border border-gray-300 rounded"
          value={user.username}
          onChange={e => setUser({ ...user, username: e.target.value })}
        />
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
          onClick={onSignup}
          disabled={buttonDisabled}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {loading ? 'Signing up...' : 'Signup'}
        </button>
        <Link href="/login">login</Link>
      </div>
    </div>
  )
}
