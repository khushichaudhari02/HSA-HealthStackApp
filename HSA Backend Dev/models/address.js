const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = new Schema({
    state: {
    type: "String",
    enum: [
      "Andaman and Nicobar Islands",
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chandigarh",
      "Chhattisgarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Ladakh",
      "Lakshadweep",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Puducherry",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      ""
    ]},
  district:{
      type:'String',
      
  },
  city:{
      type:'String',
      
  },
  streetAddress:[
    {type:'String',
    },
  ],
  postalCode:{
    type:'String',
    
  },
  landmark:{
    type:'String',
    
  }
});

module.exports= addressSchema
