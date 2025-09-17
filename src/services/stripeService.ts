import { loadStripe } from "@stripe/stripe-js";
import { getBaseUrl } from "./utils/baseUrl";

// ✅ Use your actual publishable key from Stripe dashboard
const stripePromise = loadStripe("pk_test_51S3CpN4rhKiNPSDZs6TSA1Zfxh6LWyQ6zjtR3ugfM3rUk2x9USatYzrE85pzo4SFwJW9tTdOaXN0htgrsXkWCpX7001UeZ9cUe");

/**
 * Upgrade user to Pro using Stripe Checkout
 */
export const upgradeToPro = async (userId: number) => {
  try {
    const stripe = await stripePromise;
    const baseUrl = await getBaseUrl();

    // Call backend to create checkout session
    const response = await fetch(`${baseUrl}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro", userId }), // ✅ send userId
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      throw new Error(result.error.message);
    }
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    alert(error.message || "Something went wrong with Stripe");
  }
};
