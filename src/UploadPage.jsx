import React from 'react';
import { Typography, Box } from '@mui/material';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const UploadPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const correctedData = correctData(results.data);
        localStorage.setItem('data', JSON.stringify(correctedData));
        navigate('/');
      },
    });
  };

  const correctData = (data) => {
    return data.map((row, index) => {
      let { x, y, category } = row;
      x = Math.abs(x);
      y = Math.abs(y);

      switch (category) {
        case 'חוזקות':
          // X ו-Y חייבים להיות חיוביים
          break;
        case 'חולשות':
          x = -x; // X שלילי, Y חיובי
          break;
        case 'איומים':
          x = -x; // X ו-Y שליליים
          y = -y;
          break;
        case 'הזדמנויות':
          y = -y; // X חיובי, Y שלילי
          break;
        default:
          break;
      }

      return {
        id: row.id || `Row${index}`,
        x,
        y,
        z: row.z,
        department: row.department,
        description: row.description,
        category: row.category,
      };
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        העלאת קובץ CSV
      </Typography>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ marginBottom: '16px' }}
      />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPage;
