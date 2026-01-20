import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId,
      bookingId,
    } = await request.json()

    // Verify signature
    const sign = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex')

    if (razorpaySignature !== expectedSign) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        razorpayPaymentId,
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    })

    // Check if all required payments are completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const totalPaid = booking.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0)

    // Update booking status based on payment
    let newStatus = booking.status
    if (booking.paymentType === 'FULL' && totalPaid >= booking.totalAmount) {
      newStatus = 'CONFIRMED'
    } else if (booking.paymentType === 'PARTIAL_50' && totalPaid >= booking.totalAmount * 0.5) {
      newStatus = 'CONFIRMED'
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    })

    return NextResponse.json({
      success: true,
      bookingStatus: newStatus,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
