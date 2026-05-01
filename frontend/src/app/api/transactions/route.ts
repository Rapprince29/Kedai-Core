import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { items, totalPrice, method } = await request.json()
    
    // Get user from token
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    let customerName = 'Guest'
    
    if (token) {
       try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kedai-core-secret-key-2026') as any
          customerName = decoded.name || 'Explorer'
       } catch (err) {}
    }

    const transaction = await (prisma as any).transaction.create({
      data: {
        totalPrice,
        customerName,
        items: JSON.stringify(items),
        status: 'PENDING',
        paymentMethod: method || 'CASH'
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

export async function GET() {
   try {
      const transactions = await (prisma as any).transaction.findMany({
         orderBy: { createdAt: 'desc' },
         take: 20
      });
      return NextResponse.json(transactions);
   } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
   }
}
