import { User } from '../models/user.model';

/**
 * Create a User
 * @property {string} req.body.username - Username
 * @property {string} req.body.uuid - User UUID
 * @returns {User}
 */
export async function create(req, res) {
    const { username, uuid } = req.body;

    // This is the equivalent of findOrCreate
    const user = await User.findOneAndUpdate(
        { username, uuid },
        { username, uuid },
        { new: true, upsert: true }
    );

    res.send({ user });
}

export async function updateDevice(req, res) {
    const { username, token, deviceType } = req.body;
    // delete other instances of this token
    const otherUsersWithThisToken = await User.find({
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
    });
    for (const user of otherUsersWithThisToken) {
        for (let i = 0; i < user.devices.length; i += 1) {
            if (user.devices[i].token === token && user.devices[i].type === deviceType) {
                user.devices[i].status = 'disabled';
            }
        }
        await user.save();
    }

    // get user and add this token to the user
    const user = await User.findOne({ username });

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
    res.send({
        message: `Device ${created ? 'created' : 'updated'}`,
    });
}

export async function revokeDevice(req, res) {
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
}
