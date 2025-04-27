import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Assessment as AssessmentIcon,
  Science as ScienceIcon,
  LocalHospital as HospitalIcon,
  Timeline as TimelineIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: 'Biomarker Analysis',
      description: 'Submit your medical test results for comprehensive kidney health assessment.',
      icon: <ScienceIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      action: () => navigate('/submit')
    },
    {
      title: 'Health Score',
      description: 'Get a detailed health score and CKD stage prediction based on your biomarkers.',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      action: () => navigate('/health-score')
    },
    {
      title: 'Personalized Recommendations',
      description: 'Receive tailored diet, exercise, and lifestyle recommendations for your condition.',
      icon: <HospitalIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      action: () => navigate('/recommendations')
    },
    {
      title: 'Health History',
      description: 'Track your health progress over time with detailed historical data.',
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      action: () => navigate('/history')
    }
  ];

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 4,
              background: theme.palette.background.gradient,
              color: theme.palette.text.primary,
              borderLeft: `8px solid ${theme.palette.primary.main}`,
              boxShadow: theme.shadows[4],
            }}
          >
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <Box sx={{ pr: { md: 4 } }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 800,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 36,
                      letterSpacing: 1,
                    }}
                  >
                    <FavoriteIcon sx={{ mr: 1, fontSize: 40, color: theme.palette.primary.main }} />
                    CKD Patient Portal
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    Your comprehensive kidney health management platform
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Welcome to the CKD Patient Portal, your dedicated platform for managing chronic kidney disease. 
                    Our advanced machine learning system analyzes your biomarkers to provide personalized insights 
                    and recommendations for better kidney health management.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/submit')}
                    startIcon={<FavoriteIcon />}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      borderRadius: 12,
                      background: 'linear-gradient(90deg, #a259f7 0%, #6a82fb 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 20,
                      boxShadow: '0 4px 24px 0 #a259f733',
                      transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #6a82fb 0%, #a259f7 100%)',
                        boxShadow: '0 8px 32px 0 #a259f744',
                        transform: 'scale(1.03)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Grid>
              <Grid xs={12} md={6}>
                <Box
                  component="img"
                  src="/Users/kukatla.teja/Downloads/renapert/frontend/src/kidney-health.jpg"
                  alt="Kidney Health"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 4px 16px rgba(162, 89, 247, 0.10)'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        <Box sx={{ mt: 6, mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 800,
              mb: 4,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Key Features
          </Typography>
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {/* Row 1 */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Fade in={true} timeout={1200}>
                <Card
                  sx={{
                    minWidth: 320,
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    boxShadow: theme.shadows[2],
                    background: theme.palette.background.paper,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: theme.shadows[4],
                      cursor: 'pointer',
                    },
                    p: 3,
                    m: 1,
                  }}
                  onClick={features[0].action}
                >
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{React.cloneElement(features[0].icon, { sx: { fontSize: 44, color: theme.palette.primary.main } })}</Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: 20, textAlign: 'center', mb: 1 }}>{features[0].title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 15 }}>{features[0].description}</Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Fade in={true} timeout={1400}>
                <Card
                  sx={{
                    minWidth: 320,
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    boxShadow: theme.shadows[2],
                    background: theme.palette.background.paper,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: theme.shadows[4],
                      cursor: 'pointer',
                    },
                    p: 3,
                    m: 1,
                  }}
                  onClick={features[1].action}
                >
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{React.cloneElement(features[1].icon, { sx: { fontSize: 44, color: theme.palette.primary.main } })}</Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: 20, textAlign: 'center', mb: 1 }}>{features[1].title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 15 }}>{features[1].description}</Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            {/* Row 2 */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Fade in={true} timeout={1600}>
                <Card
                  sx={{
                    minWidth: 320,
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    boxShadow: theme.shadows[2],
                    background: theme.palette.background.paper,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: theme.shadows[4],
                      cursor: 'pointer',
                    },
                    p: 3,
                    m: 1,
                  }}
                  onClick={features[2].action}
                >
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{React.cloneElement(features[2].icon, { sx: { fontSize: 44, color: theme.palette.primary.main } })}</Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: 20, textAlign: 'center', mb: 1 }}>{features[2].title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 15 }}>{features[2].description}</Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Fade in={true} timeout={1800}>
                <Card
                  sx={{
                    minWidth: 320,
                    minHeight: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    boxShadow: theme.shadows[2],
                    background: theme.palette.background.paper,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: theme.shadows[4],
                      cursor: 'pointer',
                    },
                    p: 3,
                    m: 1,
                  }}
                  onClick={features[3].action}
                >
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{React.cloneElement(features[3].icon, { sx: { fontSize: 44, color: theme.palette.primary.main } })}</Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: 20, textAlign: 'center', mb: 1 }}>{features[3].title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 15 }}>{features[3].description}</Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 