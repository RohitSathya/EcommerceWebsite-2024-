const mongoose = require('mongoose');

// Define the address schema
const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneno: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true // Ensure each address is associated with a specific user
  }
});

const AddressModel = mongoose.model('Address', addressSchema);
module.exports = AddressModel;
