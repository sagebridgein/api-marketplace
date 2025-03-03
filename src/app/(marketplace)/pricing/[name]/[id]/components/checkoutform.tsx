import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement, TokenResult } from '@stripe/stripe-js';

import CardSection from './cardsection';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    
    if (!card) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    const result = await stripe.createToken(card);
    
    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
    } else {
      try {
        await stripeTokenHandler(result);
        // Handle successful payment here
      } catch (err) {
        setError('Payment processing failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
      <CardSection />
      {error && (
        <div className="text-red-500 text-sm py-2">
          {error}
        </div>
      )}
      <button 
        disabled={!stripe || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white
          ${!stripe || isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 transition-colors'
          }`}
      >
        {isLoading ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
}

interface PaymentData {
  token: string;
  amount: number;
  description: string;
}

async function stripeTokenHandler(token: TokenResult): Promise<any> {
  const paymentData: PaymentData = {
    token: token.token?.id!,
    amount: 10,
    description: 'Test charge'
  };

  const response = await fetch('/api/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Payment failed');
  }

  return response.json();
}