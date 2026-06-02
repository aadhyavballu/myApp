Deno.serve(async (req: Request) => {
  try {
    const { email, name } = await req.json();

    console.log("Received:", email, name);

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_h3bqu8s",
        template_id: "template_bwg9w4a",
        user_id: "yGcJhsqBFP4lXEU-o",
        template_params: {
          name: name,
          email: email,
        },
      }),
    });

    const text = await res.text();

    return new Response(
      JSON.stringify({ success: true, status: res.status, message: text }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
