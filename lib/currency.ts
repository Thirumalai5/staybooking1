// Convert rupees to paise
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

// Convert paise to rupees
export function paiseToRupees(paise: number): number {
  return paise / 100
}

// Calculate GST amount
export function calculateGST(amount: number, gstRate: number = 0.18): number {
  return Math.round(amount * gstRate)
}

// Calculate total with GST
export function calculateTotalWithGST(amount: number, gstRate: number = 0.18): number {
  const gst = calculateGST(amount, gstRate)
  return amount + gst
}

// Format currency in INR
export function formatCurrency(paise: number): string {
  const rupees = paiseToRupees(paise)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(rupees)
}
