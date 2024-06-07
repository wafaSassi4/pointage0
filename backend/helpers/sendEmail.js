import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wafasassi49@gmail.com",
    pass: "xywgeetxyqcqpogd",
  },
});


const sendAccountInfo = (email,name, password) => {
  const mailOptions = {
    from: "contact.rh@gmail.com",
    to: email,
    subject: "Account Informations",
    html: `
      <p>Bienvnue ,chez nous ${name}</p>
      <p>Your login credentials are:</p>
      <span>Email:${email}</span>
      <span>Password:${password}</span>
      <p>Please keep this information secure.</p>
      <p>Regards,</p>
       <p>Your Company</p>`,
    
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
const sendNewConge = async ( nomPrenom,  email,  dateDebut,  dateFin) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });
    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${nomPrenom},</p>
      <p>Votre demande de congé pour la période de ${dateDebut} a ${dateFin}  a été approuvée. Profitez bien de votre temps de repos !</p>

      <p>Cordialement,</p>
      
      <p>${nomPrenom}</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendNewRemote = async (nomPrenom, email, dateDebut, dateFin) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${nomPrenom},</p>
      <p>Votre demande de travail à distance pour la période du ${dateDebut} au ${dateFin} a été approuvée. Bon travail !</p>
      <p>Cordialement,</p>
      <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendUpdateInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "votre_email@gmail.com",
        pass: "votre_mot_de_passe_gmail",
      },
    });

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Updated Account Information",
      html: `<p>Hello ${name},</p>
                 <p>Your account information has been successfully updated.</p>
                 <p>Your updated login credentials are:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Password:</strong> ${password}</p>
                 <p>Please keep this information secure.</p>
                 <p>Regards,</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendNewAccountInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });
    const mailOptions = {
      from: "votre_email@gmail.com", 
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${name},</p>
                 <p>Your account has been successfully created.</p>
                 <p>Your login credentials are:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Password:</strong> ${password}</p>
                 <p>Please keep this information secure.</p>
                 <p>Regards,</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendAccountInfo, sendPasswordReset, sendPasswordResetLink,sendNewConge, sendUpdateInfo,sendNewAccountInfo,sendNewRemote };
