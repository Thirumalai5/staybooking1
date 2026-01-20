# Stay Booking Website

A booking website built with Next.js, TypeScript, Prisma, and Razorpay for an Indian stay business.

## Features

- **Property Listings**: Browse available properties with photos and videos
- **Date-based Booking**: Select check-in and check-out dates
- **Flexible Payments**:
  - Pay full amount online
  - Pay 50% deposit online, remaining on arrival
  - Track multiple payments per booking
- **Razorpay Integration**: Secure payment processing
- **GST Support**: Automatic 18% GST calculation
- **Currency**: All amounts stored in paise (smallest INR unit)
- **Owner Dashboard**: Manage properties, bookings, and track revenue

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Razorpay
- **Date Picker**: React DatePicker

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Thirumalai5/staybooking1.git
cd staybooking1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/staybooking?schema=public"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GST_RATE=0.18
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. (Optional) Seed the database with sample data:
```bash
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### Models

- **User**: Guests and property owners
- **Property**: Stay properties with photos, videos, amenities
- **Booking**: Reservations with check-in/out dates
- **Payment**: Payment records with Razorpay integration

All monetary values are stored in paise (1 INR = 100 paise).

## API Routes

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify Razorpay payment

## Pages

- `/` - Home page
- `/properties` - Property listings
- `/properties/[id]` - Property details and booking
- `/payment/[id]` - Payment page
- `/booking-success/[id]` - Booking confirmation
- `/dashboard` - Owner dashboard

## Payment Flow

1. Guest selects property and dates
2. Guest enters details and chooses payment option (Full or 50%)
3. Booking is created with PENDING status
4. Razorpay payment gateway is opened
5. On successful payment, booking status changes to CONFIRMED
6. Guest receives confirmation

## License

ISC

