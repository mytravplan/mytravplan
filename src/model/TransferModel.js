
import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const TransferSchema = new Schema(
    {

        transfer_image: {
            type: String,
            required: true,
            trim: true,
        },


        transfer_title: {
            type: String,
            required: true,
            trim: true,
        },


        transfer_galleries: [
            {
                type: String,
                required: false,
                trim: true,
            },
        ],


        transfer_price: {
            type: String,
            required: false,
            trim: true,
        },



        transfer_overview_description: {
            type: String,
            required: false,
            trim: true,
        },
        transfer_slug: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


const Transfer = models.Transfer || model('Transfer', TransferSchema);

export default Transfer;
