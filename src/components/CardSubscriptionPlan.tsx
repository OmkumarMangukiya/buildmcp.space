"use client";

import { useState } from 'react';
import ButtonPayPal from './ButtonPayPal';

interface CardSubscriptionPlanProps {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  mcpLimit: number | null;
  userId: string;
  isPopular?: boolean;
}

export default function CardSubscriptionPlan({
  id,
  name,
  description,
  price,
  currency,
  interval,
  mcpLimit,
  userId,
  isPopular = false
}: CardSubscriptionPlanProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`rounded-xl border ${isPopular ? 'border-blue-500 shadow-lg shadow-blue-900/20' : 'border-zinc-800'} bg-zinc-900 p-6 hover:shadow-lg transition-shadow relative`}>
      {isPopular && (
        <div className="absolute -top-3 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
          MOST POPULAR
        </div>
      )}
      
      <h3 className="text-xl font-bold text-zinc-100">{name}</h3>
      <p className="mt-2 text-zinc-400">{description}</p>
      
      <div className="mt-4 flex items-end">
        <span className="text-4xl font-bold text-zinc-100">${price}</span>
        <span className="ml-1 text-zinc-400">/{interval}</span>
      </div>
      
      <ul className="mt-6 space-y-3">
        <li className="flex items-start">
          <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-zinc-300">
            {mcpLimit ? `Up to ${mcpLimit} MCP generations` : 'Unlimited MCP generations'}
          </span>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-zinc-300">Access to all features</span>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="ml-2 text-zinc-300">Email support</span>
        </li>
      </ul>
      
      <div className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full rounded-lg ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-800 hover:bg-zinc-700'} px-4 py-2 text-center text-sm font-semibold text-white transition-colors`}
        >
          {isExpanded ? 'Hide Payment Options' : 'Subscribe Now'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-400 mb-4">Secure payment via PayPal</p>
          <ButtonPayPal
            planId={id}
            userId={userId}
            planName={name}
            planPrice={price}
            planCurrency={currency}
          />
        </div>
      )}
    </div>
  );
} 