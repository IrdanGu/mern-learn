import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const products = req.body;

  if (!products.name || !products.price || !products.image) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }
  const newProduct = new Product(products);

  try {
    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const products = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, products, {
      new: true,
    });
    res.status(200).send({ success: true, data: updatedProduct });
  } catch (error) {
    console.log("Error in updating product", error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ success: false, message: "Invalid ID" });
  }
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log("Error in deleting product", error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
});

export default router;
