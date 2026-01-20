import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/currency'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BookingForm from '@/app/components/BookingForm'

export const dynamic = 'force-dynamic'

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await prisma.property.findUnique({
    where: {
      id: params.id,
    },
    include: {
      owner: true,
    },
  })

  if (!property || !property.isActive) {
    notFound()
  }

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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Owner Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/properties" className="text-blue-600 hover:text-blue-800">
            ← Back to Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
            <p className="text-gray-600 mb-6">{property.location}</p>

            {/* Photos */}
            {property.photos.length > 0 && (
              <div className="mb-6">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={property.photos[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {property.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.photos.slice(1, 5).map((photo: string, index: number) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`${property.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {property.videos.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Video Tour</h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <video
                    src={property.videos[0]}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">About this property</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Info */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Price per night</p>
                  <p className="text-lg font-bold">{formatCurrency(property.pricePerNight)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maximum guests</p>
                  <p className="text-lg font-bold">{property.maxGuests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <BookingForm
                propertyId={property.id}
                pricePerNight={property.pricePerNight}
                maxGuests={property.maxGuests}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
