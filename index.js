const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const secretKey = "Global coding club";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/attendanceDB")
  .then(() => {
    console.log("Connected to MongoDB");
    createDefaultUser(); // Create default user on server start
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const UserModel = mongoose.model("User", userSchema);

// Function to create a default user
const createDefaultUser = async () => {
  const defaultUsername = "GCC@2026";
  const defaultPassword = "GCC@2026T1";

  try {
    const existingUser = await UserModel.findOne({ username: defaultUsername });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const defaultUser = new UserModel({ username: defaultUsername, password: hashedPassword });
      await defaultUser.save();
      console.log("Default user created with username GCC@2026 and password GCC@2026T1.");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error creating default user:", error.message);
  }
};

// Student Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  rollnum: { type: String, unique: true, required: true },
  branch: String,
  attendance: { type: Map, of: String, default: {} },
  year: String,
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

// Attendance Schema and Model
const attendanceSchema = new mongoose.Schema({
  rollnum: String,
  name: String,
  branch: String,
  year: String,
  date: { type: String, required: true },
  attendance: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered successfully.");
  } catch (error) {
    res.status(500).send("Error during signup: " + error.message);
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(400).send("Invalid username or password.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid username or password.");

    const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: "1h" });
    res.send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send("Error during login: " + error.message);
  }
});

// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

// Create Student Endpoint
app.post("/createStudent", authMiddleware, async (req, res) => {
  const { name, rollnum, branch, year } = req.body;
  try {
    const newStudent = new Student({ name, rollnum, branch, year });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) return res.status(400).send("Roll number already exists.");
    res.status(500).send("Error creating student: " + error.message);
  }
});

// Delete Student Endpoint
app.delete("/deleteStudent/:rollnum", authMiddleware, async (req, res) => {
  const { rollnum } = req.params;
  try {
    const deletedStudent = await Student.findOneAndDelete({ rollnum });
    if (!deletedStudent) {
      console.error(`Student with roll number ${rollnum} not found.`);
      return res.status(404).send("Student not found.");
    }
    res.status(200).send("Student deleted successfully.");
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).send("Error deleting student: " + error.message);
  }
});

// Update Student Endpoint
app.put("/updateStudent", authMiddleware, async (req, res) => {
  const { rollnum, name, branch, year } = req.body;
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { rollnum },
      { name, branch, year },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).send("Student not found.");
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send("Error updating student: " + error.message);
  }
});

// Add or Update Attendance Endpoint
app.post("/addAttendance", authMiddleware, async (req, res) => {
  const data = req.body;
  try {
    for (let record of data) {
      const existingRecord = await AttendanceModel.findOne({ rollnum: record.rollnum, date: record.date });
      if (!existingRecord) {
        await AttendanceModel.create(record);
      } else {
        await AttendanceModel.updateOne({ rollnum: record.rollnum, date: record.date }, { $set: { attendance: record.attendance } });
      }
    }
    res.send("Attendance added/updated successfully!");
  } catch (error) {
    res.status(500).send("Error updating attendance: " + error.message);
  }
});

// Get All Student Data Endpoint
app.get("/getStudentsData", authMiddleware, async (req, res) => {
  try {
    const data = await Student.find({}, { name: 1, rollnum: 1, branch: 1, year: 1 });
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching student data: " + error.message);
  }
});

// Get Student Attendance for a Specific Date Endpoint
app.get("/studentAttendance", authMiddleware, async (req, res) => {
  const { date, rollnum } = req.query;
  try {
    const attendance = await AttendanceModel.findOne({ rollnum, date }, { attendance: 1, _id: 0 });
    if (!attendance) return res.send({ attendance: "Absent" });
    res.send(attendance);
  } catch (error) {
    res.status(500).send("Error fetching attendance: " + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
