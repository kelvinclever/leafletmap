import express from "express";
import nodemailer from "nodemailer";
import cors from "cors"; // Import the 'cors' package

const app = express();
const port = 3001; // Change to your desired port

// Use the 'cors' middleware
app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider
  auth: {
    user: "kkelvinnzioka@gmail.com", // Your email address
    pass: "123151290kelvin", // Your email password
  },
});

app.use(express.json());

app.post("/send-location", (req, res) => {
  const { email, location } = req.body;

  const mailOptions = {
    from: "kkelvinzioka@gmail.com", // Your email address
    to: email,
    subject: "Your Location",
    text: `Your current location: ${location}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Email sending failed.");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully.");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
