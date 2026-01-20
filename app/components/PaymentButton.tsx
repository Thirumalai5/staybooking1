'use client'

import { useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentButtonProps {
  bookingId: string
  amount: number
  guestName: string
  guestEmail: string
  guestPhone: string
}

export default function PaymentButton({
  bookingId,
  amount,
  guestName,
  guestEmail,
  guestPhone,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId, amount, currency, keyId, paymentId } = await orderResponse.json()

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Stay Booking',
        description: 'Property Booking Payment',
        order_id: orderId,
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
        },
        theme: {
          color: '#2563EB',
        },
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId,
                bookingId,
              }),
            })

            if (verifyResponse.ok) {
              // Redirect to success page using client-side navigation
              const router = require('next/navigation').useRouter
              if (typeof window !== 'undefined') {
                window.location.href = `/booking-success/${bookingId}`
              }
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to process payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={isProcessing || !isScriptLoaded}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : isScriptLoaded ? 'Pay Now' : 'Loading...'}
      </button>
    </>
  )
}
