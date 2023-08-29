import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';

function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', paddingTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        אופס, הדף שאתה מחפש לא נמצא!
      </Typography>
      <Typography variant="body1" paragraph>
        בוא נחזיר אותך לדרך הנכונה.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        חזור לדף הבית
      </Button>
    </Container>
  );
}

export default NotFound;
