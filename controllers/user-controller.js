const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

exports.createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
};