import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    where: {
      isActive: true,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Stay Booking
            </Link>
            <nav className="flex gap-4">
              <Link href="/properties" className="text-blue-600 font-semibold">
                Properties
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Owner Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
                  {property.photos[0] ? (
                    <img
                      src={property.photos[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(property.pricePerNight)}/night
                    </span>
                    <span className="text-sm text-gray-500">
                      Max {property.maxGuests} guests
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
