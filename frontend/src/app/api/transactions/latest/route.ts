import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kedai-core-secret-key-2026') as any
    const userId = decoded.userId

    const latest = await (prisma as any).transaction.findFirst({
      where: { customerName: decoded.name || undefined }, // Fallback if name is in token
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(latest)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest status' }, { status: 500 })
  }
}
