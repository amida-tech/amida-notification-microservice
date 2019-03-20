import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    devices: [new mongoose.Schema({
        type: {
            type: String,
            enum: ['iOS', 'android'],
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
export const User = mongoose.model(userModelName, UserSchema);
