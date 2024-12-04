import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import link from './link'; // Adjust this to your server URL
import CryptoJS from 'crypto-js';


const CLOUD_NAME = 'dkzwhqhbr'; // Cloudinary cloud name
const UPLOAD_PRESET = 'your-upload-preset'; // Cloudinary upload preset

export default function AdminPanel() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [productDescription, setProductDescription] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productRating, setProductRating] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productMRP, setProductMRP] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [productPurchaseInfo, setProductPurchaseInfo] = useState('');
  const [productIngredients, setProductIngredients] = useState('');
  const [productAttributes, setProductAttributes] = useState([]);
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('isAuthenticated');
    if (storedAdmin === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${link}/pro/all`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const calculateDiscount = (price, mrp) => {
    const discountPercentage = ((mrp - price) / mrp) * 100;
    return discountPercentage.toFixed(2);
  };

  const handlePriceChange = (value) => {
    setProductPrice(value);
    if (productMRP) {
      const calculatedDiscount = calculateDiscount(value, productMRP);
      setProductDiscount(calculatedDiscount);
    }
  };

  const handleMRPChange = (value) => {
    setProductMRP(value);
    if (productPrice) {
      const calculatedDiscount = calculateDiscount(productPrice, value);
      setProductDiscount(calculatedDiscount);
    }
  };

  const handleImageUpload = async (file) => {
    const CLOUD_NAME = 'dkzwhqhbr'; // Cloudinary cloud name
    const UPLOAD_PRESET = 'your-upload-preset'; // Replace with your Cloudinary upload preset
    const API_KEY = '823377149138246'; // Cloudinary API Key
    const API_SECRET = 'KsjDzZqxEqRUMp4_smLutXTfQD0'; // Cloudinary API Secret
  
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  
    // Create the signature (using client-side signing for simplicity; use server-side signing for security)
    const stringToSign = `timestamp=${timestamp}${API_SECRET}`;
    const signature = CryptoJS.SHA1(stringToSign).toString();
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      console.log('Uploaded Image URL:', response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed');
    }
  };
  
  const handleAddProduct = async () => {
    let missingFields = [];

    if (!productName) missingFields.push('Product Name');
    if (!productCategory) missingFields.push('Category');
    if (!productPrice) missingFields.push('Price');
    if (!productDescription) missingFields.push('Description');
    if (!productBrand) missingFields.push('Brand');
    if (productRating === '') missingFields.push('Rating');
    if (productCount === '') missingFields.push('Count');
    if (!productMRP) missingFields.push('MRP');
    if (!productDiscount) missingFields.push('Discount');
    if (!productPurchaseInfo) missingFields.push('Purchase Info');
    if (!productAttributes[0]) missingFields.push('At least one Attribute');

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: \n${missingFields.join(', ')}`);
      return;
    }

    const newProduct = {
      name: productName,
      category: productCategory,
      price: productPrice,
      images: productImages.filter((image) => image.trim() !== ''),
      description: productDescription,
      brand: productBrand,
      rating: productRating,
      count: productCount,
      mrp: productMRP,
      dis: productDiscount,
      pur: productPurchaseInfo,
      t: productIngredients.split(',').map((item) => item.trim()),
      ati: productAttributes.filter((attr) => attr.trim() !== ''),
    };

    try {
      if (editProductId) {
        await axios.put(`${link}/pro/update/${editProductId}`, newProduct);
        setEditProductId(null);
      } else {
        const response = await axios.post(`${link}/pro/add`, newProduct);
        setProducts([...products, response.data]);
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductImages(product.images || []);
    setProductDescription(product.description);
    setProductBrand(product.brand);
    setProductRating(product.rating);
    setProductCount(product.count);
    setProductMRP(product.mrp);
    setProductDiscount(product.dis);
    setProductPurchaseInfo(product.pur);
    setProductIngredients(product.t.join(', '));
    setProductAttributes(product.ati);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${link}/pro/delete/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductCategory('');
    setProductPrice('');
    setProductImages([]);
    setProductDescription('');
    setProductBrand('');
    setProductRating(0);
    setProductCount(0);
    setProductMRP('');
    setProductDiscount('');
    setProductPurchaseInfo('');
    setProductIngredients('');
    setProductAttributes([]);
    setEditProductId(null);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productImages];
    newImages[index] = value;
    setProductImages(newImages);
  };

  const handleRemoveImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    setProductImages([...productImages, '']);
  };

  const handleAddAttribute = () => {
    setProductAttributes([...productAttributes, '']);
  };

  const handleRemoveAttribute = (index) => {
    setProductAttributes(productAttributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, value) => {
    const newAttributes = [...productAttributes];
    newAttributes[index] = value;
    setProductAttributes(newAttributes);
  };



  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Admin Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded text-black bg-white"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={() => navigate('/adminop')}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
        >
          Admin Order Panel
        </button>
        <button
          onClick={() => navigate('/admincp')}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
        >
          Admin Chat Panel
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-black">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Category</label>
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Price (SET IN USD)</label>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">MRP (SET IN USD)</label>
          <input
            type="text"
            value={productMRP}
            onChange={(e) => setProductMRP(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Discount</label>
          <input
            type="text"
            value={productDiscount}
            readOnly
            className="w-full p-2 border rounded text-black bg-gray-300"
          />
          <label className="block text-black">Upload Images</label>
          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="mb-2"
          />
          {imageUploading && <p className="text-blue-500">Uploading...</p>}
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="block text-black">Description</label>
          <input
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Brand</label>
          <input
            type="text"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Rating</label>
          <input
            type="number"
            value={productRating}
            onChange={(e) => setProductRating(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
            min="0"
            max="5"
          />
          <label className="block text-black">Count</label>
          <input
            type="number"
            value={productCount}
            onChange={(e) => setProductCount(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Purchase Info</label>
          <input
            type="text"
            value={productPurchaseInfo}
            onChange={(e) => setProductPurchaseInfo(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          />
          <label className="block text-black">Attributes</label>
          {productAttributes.map((attribute, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={attribute}
                onChange={(e) => handleAttributeChange(index, e.target.value)}
                className="w-full p-2 border rounded text-black bg-white"
                placeholder="Add an attribute"
              />
              <button
                onClick={() => handleRemoveAttribute(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="mt-2 bg-green-500 text-white p-2 rounded"
            onClick={handleAddAttribute}
          >
            Add Another Attribute
          </button>
          <button
            className="mt-4 bg-blue-500 text-white p-2 rounded"
            onClick={handleAddProduct}
          >
            {editProductId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Products List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border rounded p-4 shadow-lg bg-white text-black">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={`${product.name} 0`}
                    className="w-full h-auto max-h-32 object-cover mb-4 rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                    No Image Available
                  </div>
                )}
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.price}</p>
                <p>{product.category}</p>
                <p>{product.brand}</p>
                <p>Rating: {product.rating}</p>
                <div className="flex mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}
