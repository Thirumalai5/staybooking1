import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BookingSuccessPage({
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

  const totalPaid = booking.payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const remainingAmount = booking.totalAmount - totalPaid

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Stay Booking
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your payment was successful</p>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Property:</strong> {booking.property.name}</p>
              <p><strong>Guest Name:</strong> {booking.guestName}</p>
              <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-semibold">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid Online</span>
                <span className="font-semibold">{formatCurrency(totalPaid)}</span>
              </div>
              {remainingAmount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Pay on Arrival</span>
                  <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to <strong>{booking.guestEmail}</strong>
            </p>
          </div>

          {remainingAmount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please pay {formatCurrency(remainingAmount)} on arrival at the property.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/properties"
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-300 text-center"
            >
              Browse More Properties
            </Link>
            <Link
              href="/"
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
