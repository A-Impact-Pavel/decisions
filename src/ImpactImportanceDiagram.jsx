import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme, styled, keyframes } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Slider, Checkbox, FormControlLabel, Paper, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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
  left: '16px', // Adjust this value to position the logo as needed
  transform: 'translateY(-50%)',
  height: '50px', // Adjust the size as needed
  zIndex: 1,
});

const EnhancedTitle = () => {
  return (
    <AnimatedTitleContainer>
      <AnimatedTitle variant="h3">
        Strategic Focus & Insights Platform
      </AnimatedTitle>
      <Logo src="https://i.postimg.cc/ncLP4Ghr/Strategy-AI-People-3.png" alt="Logo" />
    </AnimatedTitleContainer>
  );
};

// Create rtl cache
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

const ImpactImportanceDiagram = () => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);


  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const initialFilters = {
    impact: 0,
    importance: 0,
    complexity: 0,
    department: Object.keys(colors),
  };

  const [data, setData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [zoomedQuadrant, setZoomedQuadrant] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [highlightState, setHighlightState] = useState(0); // 0: none, 1: extreme, 2: center, 3: both
  const [highlightSpecialState, setHighlightSpecialState] = useState(0); // 0: none, 1: right-green, 2: left-red, 3: top-right-bottom-left-blue, 4: bottom-right-top-left-blue

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const resetAll = () => {
    setFilters(initialFilters);
    setHighlightState(0);
    setHighlightSpecialState(0);
    setSelectedItem(null);
    setZoomedQuadrant(null);
  };

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

  const getQuadrantViewBox = (quadrant) => {
    switch(quadrant) {
      case 'Strengths': return '0 -450 800 450';
      case 'Weaknesses': return '-800 -450 800 450';
      case 'Opportunities': return '0 0 800 450';
      case 'Threats': return '-800 0 800 450';
      default: return '-800 -450 1600 900';
    }
  };

  const handleQuadrantClick = (quadrant) => {
    setZoomedQuadrant(quadrant === zoomedQuadrant ? null : quadrant);
  };

  const handleHighlightClick = () => {
    setHighlightState((prevState) => (prevState + 1) % 4);
  };

  const handleSpecialHighlightClick = (state) => {
    setHighlightSpecialState((prevState) => (prevState === state ? 0 : state));
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
                  viewBox={getQuadrantViewBox(zoomedQuadrant)}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <radialGradient id="grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#f0f0f0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.2" />
                    </radialGradient>

                    <mask id="extreme-mask">
                      <rect x="-800" y="-450" width="1600" height="900" fill="black" />
                      <rect x="400" y="-450" width="400" height="225" fill="white" />
                      <rect x="-800" y="-450" width="400" height="225" fill="white" />
                      <rect x="400" y="225" width="400" height="225" fill="white" />
                      <rect x="-800" y="225" width="400" height="225" fill="white" />
                    </mask>

                    <mask id="center-mask">
                      <rect x="-800" y="-450" width="1600" height="900" fill="black" />
                      <rect x="-200" y="-112.5" width="400" height="225" fill="white" />
                    </mask>
                  </defs>

                  <rect x="-800" y="-450" width="1600" height="900" fill="url(#grid-gradient)" />

                  {(highlightState === 1 || highlightState === 3) && (
                    <rect x="-800" y="-450" width="1600" height="900" fill="rgba(0,255,0,0.2)" mask="url(#extreme-mask)" />
                  )}
                  {(highlightState === 2 || highlightState === 3) && (
                    <rect x="-800" y="-450" width="1600" height="900" fill="rgba(255,0,0,0.2)" mask="url(#center-mask)" />
                  )}
                  {highlightSpecialState === 1 && (
                    <>
                      <rect x="0" y="-450" width="800" height="450" fill="rgba(0,255,0,0.2)" />
                      <rect x="0" y="0" width="800" height="450" fill="rgba(0,255,0,0.2)" />
                    </>
                  )}
                  {highlightSpecialState === 2 && (
                    <>
                      <rect x="-800" y="-450" width="800" height="450" fill="rgba(255,0,0,0.2)" />
                      <rect x="-800" y="0" width="800" height="450" fill="rgba(255,0,0,0.2)" />
                    </>
                  )}
                  {highlightSpecialState === 3 && (
                    <>
                      <rect x="-800" y="0" width="1600" height="450" fill="rgba(0,0,255,0.2)" />
                    </>
                  )}
                  {highlightSpecialState === 4 && (
                    <>
                      <rect x="-800" y="-450" width="1600" height="450" fill="rgba(0,0,255,0.2)" />
                    </>
                  )}


                  {[-7.5, -5, -2.5, 0, 2.5, 5, 7.5].map(v => (
                    <React.Fragment key={v}>
                      <line x1={v * 80} y1="-450" x2={v * 80} y2="450" stroke="#d0d0d0" strokeWidth="1" />
                      <line x1="-800" y1={v * -45} x2="800" y2={v * -45} stroke="#d0d0d0" strokeWidth="1" />
                    </React.Fragment>
                  ))}

                  <line x1="-800" y1="0" x2="800" y2="0" stroke="black" strokeWidth="4" />
                  <line x1="0" y1="-450" x2="0" y2="450" stroke="black" strokeWidth="4" />

                  <polygon points="800,0 770,-10 770,10" fill="black" />
                  <polygon points="-800,0 -770,-10 -770,10" fill="black" />
                  <polygon points="0,-450 -10,-420 10,-420" fill="black" />
                  <polygon points="0,450 -10,420 10,420" fill="black" />

                  <text x="780" y="30" fontSize="20" fontWeight="bold" textAnchor="end" fill="#333">השפעה גבוהה</text>
                  <text x="-780" y="30" fontSize="20" fontWeight="bold" textAnchor="start" fill="#333">השפעה גבוהה</text>
                  <text x="20" y="-420" fontSize="20" fontWeight="bold" textAnchor="start" fill="#333">חשיבות גבוהה</text>
                  <text x="20" y="440" fontSize="20" fontWeight="bold" textAnchor="start" fill="#333">חשיבות גבוהה</text>

                  <text x="5" y="25" fontSize="25" fontWeight="bold" fill="#333">0</text>

                  <g onClick={() => handleQuadrantClick('Strengths')}>
                    <rect x="0" y="-450" width="800" height="450" fill="transparent" />
                    <rect x="618" y="-448" width="180" height="40" fill="transparent" stroke="Blue" strokeWidth="2" />
                    <text x="710" y="-428" fontSize="20" fontWeight="bold" fill="Blue" textAnchor="middle" dominantBaseline="central">חוזקות-S</text>
                  </g>
                  <g onClick={() => handleQuadrantClick('Weaknesses')}>
                    <rect x="-800" y="-450" width="800" height="450" fill="transparent" />
                    <rect x="-798" y="-448" width="180" height="40" fill="transparent" stroke="Red" strokeWidth="2" />
                    <text x="-710" y="-428" fontSize="20" fontWeight="bold" fill="Red" textAnchor="middle" dominantBaseline="central">חולשות-W</text>
                  </g>
                  <g onClick={() => handleQuadrantClick('Opportunities')}>
                    <rect x="0" y="0" width="800" height="450" fill="transparent" />
                    <rect x="618" y="408" width="180" height="40" fill="transparent" stroke="Green" strokeWidth="2" />
                    <text x="710" y="428" fontSize="20" fontWeight="bold" fill="Green" textAnchor="middle" dominantBaseline="central">הזדמנויות-O</text>
                  </g>
                  <g onClick={() => handleQuadrantClick('Threats')}>
                    <rect x="-800" y="0" width="800" height="450" fill="transparent" />
                    <rect x="-798" y="408" width="180" height="40" fill="transparent" stroke="#990000" strokeWidth="2" />
                    <text x="-710" y="428" fontSize="20" fontWeight="bold" fill="#990000" textAnchor="middle" dominantBaseline="central">איומים-T</text>
                  </g>
                  {filteredData.map((item) => {
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
                      onClick={() => handleSpecialHighlightClick(2)}
                      sx={{ 
                        backgroundColor: 'red', 
                        color: 'white', 
                        '&:hover': {
                          backgroundColor: 'darkred'
                        }
                      }}
                    >
                      מעכבי צמיחה
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={() => handleSpecialHighlightClick(1)}
                      sx={{ 
                        backgroundColor: 'green', 
                        color: 'white', 
                        '&:hover': {
                          backgroundColor: 'darkgreen'
                        }
                      }}
                    >
                      מנועי צמיחה
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={() => handleSpecialHighlightClick(3)}
                      sx={{ 
                        backgroundColor: 'mediumpurple', 
                        color: 'white', 
                        '&:hover': {
                          backgroundColor: 'rebeccapurple'
                        }
                      }}
                    >
                      סביבה חיצונית
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={() => handleSpecialHighlightClick(4)}
                      sx={{ 
                        backgroundColor: 'purple', 
                        color: 'white', 
                        '&:hover': {
                          backgroundColor: 'indigo'
                        }
                      }}
                    >
                      סביבה פנימית
                    </Button>
                  </Grid>
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
                <Typography align="left" gutterBottom>השפעה: {filters.impact}</Typography>
                <Slider
                  value={filters.impact}
                  onChange={(_, value) => handleFilterChange('impact', value)}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
                <Typography align="left" gutterBottom>חשיבות: {filters.importance}</Typography>
                <Slider
                  value={filters.importance}
                  onChange={(_, value) => handleFilterChange('importance', value)}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
                <Typography align="left" gutterBottom>מורכבות: {filters.complexity}</Typography>
                <Slider
                  value={filters.complexity}
                  onChange={(_, value) => handleFilterChange('complexity', value)}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'flex-end',
                  gap: 1
                }}>
                  {Object.keys(colors).map(dept => (
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
                      label={dept}
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
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ImpactImportanceDiagram;