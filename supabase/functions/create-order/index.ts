import Razorpay from "npm:razorpay";

const razorpay = new Razorpay({
  key_id: Deno.env.get("RAZORPAY_KEY_ID"),
  key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
});

Deno.serve(async (req: Request) => {
  const { amount } = await req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return new Response(JSON.stringify(order), {
    headers: { "Content-Type": "application/json" },
  });
});
