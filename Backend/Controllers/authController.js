const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashed = bcrypt.hashSync(password, 10);

    await User.create(name, email, hashed, role, department_id || null);

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        department_id: user.department_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Transform user object to match frontend types
    const userResponse = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.department_id,
      departmentName: user.department_name,
      createdAt: user.created_at || new Date().toISOString()
    };

    res.json({
      msg: "Login successful",
      token,
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const userResponse = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.department_id,
      createdAt: user.created_at || new Date().toISOString()
    };

    res.json({ user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER DEPARTMENT
exports.updateDepartment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { department_id } = req.body;

    if (!department_id) {
      return res.status(400).json({ msg: "Department ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Only allow department heads to update their department
    if (user.role !== 'department_head') {
      return res.status(403).json({ msg: "Only department heads can set their department" });
    }

    await User.updateDepartment(userId, department_id);

    res.json({ msg: "Department updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

