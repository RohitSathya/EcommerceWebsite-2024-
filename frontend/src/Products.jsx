import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { fastcount } from './Redux/totalslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCartPlus, FaShoppingBag } from 'react-icons/fa';
import ReactStars from 'react-rating-stars-component';
import { AppContext } from './AppContext'; // Import AppContext for currency conversion
import link from './link';

function Products({ data, func, namefunc, pi }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currency, exchangeRate } = useContext(AppContext); // Access currency and exchange rate from context

  // State for comments and loading state for Add to Cart button
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert price to the user's currency only once here
  const convertedPrice = (data.price * exchangeRate).toFixed(2);

  useEffect(() => {
    const userdetail = localStorage.getItem('userdetail');
    if (userdetail) {
      const parse = JSON.parse(userdetail);
      const names = parse.displayName || parse.name;
      namefunc(names);
    }
    fetchComments(); // Fetch comments when component mounts
  }, [namefunc]);

  // Fetch comments for the product
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${link}/comments/get/${data._id}`);
      setComments(response.data || []); // Set comments or empty array if none
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  function imgclick() {
    pi(data);
    navigate('/productinfo');
  }

  async function cart() {
    const userdetail = localStorage.getItem('userdetail');
    if (!userdetail) {
      alert("Please log in to add products to your cart");
      return;
    }

    const parse = JSON.parse(userdetail);
    let userId = parse.uid || parse._id;

    try {
      setIsLoading(true); // Set loading to true at the start of the request
      const response = await axios.post(`${link}/product/cart`, {
        name: data.name,
        category: data.category,
        price: convertedPrice,
        currency: currency,
        image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : data.image,
        uid: userId,
      });

      const { message } = response.data;
      if (message === 'f') {
        alert("Product Already Added to Cart");
      } else {
        const count = await axios.get(`${link}/product/getcart/${userId}`);
        dispatch(fastcount());
        func(count.data.length);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request is complete
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 hover:scale-105 flex flex-col justify-between relative"
    >
      <div className="relative cursor-pointer" onClick={imgclick}>
        <img
          src={Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : data.image}
          alt={data.name}
          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out"
        >
          <span className="text-white text-lg font-semibold">View Product</span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">{data.name}</h3>

        {/* Rating and Review Count */}
        <div className="flex items-center justify-center mb-2">
          <ReactStars
            count={5}
            value={data.rating}
            size={20}
            isHalf={true}
            edit={false}
            activeColor="#ffd700"
          />
          <span className="text-gray-600 text-sm ml-2">
            ({comments.length} {comments.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Purchase Count with Icon */}
        <div className="flex items-center justify-center mb-2">
          <FaShoppingBag className="text-gray-500 mr-2" />
          <p className="text-gray-500 text-sm text-center">{data.pur} purchased</p>
        </div>

        {/* Converted Price */}
        <p className="text-yellow-600 font-bold text-xl text-center mb-2">
          {convertedPrice} {currency}
        </p>

        {/* Category */}
        <p className="text-gray-500 text-sm text-center mb-4">Category: {data.category}</p>

        {/* Add to Cart Button with loading state */}
        <div className="flex justify-center">
          <button
            className="w-full flex items-center justify-center bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
            onClick={(e) => {
              e.stopPropagation();
              cart();
            }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <FaCartPlus className="mr-2" />
            )}
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
