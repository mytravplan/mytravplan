import nodemailer from 'nodemailer';

export const SendEmail = async ({ name, email, phone_number, message, formType, date, origin, destination, traveler, children, phoneNumber, registerusername, packageDetails }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: process.env.NEXT_PUBLIC_SMPT_GMAI_PORT,
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                pass: process.env.NEXT_PUBLIC_SMPT_GMAIL_PASS
            }
        });



        let userMailOptions;
        let adminMailOptions;

        if (formType === 'booking') {
            userMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: email,
                subject: 'Thank you for contacting us',
                html: `<p>Dear ${name},</p>
                       <p>Thank you for reaching out to us. We have received your message:</p>
                       <p>${message}</p>
                       ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.title} (Slug: ${packageDetails.slug})</p>` : ''}
                       <p>We will get back to you soon.</p>`
            };

            adminMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                subject: 'New Booking Form Submission',
                html: `<p>New Booking submission received:</p>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone Number:</strong> ${phone_number}</p>
                       <p><strong>Message:</strong> ${message}</p>
                       ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.title} (Slug: ${packageDetails.slug})</p>` : ''}`
            };
        }

        else if (formType === 'contact') {
            userMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: email,
                subject: 'Thank you for contacting us',
                html: `<p>Dear ${name},</p>
                       <p>Thank you for reaching out to us. We have received your message:</p>
                       <p>${message}</p>
                       ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.title} (Slug: ${packageDetails.slug})</p>` : ''}
                       <p>We will get back to you soon.</p>`
            };

            adminMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                subject: 'New contact Form Submission',
                html: `<p>New contact submission received:</p>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone Number:</strong> ${phone_number}</p>
                       <p><strong>Message:</strong> ${message}</p>
                       ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.title} (Slug: ${packageDetails.slug})</p>` : ''}`
            };
        }
        if (formType === 'user_register_form') {
            userMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: email,
                subject: 'Registration Successful - Welcome to Our Platform!',
                html: `<p>Dear ${registerusername},</p>
                       <p>Thank you for registering with us. We're excited to have you on board!</p>
                       <p>Here are the details you provided:</p>
                       <p><strong>Name:</strong> ${registerusername}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                       <p><strong>Message:</strong> ${message}</p>
                       <p>If you have any questions or need further assistance, feel free to reach out.</p>
                       <p>Best regards,<br>Your Company Team</p>`
            };

            adminMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                subject: 'New User Registration Notification',
                html: `<p>A new user has successfully registered:</p>
                       <p><strong>Name:</strong> ${registerusername}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                       <p><strong>Message:</strong> ${message}</p>
                       <p>Please review and proceed with any necessary actions.</p>`
            };
        }



        else if (formType === 'flights') {
            userMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: email,
                subject: 'Thank you for your flight inquiry',
                html: `<p>Dear ${name},</p>
                       <p>Thank you for your flight inquiry. We have received the following details:</p>
                       <p><strong>Date:</strong> ${date}</p>
                       <p><strong>Origin:</strong> ${origin}</p>
                       <p><strong>Destination:</strong> ${destination}</p>
                       <p><strong>Traveler:</strong> ${traveler}</p>
                       <p><strong>Children:</strong> ${children}</p>
                       <p><strong>Message:</strong> ${message}</p>
                       <p>We will get back to you soon.</p>`
            };

            adminMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                subject: 'New Flight Inquiry Submission',
                html: `<p>New flight inquiry submission received:</p>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Phone Number:</strong> ${phone_number}</p>
                       <p><strong>Date:</strong> ${date}</p>
                       <p><strong>Origin:</strong> ${origin}</p>
                       <p><strong>Destination:</strong> ${destination}</p>
                       <p><strong>Traveler:</strong> ${traveler}</p>
                       <p><strong>Children:</strong> ${children}</p>
                       <p><strong>Message:</strong> ${message}</p>`
            };
        } else if (formType === 'userlogin') {
            userMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: phoneNumber,
                subject: 'Registration Confirmation',
                html: `<p>Dear ${registerusername},</p>
                       <p>Thank you for registering with us. Your registration details are:</p>
                       <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                       <p><strong>Username:</strong> ${registerusername}</p>`
            };

            adminMailOptions = {
                from: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                to: process.env.NEXT_PUBLIC_SMPT_GMAIL,
                subject: 'New User Registration',
                html: `<p>New user registration received:</p>
                       <p><strong>Name:</strong> ${registerusername}</p>
                       <p><strong>Phone Number:</strong> ${phoneNumber}</p>`
            };

            userMailOptions = null;
        } else {
            throw new Error('Unsupported form type');
        }

        if (userMailOptions) {
            await transporter.sendMail(userMailOptions);
        }

        if (adminMailOptions) {
            const adminMailResponse = await transporter.sendMail(adminMailOptions);
            return { adminMailResponse };
        } else {
            throw new Error('No admin email options defined');
        }
    } catch (error) {
        console.error('Error sending emails:', error.message);
        throw new Error('Error sending emails: ' + error.message);
    }
};
