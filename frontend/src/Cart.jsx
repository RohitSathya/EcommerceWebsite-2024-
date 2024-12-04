import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartDisplay from './CartDisplay';
import { addTotal, fastcount, getcount, removeqty, reset } from './Redux/totalslice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import greentick from '../images/greentick.png';
import link from './link';

export default function Cart({ func, funce }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxtotal = useSelector((state) => state.total.total).toFixed(2);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [fl, setFl] = useState(0);
  const [ry, setRy] = useState(0);

  // Define locale and currency for formatting (adjust according to user location or preferences)
  const locale = 'en-IN'; // Indian locale
  const currency = 'INR'; // Indian Rupee

  useEffect(() => {
    async function getCart() {
      try {
        const userdetail = localStorage.getItem('userdetail');
        const parsedUserDetail = JSON.parse(userdetail);

        let userId = parsedUserDetail.uid || parsedUserDetail._id;
        const response = await axios.get(`${link}/product/getcart/${userId}`);

        if (response.data.length !== undefined) {
          setCart(response.data);
          setCount(response.data.length);

          const totalPrice = response.data.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price.replace(' USD'));
            return acc + itemPrice;
          }, 0);
          setTotal(totalPrice.toFixed(2));
        } else {
          setTotal(0);
          setFl(0);
          dispatch(fastcount());
          setRy(1);
        }
      } catch (e) {
        console.error(e);
      }
    }
    getCart();
  }, [count, dispatch]);

  function getQty(index, price, qty) {
    qty -= 1;
    const prices = parseFloat(price.replace(' USD'));
    const multiplyQtyPrice = prices * qty;
    dispatch(addTotal({ prevtotal: total, index, mul: multiplyQtyPrice }));
    setFl(1);
  }

  async function deleteCart(e, index) {
    const userdetail = localStorage.getItem('userdetail');
    const parsedUserDetail = JSON.parse(userdetail);
    let userId = parsedUserDetail.uid || parsedUserDetail._id;

    const deleteResponse = await axios.delete(`${link}/product/deletecart/${userId}/${e}`);
    if (deleteResponse.data.message === 's') {
      const response = await axios.get(`${link}/product/getcart/${userId}`);
      setCart(response.data);
      setCount(response.data.length);

      const totalPrice = response.data.reduce((acc, item) => {
        const itemPrice = parseFloat(item.price.replace(' USD'));
        return acc + itemPrice;
      }, 0) || 0;
      setTotal(totalPrice.toFixed(2));
      setFl(0);
      dispatch(getcount(response.data.length));
      localStorage.removeItem(`savedqty${index}`);
      dispatch(reset());
      dispatch(removeqty({ index, val: 0 }));
    }
  }

  async function buy() {
    if ((total === 0 && reduxtotal === 0) || ry === 1) {
      alert('Your cart is empty. Cannot proceed to payment page.');
    } else {
      const userdetail = localStorage.getItem('userdetail');
      const parsedUserDetail = JSON.parse(userdetail);
      let userId = parsedUserDetail.uid || parsedUserDetail._id;

      const response = await axios.get(`${link}/product/getcart/${userId}`);
      func(fl === 0 ? total : reduxtotal);
      funce(response.data);
      navigate('/buy');
    }
  }

  // Format the currency using Intl.NumberFormat
  const formattedTotal = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(fl === 0 ? total : reduxtotal);

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <img src={greentick} alt="Green Tick" className="w-6 h-6" />
          <span className="text-green-600 text-sm font-semibold">Your order is eligible for FREE Delivery</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Subtotal ({count} items):</h2>
          <h2 className="text-2xl font-extrabold text-gray-900">{formattedTotal}</h2>
        </div>
        <button
          className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-150"
          onClick={buy}
        >
          Proceed to Checkout
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 space-y-4">
        {cart.length > 0 ? (
          cart.map((c, index) => (
            <CartDisplay
              key={index}
              data={c}
              func={getQty}
              ke={index}
              deletes={deleteCart}
            />
          ))
        ) : (
          <div className="text-center text-gray-600">
            <h2 className="text-lg font-semibold">Your Cart is Empty!</h2>
            <p className="text-sm">Browse our categories and discover our best deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
