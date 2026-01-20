'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatCurrency, rupeesToPaise, calculateGST, paiseToRupees } from '@/lib/currency'

interface BookingFormProps {
  propertyId: string
  pricePerNight: number
  maxGuests: number
}

export default function BookingForm({ propertyId, pricePerNight, maxGuests }: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [paymentType, setPaymentType] = useState<'FULL' | 'PARTIAL_50'>('FULL')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const nights = calculateNights()
  const subtotal = pricePerNight * nights
  const gstAmount = calculateGST(subtotal)
  const total = subtotal + gstAmount
  const depositAmount = paymentType === 'PARTIAL_50' ? Math.round(total * 0.5) : total

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!guestName.trim() || guestName.length < 2) {
      alert('Please enter a valid name')
      return
    }

    if (!guestEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address')
      return
    }

    if (!guestPhone.match(/^\+?[0-9]{10,15}$/)) {
      alert('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          checkInDate,
          checkOutDate,
          numberOfGuests,
          guestName,
          guestEmail,
          guestPhone,
          paymentType,
          totalAmount: total,
          gstAmount,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const booking = await response.json()
      
      // Redirect to payment page
      window.location.href = `/payment/${booking.id}`
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Book Your Stay</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <DatePicker
              selected={checkInDate}
              onChange={(date: Date | null) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholderText="Select date"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date: Date | null) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate || new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholderText="Select date"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <select
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guest Name
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Option
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="FULL"
                checked={paymentType === 'FULL'}
                onChange={() => setPaymentType('FULL')}
                className="mr-2"
              />
              <span>Pay Full Amount Online</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="PARTIAL_50"
                checked={paymentType === 'PARTIAL_50'}
                onChange={() => setPaymentType('PARTIAL_50')}
                className="mr-2"
              />
              <span>Pay 50% Now, Rest on Arrival</span>
            </label>
          </div>
        </div>

        {nights > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(pricePerNight)} × {nights} nights</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (18%)</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {paymentType === 'PARTIAL_50' && (
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>Pay Now (50%)</span>
                <span>{formatCurrency(depositAmount)}</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !checkInDate || !checkOutDate}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  )
}
