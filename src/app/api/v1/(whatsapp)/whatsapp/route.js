// src/app/api/v1/whatsapp/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const MSG91_API_KEY = '395984AnEdLjK8v66c88132P1395984AnEdLjK8v66c88132P1';
const MSG91_WHATSAPP_API_URL = 'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';

export async function POST(req) {
  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    const response = await axios.post(MSG91_WHATSAPP_API_URL, {
      sender: 'YourSenderID', // Replace with your sender ID or WhatsApp number
      route: '1', // 1 for transactional messages
      countryCode: '91', // Replace with your country code
      to: phoneNumber, // Recipient phone number
      message: message, // Message content
      authkey: MSG91_API_KEY // Your MSG91 API key
    });

    if (response.data.type !== 'success') {
      return NextResponse.json(
        { error: 'Failed to send message', details: response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent', response: response.data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}
