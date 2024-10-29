import mongoose from 'mongoose';

const OtpUserAlternateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
    required: true,  
  },
  message:{
    type: String,
    required: true,  
  }
}, {
  timestamps: true  
});

const OtpUserAlternateModel = mongoose.models.otp_user_alternate || mongoose.model('otp_user_alternate', OtpUserAlternateSchema);
export default OtpUserAlternateModel;
