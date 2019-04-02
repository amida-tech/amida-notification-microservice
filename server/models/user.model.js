import { Schema } from 'mongoose';
import mongoConn from '../../config/mongo';

const UserSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
    },
    devices: [new Schema({
        type: {
            type: String,
            enum: ['iOS', 'Android'],
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['enabled', 'disabled'],
            required: true,
            default: 'enabled',
        },
    })],
});

export const userModelName = 'User';
export const User = mongoConn.model(userModelName, UserSchema);
