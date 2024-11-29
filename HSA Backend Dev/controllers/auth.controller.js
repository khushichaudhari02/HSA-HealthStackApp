const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Patient = require("../models/patient");
const {validationResult} = require('express-validator');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.PASSWORD_APP_EMAIL,
  },
 });
async function  signupPatient(req,res,next){
     // logic for  creating new patient.
     // this route should only be acessible via the mobile app. 
     // and on the website this will not be visible.
     const errors = validationResult(req);
    try{
    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
    }
    // input validation needs to be studied and handled.
  const userAlreadyExists = await User.findOne({email:req.body.email});
    if(userAlreadyExists){
      const error = new Error('A user with this email alrady exists.');
      error.statusCode = 403;
      throw error;
    }
  }catch(err){
    next(err);
  }
 bcrypt.hash(req.body.password,12).then(hashedPw=>{
        const newUser = new User({
            name: {
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName
            },
            email: req.body.email,
            password: hashedPw,
            role: 'patient'
        });
       return newUser.save();
     } ).then(result => {
        const newPatient = new Patient({owner:result._id,phoneNumber:req.body.phoneNumber,name:result.name});
        return newPatient.save();
        
      }).then(result=>{
        res.status(201).json({ message: 'User created!', patientId: result._id ,userId: result.owner });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    
}
async function login(req,res,next){
       // logic for authenticating user and then loading user's appropriate dashboard
       const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    try{
    const existingUser = await User.findOne({email:email});
    if (!existingUser) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
   
  const isPasswordEqual =  await bcrypt.compare(password,existingUser.password);
   if(!isPasswordEqual){
        const error = new Error('Incorrect password!');
        error.statusCode = 401;
        throw error;
  
   }
   const token = jwt.sign(
    {
      email: existingUser.email,
      userId: existingUser._id.toString(),
      role:existingUser.role,
    },
   process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
  res.status(200).json({ token: token, userId: existingUser._id.toString(), role:existingUser.role,expiresIn:60});

  }
  catch(err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
async function forgetPassword(req,res,next){
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user not found, send error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: "10m",});

    // Send the token to the user's email

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="http://localhost:8080/reset-password/${token}">http://localhost:8080/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent" });
    });
  } catch (err) {
   next(err);
  }

}

async function resetPassword(req,res,next){
  try {
    // Verify the token sent by the user
    
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET_KEY
    );

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }
    
    // Hash the new password
   
    const newHashedPw= await bcrypt.hash(req.body.newPassword, 12);

    // Update user's password, clear reset token and expiration time
    user.password = newHashedPw;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
    next(err);
  }
}

module.exports={
    signupPatient:signupPatient,
    login:login,
    forgetPassword,
    resetPassword
}