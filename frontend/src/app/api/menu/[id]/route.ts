import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    const body = await request.json()

    let categoryId = undefined
    if (body.category) {
      let category = await (prisma as any).category.findUnique({
        where: { name: body.category }
      })
      if (!category) {
        category = await (prisma as any).category.create({
          data: { name: body.category }
        })
      }
      categoryId = category.id
    }

    const menu = await (prisma as any).menu.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        categoryId: categoryId,
        image: body.image,
        stock: Number(body.stock),
        isBestSeller: body.isBestSeller,
      },
      include: { category: true }
    })
    return NextResponse.json({ ...menu, category: menu.category?.name })
  } catch (error) {
    console.error('Failed to update menu:', error)
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    await (prisma as any).menu.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete menu:', error)
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 })
  }
}
