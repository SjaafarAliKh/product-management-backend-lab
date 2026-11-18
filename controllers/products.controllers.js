const Product = require('../models/Product');

function handleError(error, res) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
    }
    if (error.name === 'CastError') {
        const message = error.path === '_id' ? 'Invalid product ID.' : error.message;
        return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: error.message });
}


// CREATE - POST /products
async function createProduct(req, res) {
    try {
        const { title, description, category, price, quantity } = req.body;
        const createdProudct = await Product.create({
            title,
            description,
            category,
            price,
            quantity,
        });
        res.status(201).json(createdProudct);
    } catch (err) {
        handleError(err, res);
    }
}


// INDEX - GET /products
async function getAllProducts(req, res) {
    try {
        const allProducts = await Product.find();
        res.status(200).json(allProducts);
    } catch (err) {
        handleError(err, res);
    }
}

// GET /products/low-stock - products with quantity below 3
async function getLowStockProducts(req, res) {
    try {
        const lowStockProducts = await Product.find({ quantity: { $lt: 3 } });
        res.status(200).json(lowStockProducts);
    } catch (error) {
        handleError(error, res);
    }
}


// GET /products/statistics - inventory stats
async function getStatistics(req, res) {
    try {
        const products = await Product.find();

        const totalProducts = products.length;
        const totalValue = products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const lowStockItems = products.filter((item) => item.quantity < 3).length;

        res.status(200).json({
            totalProducts,
            totalValue: Number(totalValue.toFixed(2)),
            lowStockItems,
        });
    } catch (err) {
        handleError(err, res);
    }
}


// SHOW - GET /products/:productId
async function getProductById(req, res) {
    try {
        const foundProduct = await Product.findById(req.params.productId);
        if (!foundProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(foundProduct);
    } catch (error) {
        handleError(error, res);
    }
}



// UPDATE - PUT /products/:productId
async function updateProduct(req, res) {
    try {
        const { title, description, category, price, quantity } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { title, description, category, price, quantity },
            { returnDocument: 'after', runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        handleError(error, res);
    }
}


// DELETE - DELETE /products/:productId (returns 200 with the deleted product, per the lab table)
async function deleteProduct(req, res) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        handleError(error, res);
    }
}



module.exports = {
    createProduct,
    getAllProducts,
    getLowStockProducts,
    getStatistics,
    getProductById,
    updateProduct,
    deleteProduct,
};

