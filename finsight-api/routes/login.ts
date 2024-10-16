import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";

const loginRoutes = express.Router();

async function validatePassword(inputPassword: string, password: string) {
    return await bcrypt.compare(inputPassword, password);
}

loginRoutes.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        };

        const passwordIsMatch = await validatePassword(password, user.password);

        if (!passwordIsMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        };

        const token = jwt.sign(
            { userId: user.id , email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token: token });
    } catch (err) {
        console.log("🚀 ~ loginRoutes.post ~ err:", err);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
});

export default loginRoutes;