const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const normalizeWhatsAppAddress = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('WhatsApp number is empty');

  const withoutPrefix = trimmed.replace(/^whatsapp:/i, '').replace(/\s+/g, '');
  const normalizedNumber = withoutPrefix.startsWith('+') ? withoutPrefix : `+${withoutPrefix}`;
  return `whatsapp:${normalizedNumber}`;
};

const maskWhatsAppAddress = (value: string) => {
  const core = value.replace(/^whatsapp:/i, '');
  const suffix = core.slice(-4);
  return `whatsapp:***${suffix}`;
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

    const ADMIN_WHATSAPP_TO = Deno.env.get('ADMIN_WHATSAPP_TO') ?? '+918595444216';

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

    const fromNumber = normalizeWhatsAppAddress(TWILIO_WHATSAPP_FROM);
    const toNumber = normalizeWhatsAppAddress(ADMIN_WHATSAPP_TO);

    console.log(`Sending WhatsApp notification ${maskWhatsAppAddress(fromNumber)} -> ${maskWhatsAppAddress(toNumber)}`);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const body = new URLSearchParams({
      From: fromNumber,
      To: toNumber,
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

      if (twilioData?.code === 21910) {
        throw new Error('Twilio 21910: channel mismatch. Set TWILIO_WHATSAPP_FROM to your Twilio WhatsApp sender (sandbox: whatsapp:+14155238886).');
      }

      throw new Error(`Twilio API error [${twilioRes.status}]: ${JSON.stringify(twilioData)}`);
    }

    return new Response(JSON.stringify({ success: true, sid: twilioData.sid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('WhatsApp notification error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';

    // Keep checkout flow successful even if background notification fails
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
