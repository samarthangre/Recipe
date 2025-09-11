import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, email } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !email) {
            return res.status(400).json({ message: "All the fields are required." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists, try another one." });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists, try another one." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            email,
        });
        return res.status(201).json({message: "User registered successfully."});
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        const user = await User.findOne({ username }); //finds user
        if (!user) {
            return res.status(404).json({message: "Incorrect username or password."});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid password."});
        };
        const tokenDAta = {
            userId: user._id
        }
        const token = await jwt.sign(tokenDAta, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

        return res.status(200).cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSize: 'strict' }).json({
            message: "User logged in successfully.",
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({message: "User logged out successfully."});

    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

