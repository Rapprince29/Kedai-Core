import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const { id } = params

    const updated = await (prisma as any).transaction.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update transaction:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}
