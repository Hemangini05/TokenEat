/**
 * Seed Complaints
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./src/models/Complaint');
const connectDB = require('./src/config/db');

const complaints = [
    { content: "The wifi in the mess hall is spotty today.", image: "", isAnonymous: true, createdAt: new Date() },
    { content: "Can we get more spicy chutney?", image: "", isAnonymous: true, createdAt: new Date(Date.now() - 3600000) },
    { content: "Great music playlist this morning! 🎵", image: "", isAnonymous: true, createdAt: new Date(Date.now() - 7200000) }
];

const seed = async () => {
    await connectDB();
    try {
        await Complaint.deleteMany();
        await Complaint.insertMany(complaints);
        console.log('✅ Complaints Seeded');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
