const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");


app.get('/hello', (req, res) => {
  res.send('Hello World!');
}); 

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
});

// Get a customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
});

// Add a new customer
router.post("/", async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: "Customer created successfully", newCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error creating customer", error });
  }
});

// Update a customer
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
});

// Delete a customer
router.delete("/:id", async (req, res) => {
  console.log("Delete request received");
  console.log("ID from params:", req.params.id);
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
});




module.exports = router;
