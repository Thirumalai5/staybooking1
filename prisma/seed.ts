import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create a sample owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@staybooking.com' },
    update: {},
    create: {
      email: 'owner@staybooking.com',
      name: 'Property Owner',
      role: 'OWNER',
    },
  })

  console.log('Created owner:', owner)

  // Create sample properties
  const property1 = await prisma.property.upsert({
    where: { id: 'sample-property-1' },
    update: {},
    create: {
      id: 'sample-property-1',
      name: 'Cozy Beach House in Goa',
      description: 'A beautiful beach house with stunning ocean views. Perfect for families and groups looking for a relaxing getaway. The house features 3 bedrooms, a fully equipped kitchen, and a private balcony overlooking the beach.',
      location: 'Calangute, Goa, India',
      amenities: ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Kitchen', 'Parking', 'Beach Access'],
      photos: [
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      ],
      videos: [],
      pricePerNight: 500000, // ₹5000 in paise
      maxGuests: 6,
      isActive: true,
      ownerId: owner.id,
    },
  })

  const property2 = await prisma.property.upsert({
    where: { id: 'sample-property-2' },
    update: {},
    create: {
      id: 'sample-property-2',
      name: 'Mountain Retreat in Manali',
      description: 'Experience the serenity of the Himalayas in this charming mountain cottage. Ideal for couples and small families. Features 2 bedrooms, fireplace, and panoramic mountain views.',
      location: 'Old Manali, Himachal Pradesh, India',
      amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Kitchen', 'Parking', 'Hiking Trails'],
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      ],
      videos: [],
      pricePerNight: 350000, // ₹3500 in paise
      maxGuests: 4,
      isActive: true,
      ownerId: owner.id,
    },
  })

  const property3 = await prisma.property.upsert({
    where: { id: 'sample-property-3' },
    update: {},
    create: {
      id: 'sample-property-3',
      name: 'Heritage Villa in Jaipur',
      description: 'Stay in a beautifully restored heritage villa in the heart of Jaipur. This property combines traditional Rajasthani architecture with modern amenities. Features 4 bedrooms, a courtyard, and rooftop terrace.',
      location: 'Pink City, Jaipur, Rajasthan, India',
      amenities: ['WiFi', 'Air Conditioning', 'Rooftop Terrace', 'Traditional Decor', 'Parking', 'City View'],
      photos: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      ],
      videos: [],
      pricePerNight: 800000, // ₹8000 in paise
      maxGuests: 8,
      isActive: true,
      ownerId: owner.id,
    },
  })

  console.log('Created properties:', [property1.name, property2.name, property3.name])

  // Create a sample guest
  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      name: 'Sample Guest',
      role: 'GUEST',
    },
  })

  console.log('Created guest:', guest)

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      propertyId: property1.id,
      guestId: guest.id,
      checkInDate: new Date('2024-12-25'),
      checkOutDate: new Date('2024-12-28'),
      numberOfGuests: 4,
      guestName: 'Sample Guest',
      guestEmail: 'guest@example.com',
      guestPhone: '+91 9876543210',
      totalAmount: 1770000, // 3 nights * 500000 + 18% GST
      gstAmount: 270000,
      status: 'CONFIRMED',
      paymentType: 'FULL',
    },
  })

  console.log('Created booking:', booking)

  // Create a payment for the booking
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: 1770000,
      gstAmount: 270000,
      status: 'COMPLETED',
      paymentMethod: 'ONLINE',
      paidAt: new Date(),
    },
  })

  console.log('Created payment:', payment)

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
