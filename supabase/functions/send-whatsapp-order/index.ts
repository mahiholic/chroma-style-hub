const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_WHATSAPP_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
      throw new Error('Twilio credentials not configured');
    }

    const { orderNumber, customerName, phone, email, address, items, total, paymentMethod, orderDate } = await req.json();

    const itemsList = (items || [])
      .map((i: { name: string; quantity: number; price: number }) => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`)
      .join('\n');

    const message =
      `🛒 *New Order Placed!*\n\n` +
      `*Order:* ${orderNumber}\n` +
      `*Date:* ${orderDate}\n` +
      `*Customer:* ${customerName}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Address:* ${address}\n` +
      `*Payment:* ${paymentMethod}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Total:* ₹${total}`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    // Ensure both From and To have the whatsapp: prefix
    const fromNumber = TWILIO_WHATSAPP_FROM.startsWith('whatsapp:')
      ? TWILIO_WHATSAPP_FROM
      : `whatsapp:${TWILIO_WHATSAPP_FROM}`;

    const body = new URLSearchParams({
      From: fromNumber,
      To: 'whatsapp:+918595444216',
      Body: message,
    });

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error('Twilio error:', twilioData);
      throw new Error(`Twilio API error [${twilioRes.status}]: ${JSON.stringify(twilioData)}`);
    }

    return new Response(JSON.stringify({ success: true, sid: twilioData.sid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('WhatsApp notification error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
