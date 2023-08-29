import React from 'react';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

const DiscountTemplates = ({ onSelectTemplate }) => {
  const templateOptions = [
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'buy_get_free', label: 'Buy X Get Y Free' },
    { value: 'buy_pay_', label: 'Buy X pay Y ' },
    { value: 'the_in_%', label: 'Buy X get _% discount ' },
    
    // ... other template options ...
  ];

  return (
    <Paper elevation={2} style={{ padding: '16px' }}>
      <List>
        {templateOptions.map((template) => (
          <ListItem
            key={template.value}
            button
            onClick={() => onSelectTemplate(template.value)}
          >
            <ListItemText primary={template.label} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DiscountTemplates;
