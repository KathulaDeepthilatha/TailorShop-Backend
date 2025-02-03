const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const mongoose = require("mongoose");


router.get("/test", (req, res) => {
  res.json({ message: "Hello" });
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

// ✅ Get a single customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("Customer ID received:", id);

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid customer ID format" });
  }

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer", error });
  }
});


router.post("/", async (req, res) => {
  try {
    // Validate required fields
    const { name, mobile, measurements } = req.body;
    
    if (!name || !mobile) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: {
          name: !name ? "Name is required" : null,
          mobile: !mobile ? "Mobile number is required" : null
        }
      });
    }

    // Check if customer with mobile already exists
    const existingCustomer = await Customer.findOne({ mobile });
    if (existingCustomer) {
      return res.status(409).json({ 
        message: "Customer with this mobile number already exists" 
      });
    }

    // Validate measurements (ensure they're numbers)
    if (measurements) {
      Object.keys(measurements).forEach(key => {
        measurements[key] = Number(measurements[key]) || 0;
      });
    }

    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    
    res.status(201).json({ 
      message: "Customer created successfully", 
      customer: savedCustomer 
    });

  } catch (error) {
    console.error("Customer creation error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({ 
      message: "Error creating customer", 
      error: error.message 
    });
  }
});


// Update customer with better validation
router.put("/customers/:id", async (req, res) => {
  try {
    const { name, mobile, measurements } = req.body;

    // Validate measurements if provided
    if (measurements) {
      Object.keys(measurements).forEach(key => {
        measurements[key] = Number(measurements[key]) || 0;
      });
    }

    // Check if updating mobile number and it already exists
    if (mobile) {
      const existingCustomer = await Customer.findOne({ 
        mobile, 
        _id: { $ne: req.params.id } 
      });
      if (existingCustomer) {
        return res.status(409).json({ 
          message: "Mobile number already registered with another customer" 
        });
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ 
      message: "Customer updated successfully", 
      customer: updatedCustomer 
    });

  } catch (error) {
    console.error("Customer update error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({ 
      message: "Error updating customer", 
      error: error.message 
    });
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
