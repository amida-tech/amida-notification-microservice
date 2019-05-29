import httpStatus from 'http-status';

import { User } from '../models/user.model';
import passErrors from '../helpers/passErrors';
import APIError from '../helpers/APIError';

/**
 * Create a User
 * @property {string} req.body.username - Username
 * @property {string} req.body.uuid - User UUID
 * @returns {User}
 */
export const create = passErrors(async (req, res) => {
    const { username, uuid } = req.body;

    // This is the equivalent of findOrCreate
    const user = await User.findOneAndUpdate(
        { username, uuid },
        { username, uuid },
        { new: true, upsert: true }
    );

    res.send({ user });
});

export const updateDevice = passErrors(async (req, res, next) => {
    const { username, token, deviceType } = req.body;
    // disable other instances of this token
    await User.updateMany({
        username: {
            $ne: username,
        },
        devices: {
            $elemMatch: {
                token,
                type: deviceType,
                status: 'enabled',
            },
        },
    }, {
        'devices.$[thisDevice].status': 'disabled',
    }, {
        multi: true,
        arrayFilters: [
            {
                'thisDevice.token': token,
                'thisDevice.type': deviceType,
            },
        ],
    });

    // get user and add this token to the user
    const user = await User.findOne({ username });

    if (!user) {
        return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
    }

    // two cases
    // 1. already have it -> make sure its enabled
    // 2. don't have it yet -> insert it
    const alreadyHasIt = user.devices.find(device => device.token === token &&
                                                      device.type === deviceType);
    let created = false;
    if (alreadyHasIt) {
        alreadyHasIt.status = 'enabled';
    } else {
        user.devices = user.devices.concat([{
            token,
            type: deviceType,
            status: 'enabled',
        }]);
        created = true;
    }
    await user.save();
    return res.send({
        message: `Device ${created ? 'created' : 'updated'}`,
    });
});

export const revokeDevice = passErrors(async (req, res) => {
    const { username, token, deviceType } = req.body;
    const user = await User.findOne({ username });
    for (let i = 0; i < user.devices.length; i += 1) {
        if (user.devices[i].token === token && user.devices[i].type === deviceType) {
            user.devices[i].status = 'disabled';
        }
    }
    await user.save();
    res.send({
        success: 'Device Revoked!',
    });
});
