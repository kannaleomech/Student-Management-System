const { User, Role } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET; // You should move this to .env in production

// 🔐 Register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: 1,
    });

    const roleInfo = await Role.findByPk(role, {
      attributes: ["name"],
    });

    const userInfo = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: roleInfo?.name,
        roleId: user?.role,
      }

    // Generate token
    const token = jwt.sign(userInfo, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: userInfo,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
};

// 🔑 Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email, status: 1 },
      include: [{ model: Role, as: "roleInfo", attributes: ["name"] }],
    });

    if (!user)
      return res
        .status(404)
        .json({ error: "Invalid email or account disabled" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });


    const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleInfo?.name,
        roleId: user.role,
      }
    // Generate token
    const token = jwt.sign(userInfo, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: userInfo,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Login failed", details: err.message });
  }
};

module.exports = {
  register,
  login,
};
