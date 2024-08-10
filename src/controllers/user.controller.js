import { connectToDB } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const login = async (req, res) => {
  try {
    const connection = connectToDB();
    const { id, password } = req.body;
    connection.query(
      "SELECT * FROM user WHERE user_id = ?",
      [id],
      async (err, result, fields) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "User does not exist in database. Register first !",
          });
        }

        // check if poasswords match
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ ok: false, message: "Passwords do not match" });
        }

        // create token and store it in cookie
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1w",
        });
        res.cookie("session_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        res.send("Logged in successfully");
        return res.status(200).json({
          ok: true,
          data: result[0],
          message: "Logged in successfully",
          token,
        });
      }
    );
  } catch (error) {
    console.log("Error logging in user: ", error);
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const connection = connectToDB();
    const [rows] = await connection.execute(
      "UPDATE user SET verified = true WHERE email = ?",
      [decoded.email]
    );

    if (rows.affectedRows === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid or expired token" });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(400)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};

export const register = async (req, res) => {
  try {
    const connection = connectToDB();
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });

    const {
      studentId,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      email,
      gender,
      faculty,
      level,
      role,
      description,
      imageUrl,
      verified,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ ok: false, message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${verificationToken}`;

    const mailOptions = {
      from: '"Hackalol" <onboarding@resend.dev>',
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Click here to Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info);

    connection.query(
      "INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        studentId,
        firstName,
        lastName,
        hashedPassword,
        phone,
        email,
        level,
        faculty,
        gender,
        role,
        verified,
        description,
        imageUrl,
      ],
      (err, result, fields) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error registering user",
          });
        }
        return res.status(201).json({
          ok: true,
          message: "User registered successfully",
          token: verificationToken,
        });
      }
    );
  } catch (error) {
    console.log("Error registering user: ", error);
  }
};
