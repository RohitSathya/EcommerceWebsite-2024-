import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Phone, Mail, User, Home, Landmark } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import link from './link';

export default function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [email, setEmail] = useState('');
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: false, message: '' });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Track the selected address
  const [addressForm, setAddressForm] = useState({
    country: 'India',
    name: '',
    phoneno: '',
    pincode: '',
    area: '',
    landmark: ''
  });

  useEffect(() => {
    const userdetail = localStorage.getItem('userdetail');
    if (userdetail) {
      const parsedUserDetail = JSON.parse(userdetail);
      setUserDetails(parsedUserDetail);
      setIsGoogleSignIn(!!parsedUserDetail.displayName);
      setAddressForm((prev) => ({
        ...prev,
        name: parsedUserDetail.displayName || parsedUserDetail.name || 'Guest'
      }));
      if (validateEmail(parsedUserDetail.email)) {
        setEmail(parsedUserDetail.email);
      }
      fetchAddresses(parsedUserDetail);
    }
  }, []);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const fetchAddresses = async (user) => {
    try {
      const response = await axios.get(`${link}/product/getaddress/${user._id || user.uid}`);
      if (response.data.message === 's' && response.data.addresses) {
        setAddresses(response.data.addresses);
        setSelectedAddress(response.data.addresses[0]?._id); // Default to the first address
        setAddressForm(response.data.addresses[0] || {});
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (addressId) => {
    const selected = addresses.find((addr) => addr._id === addressId);
    setSelectedAddress(addressId);
    setAddressForm(selected || {});
  };

  const handleAddressSubmit = async () => {
    setIsLoading(true);
    try {
      const userId = userDetails._id || userDetails.uid;
      if (selectedAddress) {
        await axios.put(`${link}/product/updateaddress/${userId}/${addressForm.name}/${addressForm.phoneno}/${addressForm.landmark}/${addressForm.pincode}/${addressForm.area}`);
      } else {
        await axios.post(`${link}/product/address`, { ...addressForm, uid: userId });
      }
      setSaveStatus({ show: true, success: true, message: 'Address updated successfully!' });
      fetchAddresses(userDetails); // Refresh the list of addresses
    } catch (error) {
      setSaveStatus({ show: true, success: false, message: 'Failed to update address. Please try again.' });
    }
    setIsLoading(false);
    setTimeout(() => setSaveStatus({ show: false, success: false, message: '' }), 3000);
  };

  const handleInputChange = (name, value) => {
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-bold">
              <User className="w-8 h-8 text-blue-500" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <Input
                    value={addressForm.name}
                    readOnly
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {!isGoogleSignIn && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Address Selection and Form Section */}
            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                Delivery Address
              </h3>

              {/* Address Selector */}
              {addresses.length > 0 && (
                <div className="mb-4">
                  <Select value={selectedAddress} onValueChange={handleAddressSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((addr) => (
                        <SelectItem key={addr._id} value={addr._id}>
                          {addr.area}, {addr.landmark} - {addr.pincode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Address Form */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country/Region</label>
                  <Select value={addressForm.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <Input
                      type="tel"
                      value={addressForm.phoneno}
                      onChange={(e) => handleInputChange('phoneno', e.target.value)}
                      maxLength={10}
                      className="pl-10"
                      placeholder="Enter mobile number"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      maxLength={6}
                      className="pl-10"
                      placeholder="Enter pincode"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Area</label>
                  <div className="relative">
                    <Input
                      value={addressForm.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your area"
                    />
                    <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Landmark</label>
                  <div className="relative">
                    <Input
                      value={addressForm.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="pl-10"
                      placeholder="Enter a landmark"
                    />
                    <Landmark className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleAddressSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Address'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Go Back
              </Button>
            </div>

            {/* Status Alert */}
            <AnimatePresence>
              {saveStatus.show && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant={saveStatus.success ? "default" : "destructive"}>
                    <AlertDescription>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
