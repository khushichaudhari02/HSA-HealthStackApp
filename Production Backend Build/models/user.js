const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        firstName: { type: String ,required: true},
        middleName: { type: String,} ,
        lastName: { type: String ,required: true}
    },
    email: {
        type: String,
        required: true
      },
      password: {
        type: String,
      },
      role: {
        type:String,
      required:true,
      enum:['patient','doctor','admin','labWorker','superAdmin','nurse','receptionist']
      },
      hospital:{
        type:Schema.Types.ObjectId,
        ref:"Hospital"
      },
      notifications: {
        type: Array,
        default: [],
      },
      seenNotifications: {
        type: Array,
        default: [],
      },

},{timestamps:true});
module.exports=mongoose.model('User',userSchema);