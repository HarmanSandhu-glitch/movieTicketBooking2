import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';
import logger from './logger.js';
import { createTransport } from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: "99c961001@smtp-brevo.com",
      pass: "xsmtpsib-9ee341a7ab38a326b231b2f56aeda90f04f35becb4a4cf97bf7ddc8ec657138a-4DlxUqk2lxcpVeoB"
    }
  });

};

const emailTemplates = {
  ticketBooking: (bookingData) => ({
    subject: `🎬 Your Movie Ticket Booking Confirmation - ${bookingData.showName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">🎬 Movie Ticket Booking Confirmation</h1>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2c3e50; margin-bottom: 15px;">${bookingData.showName}</h2>

          <div style="margin: 15px 0;">
            <strong>Cinema Hall:</strong> ${bookingData.hallName}<br>
            <strong>Location:</strong> ${bookingData.hallLocation}<br>
            <strong>Show Time:</strong> ${new Date(bookingData.showTime).toLocaleString()}<br>
            <strong>Duration:</strong> ${bookingData.duration} minutes<br>
          </div>

          <div style="margin: 15px 0;">
            <strong>Seats Booked:</strong> ${bookingData.seats.join(', ')}<br>
            <strong>Number of Tickets:</strong> ${bookingData.seats.length}<br>
          </div>

          <div style="margin: 15px 0; padding: 10px; background: #e8f4f8; border-radius: 4px;">
            <strong>Booking ID:</strong> ${bookingData.bookingId}<br>
            <strong>Booking Date:</strong> ${new Date(bookingData.bookingDate).toLocaleString()}
          </div>
        </div>

        <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong>✅ Booking Confirmed!</strong><br>
          Please arrive at least 30 minutes before show time.<br>
          Show your booking ID or this email at the venue.
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          <p>Thank you for choosing our cinema!</p>
          <p>If you need to cancel or modify your booking, please contact us.</p>
        </div>
      </div>
    `,
    text: `
🎬 Movie Ticket Booking Confirmation

Show: ${bookingData.showName}
Cinema Hall: ${bookingData.hallName}
Location: ${bookingData.hallLocation}
Show Time: ${new Date(bookingData.showTime).toLocaleString()}
Duration: ${bookingData.duration} minutes

Seats Booked: ${bookingData.seats.join(', ')}
Number of Tickets: ${bookingData.seats.length}

Booking ID: ${bookingData.bookingId}
Booking Date: ${new Date(bookingData.bookingDate).toLocaleString()}

✅ Booking Confirmed! Please arrive 30 minutes before show time.

Thank you for choosing our cinema!
`
  }),

  bookingCancellation: (bookingData) => ({
    subject: `❌ Booking Cancellation Confirmed - ${bookingData.showName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545; text-align: center;">❌ Booking Cancellation Confirmed</h1>

        <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Your booking has been successfully cancelled.</p>

          <div style="margin: 15px 0;">
            <strong>Show:</strong> ${bookingData.showName}<br>
            <strong>Booking ID:</strong> ${bookingData.bookingId}<br>
            <strong>Cancellation Time:</strong> ${new Date().toLocaleString()}
          </div>

          <p>You will receive a refund within 3-5 business days according to your payment method.</p>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          <p>Thank you for understanding.</p>
        </div>
      </div>
    `,
    text: `
❌ Booking Cancellation Confirmed

Your booking has been successfully cancelled.
Show: ${bookingData.showName}
Booking ID: ${bookingData.bookingId}
Cancellation Time: ${new Date().toLocaleString()}

You will receive a refund within 3-5 business days.
Thank you for understanding.
`
  }),

  showReminder: (reminderData) => ({
    subject: `⏰ Show Reminder: ${reminderData.showName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ffc107; text-align: center;">⏰ Movie Show Reminder</h1>

        <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-bottom: 15px;">${reminderData.showName}</h2>

          <div style="margin: 15px 0;">
            <strong>Cinema Hall:</strong> ${reminderData.hallName}<br>
            <strong>Location:</strong> ${reminderData.hallLocation}<br>
            <strong>Show Time:</strong> ${new Date(reminderData.showTime).toLocaleString()}<br>
            <strong>Your Seats:</strong> ${reminderData.seats.join(', ')}<br>
          </div>

          <p><strong>⏰ Please arrive at least 30 minutes before show time.</strong></p>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          <p>Enjoy your movie experience!</p>
        </div>
      </div>
    `,
    text: `
⏰ Movie Show Reminder

Show: ${reminderData.showName}
Cinema Hall: ${reminderData.hallName}
Location: ${reminderData.hallLocation}
Show Time: ${new Date(reminderData.showTime).toLocaleString()}
Your Seats: ${reminderData.seats.join(', ')}

⏰ Please arrive at least 30 minutes before show time.

Enjoy your movie experience!
`
  })
};

export const sendEmail = async (to, type, data) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[type];
    if (!template) {
      throw new Error(`Email template '${type}' not found`);
    }
    const { subject, html, text } = template(data);
    const mailOptions = {
      from: "harmanjotsingh200310@gmail.com",
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('📧 Email sent successfully', {
      messageId: info.messageId,
      to,
      subject,
      type,
      bookingId: data.bookingId
    });

    return {
      success: true,
      messageId: info.messageId,
      envelope: info.envelope
    };

  } catch (error) {
    logger.error('❌ Email sending failed', {
      error: error.message,
      to,
      type,
      bookingId: data.bookingId
    });
    return {
      success: false,
      error: error.message,
      message: 'Email could not be sent, but booking was successful'
    };
  }
};

export const sendBookingConfirmation = async (userEmail, bookingData) => {
  return await sendEmail(userEmail, 'ticketBooking', bookingData);
};

export const sendCancellationConfirmation = async (userEmail, bookingData) => {
  return await sendEmail(userEmail, 'bookingCancellation', bookingData);
};
export const sendShowReminder = async (userEmail, reminderData) => {
  return await sendEmail(userEmail, 'showReminder', reminderData);
};

export default {
  sendEmail,
  sendBookingConfirmation,
  sendCancellationConfirmation,
  sendShowReminder
};
