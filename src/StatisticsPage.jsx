import React, { useState } from 'react';
import { Button, Fade, Grid } from '@mui/material';
import SalesStatistics from './Statistics/SalesStatistics';

export default function StatisticsPage() {
  const [showStatistics, setShowStatistics] = useState(false);

  const handleShowStatistics = () => {
    setShowStatistics(true);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      {showStatistics ? (
        <Fade in={showStatistics}>
          <div>
            <SalesStatistics />
          </div>
        </Fade>
      ) : (
        <Button variant="contained" color="primary" onClick={handleShowStatistics}>
          צפייה בסטיסטיקות
        </Button>
      )}
    </Grid>
  );
}
