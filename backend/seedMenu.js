/**
 * Seeder Script to populate Menu and Counters
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('./src/models/Menu');
const Counter = require('./src/models/Counter');
const connectDB = require('./src/config/db');

const menuItems = [
    { name: 'Poha', category: 'breakfast', price: 30, calories: 250, description: 'Flattened rice with onions and peanuts', isVeg: true },
    { name: 'Upma', category: 'breakfast', price: 30, calories: 220, description: 'Semolina porridge with veggies', isVeg: true },
    { name: 'Idli Sambar', category: 'breakfast', price: 40, calories: 180, description: 'Steamed rice cakes with lentil soup', isVeg: true },
    { name: 'Aloo Paratha', category: 'breakfast', price: 50, calories: 350, description: 'Potato stuffed flatbread with curd', isVeg: true },

    { name: 'Rice Plate', category: 'lunch', price: 60, calories: 450, description: 'Steamed rice with dal and sabzi', isVeg: true },
    { name: 'Roti Sabzi', category: 'lunch', price: 50, calories: 300, description: 'Whole wheat flatbread with vegetable curry', isVeg: true },
    { name: 'Curd Rice', category: 'lunch', price: 45, calories: 280, description: 'Rice mixed with yogurt and seasoning', isVeg: true },
    { name: 'Rajma Chawal', category: 'lunch', price: 70, calories: 500, description: 'Kidney beans curry with rice', isVeg: true },

    { name: 'Samosa', category: 'snacks', price: 15, calories: 200, description: 'Fried pastry with potato filling', isVeg: true },
    { name: 'Tea', category: 'snacks', price: 10, calories: 60, description: 'Masala chai', isVeg: true },
    { name: 'Coffee', category: 'snacks', price: 15, calories: 80, description: 'Hot milk coffee', isVeg: true },
    { name: 'Vada Pav', category: 'snacks', price: 20, calories: 300, description: 'Spicy potato fritter in bun', isVeg: true },

    { name: 'Dal Khichdi', category: 'dinner', price: 50, calories: 320, description: 'Rice and lentil porridge', isVeg: true },
    { name: 'Veg Biryani', category: 'dinner', price: 80, calories: 550, description: 'Spiced rice with vegetables', isVeg: true },
    { name: 'Egg Curry', category: 'dinner', price: 70, calories: 400, description: 'Boiled eggs in spicy gravy', isVeg: false },
    { name: 'Paneer Butter Masala', category: 'dinner', price: 90, calories: 600, description: 'Cottage cheese in rich tomato gravy', isVeg: true }
];

const counters = [
    { name: 'South Indian', type: 'breakfast', icon: '🥘', isOpen: true },
    { name: 'North Indian', type: 'lunch', icon: '🍛', isOpen: true },
    { name: 'Snacks Counter', type: 'snacks', icon: '🥪', isOpen: true },
    { name: 'Beverages', type: 'drinks', icon: '🥤', isOpen: true },
    { name: 'Dinner Hall 1', type: 'dinner', icon: '🍽️', isOpen: true }
];

const seedData = async () => {
    await connectDB();

    try {
        await Menu.deleteMany();
        await Counter.deleteMany();

        await Menu.insertMany(menuItems);
        await Counter.insertMany(counters);

        console.log('✅ Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
