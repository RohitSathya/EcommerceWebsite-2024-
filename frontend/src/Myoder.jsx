import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Package2, Truck, CheckCircle2, Clock, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DisplayOrder from './DisplayOrder';
import link from './link';

export default function MyOrder({ pde }) {
  const [order, setOrder] = useState([]);
  const [res, setRes] = useState('s');
  const [trackingStates, setTrackingStates] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const fastcount = useSelector((state) => state.total.fastcounte);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getOrder();
  }, [fastcount]);

  const getOrder = async () => {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);
    const userId = parse.uid || parse._id;

    try {
      const response = await axios.get(`${link}/product/getorder/${userId}`);
      const { message, data } = response.data;
      setRes(message);
      if (message === 's') setOrder(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setRes('f');
    }
  };

  const handleTrackToggle = (orderId) => {
    setTrackingStates((prevStates) => ({
      ...prevStates,
      [orderId]: !prevStates[orderId],
    }));
  };

  function gp(e) {
    pde(e);
  }

  const formatDate = (date) => {
    if (!date) return 'TBD';
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const getStaticDates = (orderDate) => {
    const backendDate = new Date(orderDate);
    const orderedDate = new Date(backendDate);
    orderedDate.setDate(backendDate.getDate() - 2);

    const processingDate = new Date(backendDate);
    processingDate.setDate(backendDate.getDate() - 1);

    return {
      ordered: formatDate(orderedDate),
      processing: formatDate(processingDate),
      outForDelivery: formatDate(backendDate),
      delivered: formatDate(backendDate)
    };
  };

  const getTrackingStatus = (orderDate) => {
    const now = new Date(currentTime);
    const backendDate = new Date(orderDate);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const backendDateOnly = new Date(backendDate.getFullYear(), backendDate.getMonth(), backendDate.getDate());

    if (nowDate.getTime() === backendDateOnly.getTime()) {
      return now.getHours() >= 21 ? 'delivered' : 'out-for-delivery';
    }

    if (nowDate < backendDateOnly) {
      const oneDayBefore = new Date(backendDate);
      oneDayBefore.setDate(backendDate.getDate() - 1);
      oneDayBefore.setHours(0, 0, 0, 0);
      return nowDate >= oneDayBefore ? 'processing' : 'ordered';
    }

    return 'delivered';
  };

  const TrackingStep = ({ isActive, icon: Icon, label, date, isCompleted, status, step }) => {
    const determineCompletion = () => {
      const stepOrder = ['ordered', 'processing', 'out-for-delivery', 'delivered'];
      const currentStepIndex = stepOrder.indexOf(status);
      const thisStepIndex = stepOrder.indexOf(step);
      if (status === 'delivered') return true;
      return thisStepIndex < currentStepIndex;
    };

    const isStepCompleted = determineCompletion();

    return (
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors duration-300
            ${isStepCompleted ? 'bg-green-100 text-green-600' : 
              isActive ? 'bg-blue-100 text-blue-600' : 
              'bg-gray-100 text-gray-400'}`}
        >
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <p className={`text-xs sm:text-sm font-medium ${isActive || isStepCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    );
  };

  const OrderStatus = ({ status, deliveryDate }) => {
    const messages = {
      ordered: 'Order confirmed! We\'re preparing your package.',
      processing: 'Your package is being processed at our facility.',
      'out-for-delivery': 'Your package is out for delivery! Expected delivery by 9 PM today.',
      delivered: 'Package delivered successfully!'
    };

    const statusMessage = messages[status];

    return (
      <div className="mt-4 p-3 sm:mt-8 sm:p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700 font-medium text-center">{statusMessage}</p>
      </div>
    );
  };

  const ProgressBar = ({ status }) => {
    const getWidth = () => {
      switch (status) {
        case 'ordered': return 'w-1/4';
        case 'processing': return 'w-1/2';
        case 'out-for-delivery': return 'w-3/4';
        case 'delivered': return 'w-full';
        default: return 'w-0';
      }
    };

    return (
      <div className="absolute top-8 left-0 w-full h-1 bg-gray-200">
        <div className={`h-full bg-blue-500 transition-all duration-700 ease-in-out ${getWidth()}`} />
      </div>
    );
  };

  const OrderCard = ({ order }) => {
    const status = getTrackingStatus(order.date);
    const dates = getStaticDates(order.date);

    return (
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <DisplayOrder data={order} l={dates.delivered} p={getOrder} pd={gp} />
          
          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => handleTrackToggle(order._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Package2 className="w-5 h-5" />
              <span>{trackingStates[order._id] ? 'Hide Tracking' : 'Track Package'}</span>
            </button>
          </div>

          {trackingStates[order._id] && (
            <div className="mt-4 sm:mt-8 relative">
              <ProgressBar status={status} />

              <div className="relative flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
                <TrackingStep 
                  icon={Box}
                  label="Ordered"
                  date={dates.ordered}
                  isActive={status === 'ordered'}
                  status={status}
                  step="ordered"
                />
                <TrackingStep 
                  icon={Clock}
                  label="Processing"
                  date={dates.processing}
                  isActive={status === 'processing'}
                  status={status}
                  step="processing"
                />
                <TrackingStep 
                  icon={Truck}
                  label="Out for Delivery"
                  date={dates.outForDelivery}
                  isActive={status === 'out-for-delivery'}
                  status={status}
                  step="out-for-delivery"
                />
                <TrackingStep 
                  icon={CheckCircle2}
                  label="Delivered"
                  date={dates.delivered}
                  isActive={status === 'delivered'}
                  status={status}
                  step="delivered"
                />
              </div>

              <OrderStatus status={status} deliveryDate={order.date} />
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (res !== 's') {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-semibold text-gray-700">Your Order is Empty!!!</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {order && order.length > 0 ? (
          order.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))
        ) : (
          <p className="text-center text-gray-700 col-span-2">No orders found.</p>
        )}
      </div>
    </div>
  );
}
