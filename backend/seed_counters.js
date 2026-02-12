const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Counter = require('./src/models/Counter');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedCounters = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) throw new Error('MongoDB URI is missing');
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        await Counter.deleteMany({});
        console.log('Cleared Counters');

        const counters = [
            {
                name: 'Veg Counter',
                type: 'Vegetarian',
                icon: '🥬',
                isOpen: true,
                currentLoad: 5,
                estimatedWaitTime: 15
            },
            {
                name: 'Non-Veg Counter',
                type: 'Non-Vegetarian',
                icon: '🍗',
                isOpen: true,
                currentLoad: 12,
                estimatedWaitTime: 36
            },
            {
                name: 'Snacks Counter',
                type: 'Snacks & Beverages',
                icon: '☕',
                isOpen: true,
                currentLoad: 3,
                estimatedWaitTime: 9
            },
            {
                name: 'Special Menu',
                type: 'Special Menu',
                icon: '⭐',
                isOpen: true,
                currentLoad: 0,
                estimatedWaitTime: 0
            }
        ];

        await Counter.insertMany(counters);
        console.log('Counters seeded');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedCounters();
