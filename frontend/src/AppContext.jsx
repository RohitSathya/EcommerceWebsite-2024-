// AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [exchangeRate, setExchangeRate] = useState(1); // Default rate

  useEffect(() => {
    const fetchUserCurrency = async () => {
      try {
        // Fetch user location and currency (using ipapi or similar service)
        const locationResponse = await axios.get('https://ipapi.co/json/');
        const userCurrency = locationResponse.data.currency;

        // Fetch exchange rate for the user's currency
        const exchangeRateResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
        const rate = exchangeRateResponse.data.rates[userCurrency];

        setCurrency(userCurrency);
        setExchangeRate(rate || 1); // Set rate to 1 if conversion fails
      } catch (error) {
        console.error("Error fetching currency data", error);
      }
    };

    fetchUserCurrency();
  }, []);

  return (
    <AppContext.Provider value={{ currency, exchangeRate }}>
      {children}
    </AppContext.Provider>
  );
};
