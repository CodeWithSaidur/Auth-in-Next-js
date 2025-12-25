'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  email: string
}

interface ProfileResponse {
  user: User
}

export default function Profile() {
  const router = useRouter()

  const [data, setData] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    try {
      await axios.get('/api/users/logout')
      toast.success('Logged out successfully')
      router.replace('/login')
    } catch {
      toast.error('Error logging out')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ProfileResponse>('/api/users/profile')
      setData(response.data)
    } catch {
      toast.error('Failed to fetch profile')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-center mt-3 text-xl font-bold">Profile</h1>

      <div className="flex flex-col gap-5 max-w-md mx-auto mt-5">
        <h2>
          {loading && 'Loading...'}
          {!loading && !data && 'No Data...'}
          {!loading && data && (
            <>
              User Name: {data.user.username}
              <br />
              User Email: {data.user.email}
            </>
          )}
        </h2>

        <button
          type="button"
          onClick={logout}
          className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>

        <button
          type="button"
          onClick={fetchData}
          className="bg-green-600 text-white p-2 rounded">
          User Profile
        </button>
      </div>
    </div>
  )
}
