const mongoose=require('mongoose')
const selectedAddressSchema = new mongoose.Schema({
  country: String,
  name: String,
  phoneno: String,
  pincode: String,
  area: String,
  landmark: String
});

// Define the order schema
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  address: selectedAddressSchema,  // Single address object for selected address
  date: {  // Expected delivery date
    type: Date,
    required: true
  },
  paymentType: { // Payment type field
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod']
  }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
