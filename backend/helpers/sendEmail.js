import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wafasassi49@gmail.com",
    pass: "xywgeetxyqcqpogd",
  },
});

// Function to send a verification email
const sendAccountInfo = (email, password) => {
  const mailOptions = {
    from: "contact.rh@gmail.com",
    to: email,
    subject: "Account Informations",
    html: `
      <p>Bienvnue ,chez nous</p>
      <span>Email:${email}</span>
      <span>Password:${password}</span>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error.message);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendAccountInfo;
