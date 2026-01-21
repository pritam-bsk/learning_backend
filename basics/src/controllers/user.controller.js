import { asynchandler } from "../utils/asyncHandeler.util.js";
import User from '../models/user.model.js';

const createUser = asynchandler(async (req, res) => {
    let { name, email } = req.body;
    email = email.toLowerCase();
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    if (await User.findOne({ email })) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    const newUser = await User.create({ name, email });

    res.status(201).json({ user: newUser });
});

export { createUser };