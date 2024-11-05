import mongoose from 'mongoose';

 const metaItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

 const PrivacyPolicySchema = new mongoose.Schema({
  privacySections: [metaItemSchema], 
});

 export default mongoose.models.privacy_policy || mongoose.model('privacy_policy', PrivacyPolicySchema);
