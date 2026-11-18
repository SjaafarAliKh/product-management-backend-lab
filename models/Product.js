const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required.'],
        trim: true,
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        enum: {
            values: ['electronics', 'food', 'clothing', 'furniture', 'other'],
            message: '{VALUE} is not a valid category.',
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0.1, 'Price must be at least 0.1.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [0, 'Quantity cannot be negative.'],
    }
}, { timestamps: true })


const Product = mongoose.model('Product', productSchema)

module.exports = Product

