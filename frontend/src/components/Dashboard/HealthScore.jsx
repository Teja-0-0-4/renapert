import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Fade } from '@mui/material';

// Helper to map health score/stage to clinical stage
const getClinicalStage = (ckd_stage, health_score) => {
  // You can adjust these rules as needed
  if (ckd_stage === 'Normal' || health_score >= 90) return 'Early CKD (Onset)';
  if (ckd_stage === 'Stage 1' || ckd_stage === 'Stage 2' || (health_score >= 60 && health_score < 90)) return 'Established CKD';
  if (ckd_stage === 'Stage 3' || (health_score >= 30 && health_score < 60)) return 'Dialysis';
  if (ckd_stage === 'Stage 4' || (health_score >= 15 && health_score < 30)) return 'Pre-transplant';
  if (ckd_stage === 'Stage 5' || health_score < 15) return 'Post-transplant';
  return 'Unknown';
};

const HealthScore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const theme = useTheme();

  if (!result) {
    return (
      <Container>
        <Alert 
          severity="info" 
          sx={{ mt: 4, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/submit')}>
              Submit Biomarkers
            </Button>
          }
        >
          No results available. Please submit your biomarkers first.
        </Alert>
      </Container>
    );
  }

  const { health_score, ckd_stage, gfr, stage_description } = result;
  const clinicalStage = getClinicalStage(ckd_stage, health_score);

  const getScoreColor = (score) => {
    if (score >= 60) return 'success';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Normal':
        return 'success';
      case 'Mild':
        return 'warning';
      case 'Moderate':
        return 'warning';
      case 'Severe':
        return 'error';
      case 'Critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGfrColor = (gfr) => {
    if (gfr >= 90) return 'success';
    if (gfr >= 60) return 'warning';
    return 'error';
  };

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
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 800,
                textAlign: 'center',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                letterSpacing: 1,
              }}
            >
              <FavoriteIcon sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Your Health Assessment
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1200}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                      <ScienceIcon sx={{ mr: 1, fontSize: 24, color: theme.palette.primary.main }} /> Health Score
                    </Typography>
                    <Chip
                      label={`${health_score}%`}
                      color={getScoreColor(health_score)}
                      sx={{ fontSize: 24, p: 2, mb: 2, borderRadius: 2, fontWeight: 700 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      (0 = worst, 100 = best)
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1400}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                      <AssessmentIcon sx={{ mr: 1, fontSize: 24, color: theme.palette.primary.main }} /> CKD Stage
                    </Typography>
                    <Chip
                      label={ckd_stage}
                      color={getStageColor(ckd_stage)}
                      sx={{ fontSize: 20, p: 2, mb: 2, borderRadius: 2, fontWeight: 700 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {clinicalStage}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
              <Grid item xs={12} md={4}>
                <Fade in={true} timeout={1600}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                      <ScienceIcon sx={{ mr: 1, fontSize: 24, color: theme.palette.primary.main }} /> GFR (if available)
                    </Typography>
                    <Chip
                      label={gfr ? gfr.toFixed(1) : '-'}
                      color={getGfrColor(gfr)}
                      sx={{ fontSize: 20, p: 2, mb: 2, borderRadius: 2, fontWeight: 700 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Glomerular Filtration Rate
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/recommendations', { state: { result } })}
                startIcon={<AssessmentIcon />}
                sx={{
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 20,
                  background: 'linear-gradient(90deg, #a259f7 0%, #6a82fb 100%)',
                  color: '#fff',
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
                View Detailed Recommendations
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default HealthScore; 