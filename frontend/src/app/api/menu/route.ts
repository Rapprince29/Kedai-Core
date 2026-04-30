import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    // Flat map the data to match the previous structure if needed, 
    // or just return with the category object.
    const flattened = menus.map(m => ({
      ...m,
      category: m.category.name
    }))
    return NextResponse.json(flattened)
  } catch (error) {
    console.error('Failed to fetch menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Find or create category
    let category = await prisma.category.findUnique({
      where: { name: body.category }
    })
    
    if (!category) {
      category = await prisma.category.create({
        data: { name: body.category }
      })
    }

    const menu = await prisma.menu.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: Number(body.price),
        categoryId: category.id,
        image: body.image,
        stock: Number(body.stock || 0),
        isBestSeller: body.isBestSeller || false,
      },
      include: { category: true }
    })
    
    return NextResponse.json({ ...menu, category: menu.category.name })
  } catch (error) {
    console.error('Failed to create menu:', error)
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 })
  }
}
