import { connectToDB } from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const login = async (req, res) => {
  try {
    const connection = connectToDB();
    const { studentId, password } = req.body;
    connection.query(
      "SELECT * FROM user WHERE user_id = ?",
      [studentId],
      async (err, result, fields) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "User does not exist in database. Register first !",
          });
        }
        // check if poasswords match
        const isPasswordValid = await bcrypt.compare(
          password,
          result[0].password
        );
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ ok: false, message: "Passwords do not match" });
        }

        // create token and store it in cookie
        const token = jwt.sign(
          { id: result[0].user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );
        res.cookie("session_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

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
    const rows = connection.query(
      "UPDATE user SET verified = true WHERE email = ?",
      [decoded.email]
    );
    console.log("Rows : ", rows);

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
    console.log("Connecting to database...");
    const connection = connectToDB();

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
      verified = false,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ ok: false, message: "Passwords do not match" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Generating verification token...");
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });

    const mailOptions = {
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Click here to Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    // Attempt to send the verification email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (emailError) {
      return res
        .status(500)
        .json({ ok: false, message: "Error sending verification email" });
    }

    // Insert user into the database
    connection.query(
      "INSERT INTO user (user_id, firstName, lastName, password, phone, email, year_level, faculty, gender, role, verified, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ ok: false, message: "Error registering user" });
        }
        return res.status(201).json({
          ok: true,
          message:
            "User registered successfully. Please check your email to verify your account.",
          token: verificationToken,
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    // get user from database
    const connection = connectToDB();
    connection.query(
      "SELECT * FROM user WHERE user_id = ?",
      [req.user.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error getting user",
          });
        }
        return res.status(200).json({
          ok: true,
          user: result[0],
        });
      }
    );
  } catch (error) {
    console.log("Error getting user: ", error);
  }
};
