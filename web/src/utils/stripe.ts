import "server-only";

import Stripe from "stripe";
import { env } from "@/utils/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});
