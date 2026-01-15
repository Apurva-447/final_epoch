const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (to, event, seats, ticketId, qrCode) => {
  
  const imageUrl = `http://192.168.29.52:5000/${event.image}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "🎟 Booking Confirmed - EPOCH",
    html: `
        <img 
      src="${imageUrl}" 
      alt="${event.title}"
      style="width:100%;max-width:400px;border-radius:8px;margin:10px 0;"
    />
      <h2>Booking Confirmed</h2>
      <p><b>Event:</b> ${event.title}</p>
      <p><b>Seats:</b> ${seats}</p>
      <p><b>Date:</b> ${new Date(event.date).toDateString()}</p>
      <p><b>Ticket ID:</b> ${ticketId}</p>
      <p>Show this QR at entry:</p>
    <img src="cid:qrCode"/>
    `,
    attachments: [
    {
      filename: "ticket-qr.png",
      content: qrCode.split("base64,")[1],
      encoding: "base64",
      cid: "qrCode",
    },
  ],
  });
};
