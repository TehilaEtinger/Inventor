import React from 'react';
import { Tabs, Tab } from '@mui/material';

export default function CategoryTabs  ({ activeTab, handleTabChange, products }){
  // Get unique categories from the products array
  const categories = Array.from(new Set(products.map((product) => product.Category)));

  // Generate tabs for each category
  const categoryTabs = ['הכל', ...categories].map((category,i) => (
    <Tab key={i} value={category} label={category} />
  ));

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      orientation="vertical"
      variant="scrollable"
      scrollButtons="auto"
      sx={{ justifyContent: 'center',
      minWidth: 'fit-content', // Adjust this value
      width: '100%' }}
    >
      {categoryTabs}
    </Tabs>
  );
};

