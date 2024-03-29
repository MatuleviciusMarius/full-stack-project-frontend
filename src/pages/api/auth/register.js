import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import getOrders from "@/utils/getOrders";

export default async function registerHandler(req, res) {
  const { name, email, password, phone } = req.body;

  try {
    await connectMongo();
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ error: "User already exists" });
    }

    const orders = await getOrders();

    const index = orders.findIndex((order) => order.customer_email === email);

    if (index === -1) {
      return res.status(400).json({ error: "User not allowed" });
    }

    const emailToken = jwt.sign({ email }, process.env.JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      emailToken,
      phone,
    });

    await newUser.save();

    // let transporter = nodemailer.createTransport({
    //   host: "smtp.titan.email",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    // const confirmationUrl = `${process.env.HOST}/api/auth/confirm/${emailToken}`;

    // let mailOptions = {
    //   from: '"noreply" <noreply@mydreamworld.lt>',
    //   to: email,
    //   subject: "Email Confirmation",
    //   text: `Ačiū už registraciją. Patvirtinkite savo emailą paspausdami šią nuorodą: ${confirmationUrl}`,
    //   html: `<b>Ačiū už registraciją. Patvirtinkite savo emailą paspausdami šią nuorodą: <a href="${confirmationUrl}">${confirmationUrl}</a></b>`,
    // };

    // await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "New user created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
}
