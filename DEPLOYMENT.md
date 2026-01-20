# Stay Booking Website - Deployment Guide

## Overview
A complete booking website built for an Indian stay business with Next.js, TypeScript, Prisma, and Razorpay.

## Prerequisites
- Node.js 18 or later
- PostgreSQL database
- Razorpay account with API keys

## Quick Start

### 1. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Update `.env` with your actual credentials:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
RAZORPAY_KEY_ID="your_actual_key_id"
RAZORPAY_KEY_SECRET="your_actual_key_secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
GST_RATE=0.18
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Generate Prisma client:
```bash
npx prisma generate
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

Seed sample data (optional):
```bash
npm run db:seed
```

### 4. Development
Run the development server:
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Production Build
```bash
npm run build
npm start
```

## Features Checklist

### ✅ Property Management
- Property listings with photos and videos
- Detailed property pages
- Amenities showcase
- Location information

### ✅ Booking System
- Date-based booking with date picker
- Guest information collection
- Availability checking (prevents double bookings)
- Number of guests selection

### ✅ Payment Integration
- Razorpay payment gateway
- Two payment options:
  - Full payment online
  - 50% deposit (rest on arrival)
- Multiple payment tracking per booking
- Payment verification and confirmation

### ✅ Currency & Taxation
- All amounts stored in paise (100 paise = 1 INR)
- Automatic 18% GST calculation
- Clear price breakdown
- INR currency formatting

### ✅ Owner Dashboard
- View all bookings
- Track total revenue
- Monitor pending/confirmed bookings
- Property management overview
- Payment status tracking

## Database Schema

### Models
- **User**: Guest and owner accounts
- **Property**: Accommodation listings
- **Booking**: Reservation records
- **Payment**: Payment transactions

All monetary values stored in paise for precision.

## API Endpoints

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List bookings (with filters)

### Payments
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

## Pages

- `/` - Home page
- `/properties` - Property listings
- `/properties/[id]` - Property details & booking
- `/payment/[id]` - Payment page
- `/booking-success/[id]` - Booking confirmation
- `/dashboard` - Owner dashboard

## Payment Flow

1. Guest selects property and dates
2. System checks availability
3. Guest enters details and chooses payment option
4. Booking created with PENDING status
5. Razorpay payment gateway opens
6. Payment processed
7. Payment verified via webhook/callback
8. Booking status updated to CONFIRMED
9. Guest redirected to success page

## Security Considerations

### Implemented
- Input validation on client-side
- Server-side validation in API routes
- Razorpay signature verification
- Environment variables for sensitive data
- Type-safe API routes

### Recommended for Production
- Add authentication (NextAuth.js)
- Implement rate limiting
- Add CSRF protection
- Enable SSL/HTTPS
- Set up proper CORS policies
- Add request logging
- Implement API key rotation
- Add database connection pooling limits

## Customization

### Adding Properties
Run seed script or use database client to insert properties:
```bash
npm run db:seed
```

### Updating GST Rate
Change `GST_RATE` in `.env` file.

### Customizing Payment Options
Edit `app/components/BookingForm.tsx` to add/remove payment types.

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check network connectivity

### Payment Gateway Issues
- Verify Razorpay credentials
- Check API key permissions
- Test in Razorpay test mode first

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma client: `npx prisma generate`
- Clear node_modules and reinstall

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Razorpay Documentation](https://razorpay.com/docs)

## License
ISC
