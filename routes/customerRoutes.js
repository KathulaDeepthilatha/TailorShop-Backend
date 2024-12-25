// const express = require("express");
// const Customer = require("../models/Customer");

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     const savedCustomer = await customer.save();
//     res.status(201).json(savedCustomer);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

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
router.delete("/api/customers/:id", async (req, res) => {
  console.log("Delete request received");
  console.log("ID from params:", req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid ID format");
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const customerId = mongoose.Types.ObjectId(req.params.id);
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      console.log("Customer not found");
      return res.status(404).json({ message: "Customer not found" });
    }
    console.log("Customer deleted successfully");
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: "Error deleting customer", error });
  }
});




module.exports = router;
