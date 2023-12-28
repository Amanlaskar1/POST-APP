require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const connectDatabase = require("./config/databaseConnection");

const authRoutes = require("./routes/authRoute");
const postRoutes = require("./routes/postRoute");

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/uploads")));
//cors
app.use(
  cors({
    origin: ["http://localhost:5173", "https://web.postman.co"],
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/post", postRoutes);

app.use((err, req, res, next) => {
  const code = err.status;
  return res.status(code || 500).json({
    message: err.message || "Something went wrong",
    success: false,
    status: 500,
  });
});

const PORT = process.env.PORT;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

mongoose.connection.on("error", () => {
  console.log(
    "Probably due to connection with the database server, Server closed"
  );
  process.exit(1);
});
