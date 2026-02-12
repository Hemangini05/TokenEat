const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./src/models/Review');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const resetReviews = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) throw new Error('MongoDB URI is missing');

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Drop the collection to clear data and indexes
        try {
            await mongoose.connection.db.dropCollection('reviews');
            console.log('Reviews collection dropped');
        } catch (e) {
            console.log('Reviews collection did not exist');
        }

        // Re-create indexes by syncing (or just letting app create them on insert, but explicit is better)
        // Actually, just restarting the app will recreate indexes if model is loaded.
        console.log('Review data reset complete.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetReviews();
