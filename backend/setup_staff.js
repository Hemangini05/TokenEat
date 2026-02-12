/**
 * Setup Staff Accounts
 * Run this script to create or reset admin and mess_incharge accounts
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mealflow';

// User Schema (inline for simplicity)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'mess_incharge'], default: 'student' },
    studentId: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function setupStaff() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Define default passwords
        const ADMIN_PASSWORD = 'adminxim';
        const INCHARGE_PASSWORD = 'Incharge';

        // Setup Admin Account
        const adminEmail = 'admin@tokeneats.internal';
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            // Update existing admin
            admin.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await admin.save();
            console.log('✓ Admin account password reset');
        } else {
            // Create new admin
            admin = await User.create({
                name: 'Admin Controller',
                email: adminEmail,
                password: await bcrypt.hash(ADMIN_PASSWORD, 10),
                role: 'admin',
                studentId: 'ADMIN'
            });
            console.log('✓ Admin account created');
        }

        // Setup Mess Incharge Account
        const inchargeEmail = 'incharge@tokeneats.internal';
        let incharge = await User.findOne({ email: inchargeEmail });

        if (incharge) {
            // Update existing incharge
            incharge.password = await bcrypt.hash(INCHARGE_PASSWORD, 10);
            await incharge.save();
            console.log('✓ Mess Incharge account password reset');
        } else {
            // Create new incharge
            incharge = await User.create({
                name: 'Mess Incharge',
                email: inchargeEmail,
                password: await bcrypt.hash(INCHARGE_PASSWORD, 10),
                role: 'mess_incharge',
                studentId: 'INCHARGE'
            });
            console.log('✓ Mess Incharge account created');
        }

        console.log('\n╔════════════════════════════════════════╗');
        console.log('║     STAFF ACCOUNTS CONFIGURED         ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('\n📋 Login Credentials:\n');
        console.log('👨‍💼 ADMIN:');
        console.log(`   Email:    ${adminEmail}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   Access Key: ${ADMIN_PASSWORD}\n`);

        console.log('👨‍🍳 MESS INCHARGE:');
        console.log(`   Email:    ${inchargeEmail}`);
        console.log(`   Password: ${INCHARGE_PASSWORD}`);
        console.log(`   Access Key: ${INCHARGE_PASSWORD}\n`);

        console.log('💡 Usage:');
        console.log('   1. Click "STAFF" in the navbar');
        console.log('   2. Select your role');
        console.log('   3. Enter the Access Key above');
        console.log('   4. Click "Verify Access"\n');

    } catch (error) {
        console.error('❌ Error setting up staff accounts:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
        process.exit(0);
    }
}

setupStaff();
