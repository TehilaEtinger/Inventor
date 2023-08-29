import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function Search({ onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  const handleSearchInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchQuery(input);
    onSearch(input);
    setIsExpanded(input !== ''); // Set isExpanded to true when there is input, and false when the input is empty
  };

  return (
    <div style={{ position: 'fixed', top: '40px', left: '10px', zIndex: '999' }}>
      <TextField
        type="search"
        placeholder="מחפש..."
        onChange={handleSearchInputChange}
        value={searchQuery}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            width: isExpanded ? '200px' : '60px',
            height: isExpanded ? '60px' : '60px',
            transition: 'width 0.3s ease',
            borderRadius: isExpanded ? '4px' : '50%',
          },
        }}
      />
    </div>
  );
}
