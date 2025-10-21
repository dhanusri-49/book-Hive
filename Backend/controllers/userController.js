import User from "../models/userModel.js";

// Register a new user
const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("❌ Register User Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "✅ User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update User Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers together
export default {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
};
