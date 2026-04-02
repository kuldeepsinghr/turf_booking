import axios from "axios";

export async function sendSMS(mobile, otp) {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: `91${mobile}`,
            VAR1: otp
          }
        ]
      },
      {
        headers: {
          accept: "application/json",
          authkey: process.env.MSG91_API_KEY,
          "content-type": "application/json"
        }
      }
    );

    console.log("✅ SMS Sent:", response.data);

    return response.data;

  } catch (error) {
    console.log(
      "❌ SMS Error:",
      error.response?.data || error.message
    );
  }
}