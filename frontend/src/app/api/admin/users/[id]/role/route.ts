import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await request.json()
    const { id } = params

    const updated = await (prisma as any).user.update({
      where: { id },
      data: { role }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
  }
}
