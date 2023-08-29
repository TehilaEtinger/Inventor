import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import db from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesStatistics = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const currentDate = new Date();
        const fourWeeksAgo = new Date(currentDate);
        fourWeeksAgo.setDate(currentDate.getDate() - 28); // 4 weeks * 7 days per week

        const q = query(
          collection(db, 'sold'),
          where('purchaseDate', '>=', Timestamp.fromDate(fourWeeksAgo))
        );
        const querySnapshot = await getDocs(q);

        const salesData = querySnapshot.docs.map((doc) => doc.data());
        const formattedSalesData = transformSalesData(salesData, fourWeeksAgo);
        setSalesData(formattedSalesData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const transformSalesData = (data, fourWeeksAgo) => {
    const productSales = {};
  
    // Group sales data by product and week
    data.forEach((sale) => {
      const purchaseDate = sale.purchaseDate.toDate();
      const daysDiff = Math.floor((purchaseDate - fourWeeksAgo) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.floor(daysDiff / 7); // Calculate the week index within the 4-week period
      const productName = sale.Name; // Adjust this based on your data
  
      if (!productSales[productName]) {
        productSales[productName] = Array(4).fill(0); // Initialize an array for 4 weeks
      }
  
      if (weekNumber >= 0 && weekNumber <= 3) {
        productSales[productName][weekNumber] += sale.Quantity; // Accumulate sales for the corresponding week
      }
    });
  
    const formattedData = Object.keys(productSales).map((productName) => {
      const weeklySales = productSales[productName];
      return { name: productName, ...weeklySales };
    });
  
    return formattedData;
  };
  

  const getWeekNumber = (date, fourWeeksAgo) => {
    const timeDiff = date - fourWeeksAgo;
    const weekNumber = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
  };
  
  
  return (
    <div>
       
      <h2>Sales Statistics by Week</h2>
      <BarChart
        width={800}
        height={400}
        data={salesData}
        
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* Create a Bar for each week */}
        {["לפני 4 שבועות","לפני 3 שבועות","לפני שבועיים","השבוע האחרון" ].map((weekLabel, index) => (
            <Bar
            key={weekLabel}
            dataKey={index}
            name={weekLabel}
            fill={`#${((Math.random() * 0xffffff) << 0).toString(16)}`}
            />
        ))}
    </BarChart>

    </div>
  );
};

export default SalesStatistics;
