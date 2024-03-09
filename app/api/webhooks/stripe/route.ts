import { createTransaction } from "@/lib/actions/transaction.action";
import stripe from "stripe";

export async function POST(request: Request) {
  // Parse request body
  const body = await request.text();

  // Get Stripe signature and webhook secret
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Construct Stripe event object
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    // Handle webhook construction errors
    return new Response(
      JSON.stringify({ message: "Webhook error", error: err }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Extract event type
  const eventType = event.type;

  // Handle "checkout.session.completed" event type
  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;

    // Create transaction object with extracted data
    const transaction = {
      stripeId: id,
      amount: amount_total ? amount_total / 100 : 0,
      plan: metadata?.plan || "",
      credits: Number(metadata?.credits) || 0,
      buyerId: metadata?.buyerId || "",
      createdAt: new Date(),
    };

    // Create new transaction
    const newTransaction = await createTransaction(transaction);

    // Return response
    return new Response(
      JSON.stringify({ message: "OK", transaction: newTransaction }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Return empty response for other events
  return new Response("", { status: 200 });
}
