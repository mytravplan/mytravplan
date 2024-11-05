import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    }
});

const FooterSchema = new mongoose.Schema({
    phoneNumbers: {
        type: [String],
        required: true
    },
    emailAddresses: {
        type: [String],
        required: true
    },
    address: [AddressSchema], 
    socialIcons: [
        {
            name: { type: String, required: true },
            iconUrl: { type: String, required: true },
            url: { type: String, required: true }
        }
    ]
}, { timestamps: true });

let FooterModel = mongoose.models.footer_contents || mongoose.model('footer_contents', FooterSchema);
export default FooterModel;
