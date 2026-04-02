import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppOTP(mobile, otp) {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${mobile}`,
      body: `Your OTP is ${otp}`
    });

    console.log("✅ WhatsApp sent:", message.sid);

  } catch (err) {
    console.log("❌ WhatsApp Error:", err.message);
  }
}