import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Fade,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  ListItemButton
} from '@mui/material';
import {
  Restaurant as DietIcon,
  DirectionsRun as ExerciseIcon,
  LocalHospital as MedicationIcon,
  Spa as LifestyleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const accentColor = '#a259f7'; // Soft purple accent

// Helper to map health score/stage to clinical stage
const getClinicalStage = (ckd_stage, health_score) => {
  if (ckd_stage === 'Normal' || health_score >= 90) return 'Early CKD (Onset)';
  if (ckd_stage === 'Stage 1' || ckd_stage === 'Stage 2' || (health_score >= 60 && health_score < 90)) return 'Established CKD';
  if (ckd_stage === 'Stage 3' || (health_score >= 30 && health_score < 60)) return 'Dialysis';
  if (ckd_stage === 'Stage 4' || (health_score >= 15 && health_score < 30)) return 'Pre-transplant';
  if (ckd_stage === 'Stage 5' || health_score < 15) return 'Post-transplant';
  return 'Unknown';
};

const getIconForRecommendation = (rec) => {
  if (/diet|food|nutrition/i.test(rec)) return <DietIcon sx={{ color: accentColor }} />;
  if (/exercise|activity|walk|move/i.test(rec)) return <ExerciseIcon sx={{ color: '#4caf50' }} />;
  if (/doctor|check|visit|medical|consult/i.test(rec)) return <MedicationIcon sx={{ color: '#1976d2' }} />;
  if (/heart|blood|pressure|sugar/i.test(rec)) return <LifestyleIcon sx={{ color: '#e57373' }} />;
  return <CheckIcon sx={{ color: accentColor }} />;
};

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
      setLoading(false);
    } else {
      const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
      if (history.length > 0) {
        setResult(history[0]);
      }
      setLoading(false);
    }
  }, [location]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
          No recommendations available. Please submit your biomarkers first.
        </Alert>
      </Container>
    );
  }

  const { recommendations, ckd_stage, health_score, gfr, stage_description } = result;
  const clinicalStage = getClinicalStage(ckd_stage, health_score);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      default:
        return '#1976d2';
    }
  };

  const getGfrStatus = (gfr) => {
    if (gfr >= 90) return { label: 'Normal', color: 'success' };
    if (gfr >= 60) return { label: 'Mild', color: 'warning' };
    if (gfr >= 45) return { label: 'Moderate', color: 'warning' };
    if (gfr >= 30) return { label: 'Severe', color: 'error' };
    return { label: 'Critical', color: 'error' };
  };

  const gfrStatus = getGfrStatus(gfr);

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: theme.shadows[4],
              background: theme.palette.background.gradient,
              color: theme.palette.text.primary,
              borderLeft: `8px solid ${theme.palette.primary.main}`,
              mb: 4
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
              <TrendingUpIcon sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Your Health Assessment
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  height: '100%',
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 4,
                  boxShadow: theme.shadows[2],
                  p: 2
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: theme.palette.primary.main }}>
                      Health Score
                    </Typography>
                    <Chip
                      label={`${health_score}%`}
                      color={health_score >= 60 ? 'success' : health_score >= 40 ? 'warning' : 'error'}
                      sx={{ fontSize: 20, p: 2, mb: 2, borderRadius: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      (0 = worst, 100 = best)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  height: '100%',
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 4,
                  boxShadow: theme.shadows[2],
                  p: 2
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: theme.palette.primary.main }}>
                      CKD Stage
                    </Typography>
                    <Chip
                      label={ckd_stage}
                      color={health_score >= 60 ? 'success' : health_score >= 40 ? 'warning' : 'error'}
                      sx={{ fontSize: 20, p: 2, mb: 2, borderRadius: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {clinicalStage}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 800,
                mb: 3
              }}
            >
              <TrendingUpIcon sx={{ mr: 1, fontSize: 28, color: theme.palette.primary.main }} />
              Personalized Recommendations
            </Typography>
            {recommendations && typeof recommendations === 'object' && !Array.isArray(recommendations) ? (
              Object.entries(recommendations).map(([category, items], index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: theme.shadows[1] }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category === 'diet' && <DietIcon sx={{ mr: 2, color: theme.palette.primary.main }} />}
                      {category === 'exercise' && <ExerciseIcon sx={{ mr: 2, color: theme.palette.success.main }} />}
                      {category === 'medication' && <MedicationIcon sx={{ mr: 2, color: theme.palette.info.main }} />}
                      {category === 'lifestyle' && <LifestyleIcon sx={{ mr: 2, color: theme.palette.error.main }} />}
                      <Typography sx={{ fontWeight: 700, fontSize: 18, color: theme.palette.primary.main }}>{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: theme.palette.background.paper, borderRadius: 3 }}>
                    <List>
                      {items.map((rec, idx) => (
                        <ListItemButton
                          key={idx}
                          sx={{
                            borderRadius: 3,
                            mb: 1,
                            boxShadow: theme.shadows[1],
                            background: theme.palette.action.hover,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              background: theme.palette.action.selected,
                              boxShadow: theme.shadows[2],
                              transform: 'translateY(-2px) scale(1.01)',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getIconForRecommendation(rec)}
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ fontSize: 18, fontWeight: 500 }}>{rec}</Typography>}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : Array.isArray(recommendations) && recommendations.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 700, letterSpacing: 1 }}>
                  Recommendations
                </Typography>
                <List>
                  {recommendations.map((rec, idx) => (
                    <ListItemButton
                      key={idx}
                      sx={{
                        borderRadius: 3,
                        mb: 1,
                        boxShadow: theme.shadows[1],
                        background: theme.palette.action.hover,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          background: theme.palette.action.selected,
                          boxShadow: theme.shadows[2],
                          transform: 'translateY(-2px) scale(1.01)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getIconForRecommendation(rec)}
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ fontSize: 18, fontWeight: 500 }}>{rec}</Typography>}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body1">No recommendations available.</Typography>
            )}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 20,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: theme.shadows[4],
                    transform: 'scale(1.03)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Paper>
        </Fade>

        <Fade in={true} timeout={1500}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              mt: 4
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: '#1976d2',
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Important Notes
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Always consult with your healthcare provider before making any changes to your treatment plan."
                  primaryTypographyProps={{ color: 'warning.main' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="These recommendations are based on your current biomarkers and should be reviewed regularly."
                  primaryTypographyProps={{ color: 'warning.main' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Keep track of your progress and report any significant changes to your doctor."
                  primaryTypographyProps={{ color: 'warning.main' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default Recommendations; 