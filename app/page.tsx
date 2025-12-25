import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 className="text-center mt-3">SABED</h1>
      <Link href="/signup">Signup</Link>
    </div>
  )
}
