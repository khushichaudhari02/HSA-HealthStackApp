const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
// const fs= require('fs');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
app.use(cors({
  origin:process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']}
));
app.use(bodyParser.json());
const authRoutes = require("./routes/auth.routes");
const isAuthMiddleware = require("./middlewares/isAuth");
const protectRoutesMiddleware = require("./middlewares/protectRoutes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctors.routes");
const adminRoutes = require("./routes/admin.routes");
const labRoutes = require("./routes/lab.routes");
const baseController = require("./controllers/base.controller");
const validation = require("./util/validation");
const superAdminRoutes = require("./routes/superAdmin.routes");
app.use((req, res, next) => {
  console.log(req)
  next();
})
app.post(
  "/api/contact",
  validation.CHRValidator,
  baseController.postContactForm
);
app.use("/api/auth", authRoutes);

app.use("/api/doctor", isAuthMiddleware, protectRoutesMiddleware, doctorRoutes);

app.use("/api/patients", isAuthMiddleware, patientRoutes);

app.use("/api/admin", isAuthMiddleware, protectRoutesMiddleware, adminRoutes);

app.use("/api/lab", isAuthMiddleware, protectRoutesMiddleware, labRoutes);
app.use(
  "/api/superAdmin",
  isAuthMiddleware,
  protectRoutesMiddleware,
  superAdminRoutes
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


let mongodbUrl = process.env.MONGODB_URL;
let PORT = process.env.PORT || 3000;
mongoose
  .connect(mongodbUrl)
  .then(function () {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
