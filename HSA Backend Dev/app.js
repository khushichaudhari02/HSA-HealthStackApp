const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors');
const path = require('path');
const fs= require('fs');
const mongoose = require('mongoose');
const app = express();
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
const authRoutes= require('./routes/auth.routes');
const isAuthMiddleware = require('./middlewares/isAuth');
const protectRoutesMiddleware  = require('./middlewares/protectRoutes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes= require('./routes/doctors.routes');
const adminRoutes= require('./routes/admin.routes');
const labRoutes= require('./routes/lab.routes');
const baseController = require("./controllers/base.controller");
const validation = require("./util/validation")
const superAdminRoutes= require('./routes/superAdmin.routes');
app.post('/api/contact',validation.CHRValidator,baseController.postContactForm)
app.use('/api/auth',authRoutes);
// the protectRoutesMiddleware will check
//authentication and authorization of the user and if its authenticated then the he will receive appropriate data
app.use('/api/doctor',isAuthMiddleware,protectRoutesMiddleware,doctorRoutes); 
// // we will save the user info in jwt or session
// // so we would have already known the id of the user no need to include in routes.
// // app.use('/api/doctor',doctorRoutes); 
app.use('/api/patients',isAuthMiddleware,patientRoutes);
// // app.use('api/patients',patientRoutes);
app.use('/api/admin',isAuthMiddleware,protectRoutesMiddleware,adminRoutes); 
// // app.use('api/admin',adminRoutes);

app.use('/api/lab',isAuthMiddleware,protectRoutesMiddleware,labRoutes);
app.use('/api/superAdmin',isAuthMiddleware,protectRoutesMiddleware,superAdminRoutes); 
// app.use('api/lab-worker',labRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
let mongodbUrl ='mongodb://127.0.0.1:27017/hsa-api'

if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL; 
}
mongoose.connect(mongodbUrl).then(function(){
    app.listen(3000);
}).catch(err => {
    console.log(err);
  });
