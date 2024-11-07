const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PrivacyPolicySchema = new mongoose.Schema({
  privacydata: [privacySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PrivacyPolicy = mongoose.models.privacy_policies || mongoose.model('privacy_policies', PrivacyPolicySchema);
module.exports = PrivacyPolicy;
