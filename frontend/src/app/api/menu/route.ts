import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menus = await (prisma as any).menu.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    const flattened = menus.map((m: any) => ({
      ...m,
      category: m.category?.name || 'Uncategorized',
      price: Number(m.price) || 0,
      stock: Number(m.stock) || 0
    }))
    return NextResponse.json(flattened)
  } catch (error) {
    console.error('Failed to fetch menu:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch menu',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    let category = await (prisma as any).category.findUnique({
      where: { name: body.category }
    })
    
    if (!category) {
      category = await (prisma as any).category.create({
        data: { name: body.category }
      })
    }

    const menu = await (prisma as any).menu.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: Number(body.price) || 0,
        categoryId: category.id,
        image: body.image || '',
        stock: Number(body.stock) || 0,
        isBestSeller: body.isBestSeller || false,
        flavor: body.flavor || null
      },
      include: { category: true }
    })
    
    return NextResponse.json({ ...menu, category: menu.category?.name })
  } catch (error) {
    console.error('Failed to create menu:', error)
    return NextResponse.json({ 
      error: 'Failed to create menu',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
