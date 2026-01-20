import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const properties = await prisma.property.findMany({
    include: {
      bookings: {
        include: {
          payments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const allBookings = await prisma.booking.findMany({
    include: {
      property: true,
      payments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalRevenue = allBookings
    .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum: number, b: any) => {
      const paid = b.payments
        .filter((p: any) => p.status === 'COMPLETED')
        .reduce((s: number, p: any) => s + p.amount, 0)
      return sum + paid
    }, 0)

  const pendingBookings = allBookings.filter((b: any) => b.status === 'PENDING').length
  const confirmedBookings = allBookings.filter((b: any) => b.status === 'CONFIRMED').length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Stay Booking
            </Link>
            <nav className="flex gap-4">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">
                Properties
              </Link>
              <Link href="/dashboard" className="text-blue-600 font-semibold">
                Owner Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-1">Total Properties</p>
            <p className="text-3xl font-bold">{properties.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-1">Pending Bookings</p>
            <p className="text-3xl font-bold text-orange-600">{pendingBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-1">Confirmed Bookings</p>
            <p className="text-3xl font-bold text-blue-600">{confirmedBookings}</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          {allBookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBookings.slice(0, 10).map((booking: any) => {
                    const totalPaid = booking.payments
                      .filter((p: any) => p.status === 'COMPLETED')
                      .reduce((sum: number, p: any) => sum + p.amount, 0)
                    
                    return (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                          <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.property.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(totalPaid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Properties</h2>
          {properties.length === 0 ? (
            <p className="text-gray-500">No properties yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property: any) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{property.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {property.bookings.filter((b: any) => b.status === 'CONFIRMED').length} bookings
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(property.pricePerNight)}/night
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      property.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
