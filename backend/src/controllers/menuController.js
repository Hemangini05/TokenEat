/**
 * Menu Controller
 * Manage daily menu items
 */

const Menu = require('../models/Menu');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const getMenu = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const startDate = new Date(queryDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    const menuItems = await Menu.find({
        // date: { $gte: startDate, $lte: endDate } // Relaxed for demo
    }).sort({ category: 1, name: 1 });

    const groupedMenu = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    menuItems.forEach(item => {
        if (groupedMenu[item.category]) {
            groupedMenu[item.category].push(item);
        }
    });

    res.status(200).json({
        success: true,
        data: { date: startDate.toISOString().split('T')[0], items: groupedMenu, count: menuItems.length }
    });
});

const addMenuItem = asyncHandler(async (req, res) => {
    const { name, category, description, price, isVeg, calories, date } = req.body;
    const menuItem = await Menu.create({
        name, category, description, price: price || 0,
        isVeg: isVeg !== undefined ? isVeg : true, calories, date: date || Date.now()
    });
    res.status(201).json({ success: true, message: 'Menu item added successfully', data: menuItem });
});

const updateMenuItem = asyncHandler(async (req, res) => {
    let menuItem = await Menu.findById(req.params.id);
    if (!menuItem) throw new ApiError('Menu item not found', 404);
    menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Menu item updated successfully', data: menuItem });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) throw new ApiError('Menu item not found', 404);
    await menuItem.deleteOne();
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
});

const toggleAvailability = asyncHandler(async (req, res) => {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) throw new ApiError('Menu item not found', 404);
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    res.status(200).json({
        success: true,
        message: `Item is now ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
        data: menuItem
    });
});

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability };
