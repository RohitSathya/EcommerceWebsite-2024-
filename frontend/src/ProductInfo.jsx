import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import { FaShippingFast, FaRegCheckCircle, FaRegCreditCard, FaStar, FaTrash, FaHeart } from 'react-icons/fa';
import { BiSupport, BiShare } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import link from './link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import ReactStars from 'react-rating-stars-component';
import { AppContext } from './AppContext';

export default function ProductInfo({ data }) {
  const dispatch = useDispatch();
  const { currency, exchangeRate } = useContext(AppContext);
  const [productData, setProductData] = useState(() => data || JSON.parse(localStorage.getItem('productData')) || {});
  const [mainImage, setMainImage] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const convertedPrice = (productData.price * exchangeRate).toFixed(2);
  const convertedMRP = (productData.mrp * exchangeRate).toFixed(2);
  const discount = productData.mrp && productData.price
    ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
    : 0;

  useEffect(() => {
    const userDetail = localStorage.getItem('userdetail');
    if (userDetail) {
      const parsedDetail = JSON.parse(userDetail);
      setUserId(parsedDetail.uid || parsedDetail._id);
      setUsername(parsedDetail.displayName || parsedDetail.name);
    }
    fetchComments();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      localStorage.setItem('productData', JSON.stringify(data));
      setProductData(data);
      setMainImage(data.images?.[0] || data.image);
    } else {
      const storedData = JSON.parse(localStorage.getItem('productData') || '{}');
      setProductData(storedData);
      setMainImage(storedData.images?.[0] || storedData.image);
    }

    window.scrollTo(0, 0);

    return () => {
      localStorage.removeItem('productData');
    };
  }, [data]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${link}/comments/get/${productData._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${link}/pro/all`);
      setFeaturedProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.warn('Please enter a comment');
      return;
    }

    const commentPayload = {
      userId,
      username,
      comment: newComment,
      productId: productData._id,
    };

    try {
      const response = await axios.post(`${link}/comments/add`, commentPayload);
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`${link}/comments/delete/${commentId}?userId=${userId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment');
    }
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const addToCart = async () => {
    if (!productData || Object.keys(productData).length === 0) {
      toast.warn("No product data available.");
      return;
    }

    const userDetail = localStorage.getItem('userdetail');
    if (!userDetail) {
      toast.warn("Please log in to add products to your cart");
      return;
    }
    const parsedDetail = JSON.parse(userDetail);
    const userId = parsedDetail.uid || parsedDetail._id;

    try {
      const response = await axios.post(`${link}/product/cart`, {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: mainImage,
        uid: userId,
      });
      if (response.data.message === 'f') {
        toast.warn('Product already added to cart');
      } else {
        await axios.get(`${link}/product/getcart/${userId}`);
        dispatch(fastcount());
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  if (!productData || Object.keys(productData).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <ToastContainer position="bottom-right" theme="colored" />

        {/* Product Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Image Gallery Section */}
            <div className="lg:w-1/2 w-full">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                    <div className="aspect-w-1 aspect-h-1 mb-4">
                      <InnerImageZoom
                        src={mainImage}
                        zoomSrc={mainImage}
                        alt={productData.name}
                        className="rounded-lg object-cover w-full h-full"
                        zoomScale={2}
                        onZoomChange={(isZoomed) => setIsZoomed(isZoomed)}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 mt-4">
                      {productData.images?.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                            mainImage === image ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          onClick={() => handleImageClick(image)}
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {productData.name}
                  </h1>
                  <div className="flex gap-2 md:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-red-50"
                    >
                      <FaHeart className={isWishlisted ? 'text-red-500' : 'text-gray-400'} size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-blue-50"
                    >
                      <BiShare className="text-gray-600" size={24} />
                    </motion.button>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6">
                  <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-yellow-700 font-bold mr-2">
                      {productData.rating?.toFixed(1) || '0.0'}
                    </span>
                    <ReactStars
                      count={5}
                      value={productData.rating || 0}
                      size={18}
                      edit={false}
                      activeColor="#fcd34d"
                      isHalf={true}
                    />
                  </div>
                  <span className="text-gray-500">
                    ({comments.length} {comments.length === 1 ? 'review' : 'reviews'})
                  </span>
                  <span className="text-blue-600 font-medium">{productData.pur || 0} purchased</span>
                </div>

                {/* Price Section */}
                <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8">
                  <div className="flex items-baseline gap-2 md:gap-4 mb-2">
                    <span className="text-2xl md:text-4xl font-bold text-gray-900">
                      {currency} {convertedPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {currency} {convertedMRP}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">Including all taxes</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {[{ icon: BiSupport, text: "24/7 Support" },
                    { icon: FaShippingFast, text: "Free Delivery" },
                    { icon: FaRegCheckCircle, text: "Warranty" },
                    { icon: FaRegCreditCard, text: "Secure Payment" },
                    { icon: FaStar, text: "Top Rated" },
                    { icon: FaRegCheckCircle, text: "Verified" }]
                    .map((feature, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <feature.icon className="text-blue-500 mb-2" size={24} />
                        <span className="text-sm text-gray-600 text-center">{feature.text}</span>
                      </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-8">
                  <div className="flex gap-2 md:gap-4 overflow-x-auto border-b">
                    {['description', 'specifications', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                          activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="py-4"
                    >
                      {activeTab === 'description' && (
                        <p className="text-gray-700 leading-relaxed">{productData.description}</p>
                      )}
                      {activeTab === 'specifications' && (
                        <ul className="space-y-2">
                          {productData.ati?.map((item, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <FaRegCheckCircle className="text-green-500 mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {activeTab === 'reviews' && (
                        <div className="space-y-4">
                          {comments.map((comment, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <span className="font-medium text-gray-900">{comment.username}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {comment.userId === userId && (
                                  <button
                                    onClick={() => handleCommentDelete(comment._id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-700">{comment.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToCart}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

            {userId ? (
              <div className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCommentSubmit}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  Post Review
                </motion.button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <p className="text-yellow-800">
                  Please sign in to leave a review and join the conversation.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {comment.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{comment.username}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {comment.userId === userId && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCommentDelete(comment._id)}
                          className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200 group"
                        >
                          <FaTrash className="text-gray-400 group-hover:text-red-500 transition-colors duration-200" size={16} />
                        </motion.button>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCheckCircle className="text-gray-400" size={20} md:size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">Be the first to share your thoughts about this product!</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:scale-105 flex flex-col justify-between"
                  onClick={() => window.location.href = `/productinfo/${product._id}`}
                >
                  <div className="relative">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="text-white text-lg font-semibold">View Product</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <ReactStars
                        count={5}
                        value={product.rating || 0}
                        size={20}
                        isHalf={true}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <span className="ml-2 text-gray-600">({product.rating || '0.0'})</span>
                    </div>
                    <p className="text-blue-600 font-bold text-lg">{product.price} {currency}</p>
                    <p className="text-gray-500 text-sm">Category: {product.category}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No featured products available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
