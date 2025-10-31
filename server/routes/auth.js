import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//signup
router.post("/signup", async (req, res) =>{
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "All fields are required"});

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ success: false, message: "Email already in use"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.save({ name, email, password: hashedPassword});

        console.log(`✅ New user created: ${name} (${email})`);
        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }   catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ success: false, message: "Could not create account. Please try again."});
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "Incorrect email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Incorrect email or password"});

        const token = jwt.sign ({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});

        console.log(`✅ User logged in: ${user.name} (${email})`);
        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ success: false, message: "Could not login. Please try again."});
    }
})

export default router;