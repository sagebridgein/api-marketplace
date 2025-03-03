import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { token, amount, description } = body

    if (!token || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Create the charge
    const charge = await stripe.charges.create({
      amount: 30, // Amount in cents
      currency: 'usd',
      description: description || 'Default charge description',
      source: token,
    })
    // Return the charge result
    return NextResponse.json({ success: true, charge })
  } catch (error) {
    console.error('Stripe charge error:', error)
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    )
  }
}
