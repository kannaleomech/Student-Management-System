const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authVerify = require("./middleware/authVerify");
const publicRoutes = require("./routes/public");
const productedRoutes = require("./routes/producted");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.use("/api", publicRoutes);
app.use("/api", authVerify, productedRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
);
