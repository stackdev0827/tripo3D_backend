const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post("/saveProduct", async (request, response) => {
  try {
    const createProduct = new Product({
      id: request.body.id,
      projectName: request.body.name,
      twoD: request.body.twoD,
      threeD: request.body.threeD,
    });

    await createProduct.save();
    response.json({
      message: "Product created successfully",
      project: createProduct
    });
  } catch (error) {
    console.log(error);
    response.json({
      message: "Failed to create project",
      error: error.message
    });
  }
});

router.post("/getproducts", async (req, res) => {
    try {
      console.log(req.body);
      const products = await Product.find({id : req.body.id})
      if(products)
      {
        console.log(products)
        res.json(products);
      }
      else{
        res.json({message: "No Products"})
      }
    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = router; 