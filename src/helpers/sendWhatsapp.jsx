export async function sendWhatsAppMessage({ phone_number, templateId, bodyValues }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_OTP_URL}/v1/api/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'clientId': process.env.NEXT_PUBLIC_CLIENT_ID,
                'clientSecret': process.env.NEXT_PUBLIC_CLIENT_SECRET,
            },
            body: JSON.stringify({
                sendTo: phone_number,
                channel: 'WHATSAPP',
                templateId: templateId,
                bodyValues: bodyValues,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(`WhatsApp API Error: ${result.message || 'Unknown error'}`);
        }

        console.log(`WhatsApp message sent successfully to ${phone_number}`);
        return result;
    } catch (error) {
        console.error(`Error sending WhatsApp message to ${phone_number}:`, error.message);
        throw new Error('Error sending WhatsApp message');
    }
}
