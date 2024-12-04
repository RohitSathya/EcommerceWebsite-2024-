import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AiOutlineWarning } from 'react-icons/ai';
import link from './link';

export default function DisplayOrder({ data, p, l, pd }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cancelOrder = async () => {
    const userdetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userdetail);
    const userId = parse.uid || parse._id;

    try {
      const response = await axios.delete(`${link}/product/deleteorder/${userId}/${data._id}`);
      const { messsage } = response.data;
      if (messsage === 's') {
        p();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  async function sub(e) {
    const res = await axios.post(`${link}/product/mp/`, { name: e });
    const { data } = res.data;
    pd(data);
  }

  const showConfirmDialog = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div style={styles.confirmBox}>
          <AiOutlineWarning size={40} color="#FF6A00" />
          <h2 style={styles.title}>Cancel Order?</h2>
          <p style={styles.message}>Are you sure you want to cancel this order? This action cannot be undone.</p>
          <div style={styles.buttonContainer}>
            <button
              style={styles.confirmButton}
              onClick={() => {
                cancelOrder();
                onClose();
              }}
            >
              Yes, Cancel Order
            </button>
            <button style={styles.cancelButton} onClick={onClose}>
              No, Keep Order
            </button>
          </div>
        </div>
      ),
    });
  };

 const downloadInvoice = () => {
  const invoiceContent = `
      ===============================
                INVOICE
      ===============================

      Order ID: ${data._id}
      Order Date: ${new Date().toLocaleDateString()}
      
      --------------------------------
      Sold by:
      ROYOMART
      Website: www.explorepricing.com
      Customer Support: support@royomart.com
      --------------------------------

      Ship To:
      Name: ${data.customerName || 'N/A'}
      Address: ${data.customerAddress || 'N/A'}
      --------------------------------

      Product Details:
      --------------------------------
      Product Name: ${data.name}
      Category: ${data.category}
      Price: ₹${data.price}
      Quantity: ${data.quantity || 1}
      Subtotal: ₹${data.price * (data.quantity || 1)}
      
      --------------------------------
      Payment Information:
      Payment Type: ${data.paymentType}
      Transaction ID: ${data._id || 'N/A'}
      Status: ${data.paymentStatus || 'Paid'}

      --------------------------------
      Thank you for shopping with us!

      Terms & Conditions:
      - Products once delivered cannot be returned.
      - Please retain this invoice for future reference.
      - For assistance, please contact our support team.

      --------------------------------
      ROYOMART
      Invoice Generated on ${new Date().toLocaleString()}

      ===============================
  `;

  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name}_Invoice.txt`;
  a.click();
  URL.revokeObjectURL(url);
};



  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 w-full max-w-xl mx-auto">
      {/* Left - Product Image */}
      <img
        src={data.image}
        alt={data.name}
        className="w-20 h-20 object-contain rounded-md"
      />

      {/* Middle - Product Info */}
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm font-semibold text-gray-700">Delivered {l}</p>
        <p className="text-xs text-gray-500">Parcel was handed to resident.</p>
        <h3 className="text-md font-semibold text-gray-800 mt-2">{data.name}</h3>
        <button
          onClick={() => sub(data.name)}
          className="mt-2 px-3 py-1 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500 transition duration-150 ease-in-out w-full md:w-auto"
        >
          View Your Item
        </button>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex flex-col space-y-2 w-full md:w-auto">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out w-full"
          onClick={downloadInvoice}
        >
          Download Invoice
        </button>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-150 ease-in-out w-full"
          onClick={showConfirmDialog}
          disabled={loading}
        >
          {loading ? 'Cancelling...' : 'Cancel Order'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  confirmBox: {
    background: 'white',
    borderRadius: '10px',
    padding: '30px',
    width: '90%',
    maxWidth: '320px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease-in-out',
    margin: '0 auto',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '15px 0 10px',
    color: '#333',
  },
  message: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  confirmButton: {
    backgroundColor: '#FF6A00',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
     borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};
