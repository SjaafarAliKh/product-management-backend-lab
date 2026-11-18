// routes/products.routes.js

const express = require('express')
const router = express.Router()
const { standardLimiter } = require('../middleware/rateLimiter.js')
const productController = require('../controllers/products.controllers.js')

// CREATE - POST /products
router.post('/', productController.createProduct)

// INDEX - GET /products
router.get('/', standardLimiter, productController.getAllProducts)

// Special routes MUST come before '/:productId'
router.get('/low-stock', productController.getLowStockProducts)
router.get('/statistics', productController.getStatistics)

// SHOW - GET /products/:productId
router.get('/:productId', productController.getProductById)

// UPDATE - PUT /products/:productId
router.put('/:productId', productController.updateProduct)

// DELETE - DELETE /products/:productId
router.delete('/:productId', productController.deleteProduct)

module.exports = router