"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import { connectToDatabase } from "@/lib/database/mongo";
import Transaction from "@/lib/database/models/transaction.model";
import {
  TYPE_CHECKOUT_TRANSACTION,
  TYPE_CREATE_TRANSACTION,
} from "@/types/type.transaction";
import { updateCredits } from "./user.action";

// Initiate the Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Checkout credits using Stripe Checkout
export async function checkoutCredits(transaction: TYPE_CREATE_TRANSACTION) {
  // Calculate the amount in cents
  const amount = Number(transaction.amount) * 100;

  // Create a new Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  // Redirect to the Stripe Checkout session URL
  redirect(session.url!);
}

// Create a new transaction in the database
export async function createTransaction(
  transaction: TYPE_CHECKOUT_TRANSACTION
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new transaction with the buyer ID
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    // Update the buyer's credits
    await updateCredits(transaction.buyerId, transaction.credits);

    // Return the newly created transaction
    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
