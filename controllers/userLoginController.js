// userLoginController.js
const bcryptUtils = require("../utils/bcryptUtils");
const pool = require("../db/database");

const authController = {};

authController.signup = async (req, res) => {
  const { username, password, email, profilePicture } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcryptUtils.hashPassword(password);

    // Store user in the database
    const insertQuery =
      "INSERT INTO users (username, password, email, img) VALUES ($1, $2, $3, $4) RETURNING id, username, email, img";
    const insertValues = [username, hashedPassword, email, profilePicture];
    const result = await pool.query(insertQuery, insertValues);

    // Set user data in localStorage

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).send("Server Error");
  }
};


// userController.js

authController.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const query = "SELECT id, username, email, img, password FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare hashed password
    const user = result.rows[0];
    const passwordMatch = await bcryptUtils.comparePasswords(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Prepare user data to send to the client
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      img: user.img  // Include profile picture
    };

    // Handle successful login
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Server Error");
  }
};


authController.saveTune = async (req, res) => {
  const { trackCode, userId, prompt} = req.body;

  try {
    
    console.log(userId);
    await pool.query(
      "INSERT INTO user_tracks (track_code, user_id, prompt) VALUES ($1, $2, $3);",
      [trackCode, Number(userId), prompt]
    );


    // Handle successful login
    res.status(200).json({ message: "Track added!"});
  } catch (error) {
    console.error("Error saving tune", error);
    res.status(500).send("Server Error");
  }
};


module.exports = authController;
