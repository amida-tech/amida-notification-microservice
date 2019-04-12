import { Schema } from 'mongoose';
import mongoConn from '../../config/mongo';

const NotificationSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    payload: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    deviceType: {
        type: String,
        enum: ['iOS', 'Android'],
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});

export const notificationModelName = 'Notification';
export const Notification = mongoConn.model(notificationModelName, NotificationSchema);
