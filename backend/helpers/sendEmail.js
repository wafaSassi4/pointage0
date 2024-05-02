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

const sendPasswordReset = (email, password) => {
  const mailOptions = {
    from: "contact.rh@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe, Voici votre nouveau mot de passe</p>
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

// Function to send a password reset link
const sendPasswordResetLink = (email, token) => {
  const mailOptions = {
    from: "contact.rh@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <span>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</span>
      <a href="http://localhost:3000/reset-password/${token}">Réinitialiser mon mot de passe</a>
    `,
  };

  sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error.message);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export { sendAccountInfo, sendPasswordReset, sendPasswordResetLink };
