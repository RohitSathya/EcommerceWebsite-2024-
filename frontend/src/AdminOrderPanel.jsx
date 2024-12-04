import React, { useState, useEffect } from 'react';
import axios from 'axios';
import link from './link';
import { Search, Package, User, MapPin, Calendar, Phone, CreditCard, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { IntlProvider, FormattedNumber } from 'react-intl';

export default function AdminOrderPanel() {
  const [orders, setOrders] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${link}/product/getallorders`);
      const allOrders = response.data;
      setOrders(allOrders);
      extractUniqueUsers(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const extractUniqueUsers = (orders) => {
    const userMap = new Map();
    orders.forEach((order) => {
      const { uid, address } = order;
      if (address) {
        const { name, phoneno } = address;
        if (!userMap.has(uid)) {
          userMap.set(uid, { name, phoneno, uid });
        }
      }
    });
    setUniqueUsers(Array.from(userMap.values()));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    const userOrders = orders.filter((order) => order.uid === user.uid);
    setSelectedUserOrders(userOrders);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const filteredUsers = uniqueUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneno.includes(searchTerm)
  );

  return (
    <IntlProvider locale="en" defaultLocale="en">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Panel - Users List */}
            <div className="md:w-1/3">
              <Card className="h-full">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    <div className="flex items-center gap-2">
                      <User className="w-6 h-6" />
                      <span>Users</span>
                    </div>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 h-[calc(100vh-16rem)] overflow-y-auto">
                    {filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        onClick={() => handleUserClick(user)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedUser?.uid === user.uid
                            ? 'bg-blue-50 border-blue-200 shadow-md'
                            : 'hover:bg-gray-50 border-transparent'
                        } border-2`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phoneno}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Orders Display */}
            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    <div className="flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      <span>
                        {selectedUser ? `${selectedUser.name}'s Orders` : 'Select a User'}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUserOrders.map((order, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border bg-white transition-all hover:shadow-lg"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={order.image}
                            alt={order.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900">{order.name}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              Price: 
                              <span className="font-medium text-gray-900">
                                <FormattedNumber value={order.price} style="currency" currency="INR" />
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Category: <span className="font-medium text-gray-900">{order.category}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Payment Type:{" "}
                              <span className="flex items-center gap-1 font-medium text-gray-900">
                                {order.paymentType === "card" && <CreditCard className="w-4 h-4 text-blue-500" />}
                                {order.paymentType === "upi" && <Wallet className="w-4 h-4 text-green-500" />}
                                {order.paymentType === "cod" && <Package className="w-4 h-4 text-yellow-500" />}
                                {order.paymentType.charAt(0).toUpperCase() + order.paymentType.slice(1)}
                              </span>
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.date)}</span>
                            </div>
                          </div>

                          {/* Address display for each order */}
                          <div className="mt-4 p-2 bg-blue-50 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <h4 className="font-semibold text-blue-900">Shipping Address</h4>
                            </div>
                            <p className="text-sm text-gray-700">{order.address.name}</p>
                            <p className="text-sm text-gray-700">{order.address.phoneno}</p>
                            <p className="text-sm text-gray-700">{order.address.area}</p>
                            <p className="text-sm text-gray-700">
                              {order.address.landmark}, {order.address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedUser && selectedUserOrders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders found for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}
