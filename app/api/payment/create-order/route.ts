import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'
import { paiseToRupees } from '@/lib/currency'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Calculate amount to pay
    const amountToPay = booking.paymentType === 'PARTIAL_50'
      ? Math.round(booking.totalAmount * 0.5)
      : booking.totalAmount

    const gstAmount = booking.paymentType === 'PARTIAL_50'
      ? Math.round(booking.gstAmount * 0.5)
      : booking.gstAmount

    // Create Razorpay order (amount should be in paise)
    const order = await razorpay.orders.create({
      amount: amountToPay,
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        propertyId: booking.propertyId,
        paymentType: booking.paymentType,
      },
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: amountToPay,
        gstAmount,
        razorpayOrderId: order.id,
        status: 'PENDING',
        paymentMethod: 'ONLINE',
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: amountToPay,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
