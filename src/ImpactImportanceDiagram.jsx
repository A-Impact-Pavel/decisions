import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, styled, keyframes } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Slider, Checkbox, FormControlLabel, Paper, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Link } from 'react-router-dom';

const NoScrollContainer = styled(Container)({
  height: '100vh',
  overflow: 'hidden',
});

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedTitleContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  marginBottom: '16px',
});

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF8E53, black 33%, black 66%, #FF8E53)',
  backgroundSize: '300% 300%',
  animation: `${gradientAnimation} 20s ease infinite`,
  color: 'white',
  padding: '10px 20px',
  borderRadius: '8px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  transition: 'transform 0.9s ease-in-out',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Logo = styled('img')({
  position: 'absolute',
  top: '50%',
  left: '16px',
  transform: 'translateY(-50%)',
  height: '50px',
  zIndex: 1,
});

const EnhancedTitle = () => (
  <AnimatedTitleContainer>
    <AnimatedTitle variant="h3">
      Decision Making Platform
    </AnimatedTitle>
    <Logo src="https://i.postimg.cc/ncLP4Ghr/Strategy-AI-People-3.png" alt="Logo" />
  </AnimatedTitleContainer>
);

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const rtlTheme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Segoe UI',
  },
});

const initialData = [
  { id: 'A', x: 7, y: 8, z: 10, department: 'הנהלה', description: 'פיתוח אסטרטגיה חדשה', category: 'חוזקות' },
  { id: 'B', x: -6, y: 4, z: 3, department: 'כספים', description: 'הטמעת מערכת פיננסית חדשה', category: 'חולשות' },
  { id: 'C', x: 3, y: -5, z: 4, department: 'HR', description: 'תכנית הכשרה מקיפה', category: 'הזדמנויות' },
  { id: 'D', x: -4, y: -6, z: 2, department: 'שיווק', description: 'קמפיין פרסומי חדש', category: 'איומים' },
  { id: 'E', x: 5, y: -3, z: 6, department: 'מחקר ופיתוח', description: 'פיתוח מוצר חדשני', category: 'הזדמנויות' },
  { id: 'F', x: -2, y: 7, z: 3, department: 'תפעול', description: 'ייעול תהליכי ייצור', category: 'חולשות' },
  { id: 'G', x: 8, y: 1, z: 5, department: 'הנהלה', description: 'הרחבה לשווקים חדשים', category: 'חוזקות' },
  { id: 'H', x: 1, y: 9, z: 4, department: 'HR', description: 'תכנית רווחה לעובדים', category: 'חוזקות' },
];

