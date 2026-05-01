import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'kedai-core-secret-key-2026'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await (prisma as any).user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = (jwt as any).sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    })

    response.headers.set('Set-Cookie', cookie)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
