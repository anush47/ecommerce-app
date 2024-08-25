import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'

import { getUserDetails, registerUser } from "../modules/users.js";

const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDetails = await getUserDetails(username);

    if (!userDetails) {
      return res.status(404).send({ message: "User not found." });
    } else {
      bcrypt.compare(password, userDetails.passwd, function(err, isMatch) {
        if (err) {
          res.status(500).send({ message: "Internal Server Error" });
        } else if (isMatch) {
          res.status(200).send({ message: "Login successful", user_id: userDetails.user_id });
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      });
    }
  } catch (error) {
    if (error.message === "Invalid email format") {
      res.status(400).send({ message: "Invalid email format." });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

router.post("/api/register", async (req, res) => {
  try {
    const user = req.body;
    const result = await registerUser(user);
    res
      .status(201)
      .json({
        message: "User registered successfully",
        userId: result.insertId,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

export default router;