const colors = {
  'הנהלה': '#1a5fb4',
  'כספים': '#e66100',
  'HR': '#813d9c',
  'שיווק': '#c01c28',
  'מחקר ופיתוח': '#26a269',
  'תפעול': '#a51d2d',
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const CustomizationDialog = ({ open, onClose, onSave, initialLabels }) => {
  const [labels, setLabels] = useState(initialLabels);

  const handleChange = (field, value) => {
    setLabels(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (dept, value) => {
    setLabels(prev => ({
      ...prev,
      departments: {
        ...prev.departments,
        [dept]: value
      }
    }));
  };

   return (
     <Dialog open={open} onClose={onClose}>
       <DialogTitle dir='rtl'>התאמה אישית של תוויות</DialogTitle>
       <DialogContent dir='rtl'>
          <TextField
            fullWidth
            margin="normal"
            label="השפעה"
            value={labels.impact}
            onChange={(e) => handleChange('impact', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="חשיבות"
            value={labels.importance}
            onChange={(e) => handleChange('importance', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="מורכבות"
            value={labels.complexity}
            onChange={(e) => handleChange('complexity', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="כותרת מחלקות"
            value={labels.departmentsTitle}
            onChange={(e) => handleChange('departmentsTitle', e.target.value)}
          />
          {Object.keys(initialLabels.departments).map((dept, index) => (
            <TextField
              key={index}
              fullWidth
              margin="normal"
              label={`מחלקה ${index + 1}`}
              value={labels.departments[dept]}
              onChange={(e) =>  handleDepartmentChange(dept, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button onClick={() => onSave(labels)}>שמור</Button>
        </DialogActions>
      </Dialog>
    );
  };

const ImpactImportanceDiagram = () => {
  const [customLabels, setCustomLabels] = useState({
    impact: 'השפעה',
    importance: 'חשיבות',
    complexity: 'מורכבות',
    departmentsTitle: 'מחלקות',
    departments: { ...colors },
  });
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    impact: 0,
    importance: 0,
    complexity: 0,
    department: Object.keys(colors),
  });
  const [highlightState, setHighlightState] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Math.abs(item.x) >= filters.impact &&
      Math.abs(item.y) >= filters.importance &&
      item.z >= filters.complexity &&
      filters.department.includes(item.department)
    );
  }, [filters, data]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getQuadrantViewBox = () => {
    return '-45 -450 810 500';
  };

  const handleHighlightClick = () => {
    setHighlightState((prevState) => (prevState + 1) % 4);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenCustomizationDialog = () => {
    setIsCustomizationDialogOpen(true);
  };

  const handleCloseCustomizationDialog = () => {
    setIsCustomizationDialogOpen(false);
  };

  const handleSaveCustomLabels = (newLabels) => {
    setCustomLabels(newLabels);
    setIsCustomizationDialogOpen(false);
  };

  const resetAll = () => {
    setFilters({
      impact: 0,
      importance: 0,
      complexity: 0,
      department: Object.keys(colors),
    });
    setHighlightState(0);
    setSelectedItem(null);
  };

        return (
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={rtlTheme}>
              <CssBaseline />
              <NoScrollContainer maxWidth={false} style={{ padding: '16px' }}>
                <Container maxWidth={false} style={{ height: '100vh', padding: '16px' }}>
                  <EnhancedTitle />
                  <Grid container spacing={2} style={{ height: 'calc(100% - 60px)' }}>
                    <Grid item xs={12} md={9} style={{ height: '100%' }}>
                      <StyledPaper>
                        <svg 
                          width="100%" 
                          height="100%" 
                          viewBox={getQuadrantViewBox()}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <radialGradient id="grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                              <stop offset="0%" stopColor="#f0f0f0" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.2" />
                            </radialGradient>
                            <mask id="extreme-mask">
                              <rect x="0" y="-450" width="800" height="450" fill="black" />
                              <rect x="400" y="-450" width="400" height="225" fill="white" />
                            </mask>
                            <mask id="center-mask">
                              <rect x="0" y="-450" width="800" height="450" fill="black" />
                              <rect x="0" y="-224" width="400" height="225" fill="white" />
                            </mask>
                          </defs>

                          <rect x="0" y="-450" width="800" height="450" fill="url(#grid-gradient)" />

                          {(highlightState === 1 || highlightState === 3) && (
                            <rect x="0" y="-450" width="800" height="450" fill="rgba(0,255,0,0.2)" mask="url(#extreme-mask)" />
                          )}
                          {(highlightState === 2 || highlightState === 3) && (
                            <rect x="0" y="-450" width="800" height="450" fill="rgba(255,0,0,0.2)" mask="url(#center-mask)" />
                          )}

                          {[2.5, 5, 7.5].map(v => (
                            <React.Fragment key={v}>
                              <line x1={v * 80} y1="-450" x2={v * 80} y2="0" stroke="#d0d0d0" strokeWidth="1" />
                              <line x1="0" y1={v * -45} x2="800" y2={v * -45} stroke="#d0d0d0" strokeWidth="1" />
                            </React.Fragment>
                          ))}

                          <line x1="0" y1="0" x2="800" y2="0" stroke="black" strokeWidth="4" />
                          <line x1="0" y1="-450" x2="0" y2="0" stroke="black" strokeWidth="4" />

                          <polygon points="800,0 770,-10 770,10" fill="black" />
                          <polygon points="0,-450 -10,-420 10,-420" fill="black" />

                          <text x="790" y="30" fontSize="15" fontWeight="bold" textAnchor="end" fill="#333">{` מקסימום ${customLabels.impact}`}</text>
                          <text x="-80" y="-420" fontSize="15" fontWeight="bold" textAnchor="start" fill="#333">{`מקסימום`}</text>
                          <text x="-80" y="-400" fontSize="15" fontWeight="bold" textAnchor="start" fill="#333">{`${customLabels.importance}`}</text>
                          <text x="-80" y="10" fontSize="15" fontWeight="bold" fill="#333">מינימום</text>

                          {filteredData.map((item) => {
                            if (item.x > 0 && item.y > 0) {
                              const circleSize = 1 + item.z * 3;
                              return (
                                <g 
                                  key={item.id} 
                                  onClick={() => handleItemClick(item)} 
                                  style={{ cursor: 'pointer' }}
                                  className="circle-group"
                                >
                                  <circle 
                                    cx={(item.x * 80)} 
                                    cy={(item.y * -45)} 
                                    r={circleSize}
                                    fill={colors[item.department]}
                                  />
                                  <text
                                    x={(item.x * 80)}
                                    y={(item.y * -45) + circleSize + 15}
                                    textAnchor="middle"
                                    fill="black"
                                    fontSize="12"
                                    fontWeight="bold"
                                  >
                                    {item.id}
                                  </text>
                                  <text
                                    x={(item.x * 80)}
                                    y={(item.y * -45) + circleSize + 30}
                                    textAnchor="middle"
                                    fill="black"
                                    fontSize="16"
                                  >
                                    {item.description}
                                  </text>
                                </g>
                              );
                            }
                            return null;
                          })}
                        </svg>
                      </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} style={{ height: '100%' }}>
                      <FilterPaper>
                        <Typography variant="h6" gutterBottom align="center">פילטרים</Typography>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Button 
                              fullWidth
                              variant="contained"
                              color="error"
                              onClick={resetAll}
                            >
                              איפוס
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button 
                              fullWidth
                              variant="contained" 
                              onClick={handleHighlightClick}
                              sx={{ 
                                backgroundColor: 'mediumseagreen', 
                                color: 'white', 
                                '&:hover': {
                                  backgroundColor: 'seagreen'
                                }
                              }}
                            >
                              אזורי השפעה
                            </Button>
                          </Grid>
                        </Grid>
                        <Typography align="left" gutterBottom>{`${customLabels.impact}: ${filters.impact}`}</Typography>
                        <Slider
                          value={filters.impact}
                          onChange={(_, value) => handleFilterChange('impact', value)}
                          min={0}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                        <Typography align="left" gutterBottom>{`${customLabels.importance}: ${filters.importance}`}</Typography>
                        <Slider
                          value={filters.importance}
                          onChange={(_, value) => handleFilterChange('importance', value)}
                          min={0}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                        <Typography align="left" gutterBottom>{`${customLabels.complexity}: ${filters.complexity}`}</Typography>
                        <Slider
                          value={filters.complexity}
                          onChange={(_, value) => handleFilterChange('complexity', value)}
                          min={0}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                        />
                        <Typography variant="h6" gutterBottom align="center">
                          {customLabels.departmentsTitle}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          justifyContent: 'flex-end',
                          gap: 1
                        }}>
                          {Object.keys(customLabels.departments).map(dept => (
                            <FormControlLabel
                              key={dept}
                              control={
                                <Checkbox
                                  checked={filters.department.includes(dept)}
                                  onChange={() => {
                                    if (filters.department.includes(dept)) {
                                      handleFilterChange('department', filters.department.filter(d => d !== dept));
                                    } else {
                                      handleFilterChange('department', [...filters.department, dept]);
                                    }
                                  }}
                                  style={{ color: colors[dept] }}
                                />
                              }
                              label={customLabels.departments[dept]}
                              labelPlacement="start"
                              sx={{
                                margin: 0,
                                '& .MuiFormControlLabel-label': {
                                  marginLeft: 1,
                                  marginRight: 1,
                                },
                              }}
                            />
                          ))}
                        </Box>
                        <Button 
                          onClick={handleOpenCustomizationDialog} 
                          variant="contained" 
                          color="primary" 
                          style={{ marginTop: '16px', width: '100%' }}
                        >
                          התאמה אישית של תוויות
                        </Button>
                        <Link 
                          to="/upload" 
                          style={{ 
                            textDecoration: 'none', 
                            fontSize: '5px', 
                            color: 'yellow', 
                            marginLeft: '10px', 
                            textAlign: 'right',
                          }}
                        >
                          העלאת קובץ
                        </Link>
                      </FilterPaper>
                    </Grid>
                  </Grid>
                </Container>
              </NoScrollContainer>
        <Dialog 
          open={isDialogOpen} 
          onClose={handleCloseDialog} 
          dir="rtl"
          sx={{
            '& .MuiDialog-paper': {
              maxWidth: '80%',
              maxHeight: '80%',
            },
          }}
        >
          <DialogContent>
            {selectedItem && (
              <>
                <Typography variant="h6">{selectedItem.description}</Typography>
                <Typography><strong>מחלקה:</strong> {selectedItem.department}</Typography>
                <Typography><strong>קטגוריה:</strong> {selectedItem.category}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              סגור
            </Button>
          </DialogActions>
        </Dialog>
        <CustomizationDialog
          open={isCustomizationDialogOpen}
          onClose={handleCloseCustomizationDialog}
          onSave={handleSaveCustomLabels}
          initialLabels={customLabels}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ImpactImportanceDiagram;