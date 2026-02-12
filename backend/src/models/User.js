const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please provide a name'], trim: true },
    email: { type: String, required: [true, 'Please provide an email'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Please provide a password'], minlength: 6, select: false },
    role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
    studentId: { type: String, trim: true },
    greenTokens: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
