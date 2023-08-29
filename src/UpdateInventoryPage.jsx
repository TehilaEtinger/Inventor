import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductInStock from './InventoryUpdate/ProductInStock';
import { Button } from '@mui/material';
import Search from './HomePage/Search'; // Import the Search component

export default function UpdateInventory() {
  const products = useSelector(state => state.stock);
  const [searchInput, setSearchInput] = useState('');

  // Function to filter the products based on the search input value
  const filterProducts = (input) => {
    setSearchInput(input.toLowerCase());
  };

  // Filter the products based on the search input value
  const filteredProducts = products.filter(product =>
    product.Name.toLowerCase().includes(searchInput)
  );

  return (
    <div>
      <br />
      <br></br>
      {/* Render the Search component and pass the filterProducts function as a prop */}
      <Search onSearch={filterProducts} />
      <div style={styles.container}>
        {/* Use the filteredProducts instead of products */}
        {filteredProducts.map(product => (
          <ProductInStock key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
};
