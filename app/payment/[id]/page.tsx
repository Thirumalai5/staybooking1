import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PaymentButton from '@/app/components/PaymentButton'
import { formatCurrency } from '@/lib/currency'

export default async function PaymentPage({
  params,
}: {
  params: { id: string }
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      property: true,
      payments: true,
    },
  })

  if (!booking) {
    notFound()
  }

  const amountToPay = booking.paymentType === 'PARTIAL_50'
    ? Math.round(booking.totalAmount * 0.5)
    : booking.totalAmount

  const remainingAmount = booking.paymentType === 'PARTIAL_50'
    ? Math.round(booking.totalAmount * 0.5)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Stay Booking</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

          {/* Booking Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Property:</strong> {booking.property.name}</p>
              <p><strong>Guest Name:</strong> {booking.guestName}</p>
              <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Booking Amount (incl. GST)</span>
                <span className="font-semibold">{formatCurrency(booking.totalAmount)}</span>
              </div>
              {booking.paymentType === 'PARTIAL_50' && (
                <>
                  <div className="flex justify-between text-blue-600">
                    <span>Pay Now (50%)</span>
                    <span className="font-semibold">{formatCurrency(amountToPay)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pay on Arrival</span>
                    <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <PaymentButton
            bookingId={booking.id}
            amount={amountToPay}
            guestName={booking.guestName}
            guestEmail={booking.guestEmail}
            guestPhone={booking.guestPhone}
          />

          {/* Payment Methods */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>We accept all major credit cards, debit cards, and UPI payments</p>
            <p className="mt-2">Powered by Razorpay - India's most trusted payment gateway</p>
          </div>
        </div>
      </main>
    </div>
  )
}
