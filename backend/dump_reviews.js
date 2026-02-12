const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./src/models/Review');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const dumpReviews = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MongoDB URI is missing');
        }
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Lean query to get raw objects
        const reviews = await Review.find({}).lean();

        fs.writeFileSync('dump.json', JSON.stringify(reviews, null, 2));
        console.log('Dumped to dump.json');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dumpReviews();
