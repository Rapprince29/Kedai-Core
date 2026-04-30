import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(menus)
  } catch (error) {
    console.error('Failed to fetch menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const menu = await prisma.menu.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: Number(body.price),
        category: body.category,
        image: body.image,
        stock: Number(body.stock || 0),
      }
    })
    return NextResponse.json(menu)
  } catch (error) {
    console.error('Failed to create menu:', error)
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 })
  }
}
