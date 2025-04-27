import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/CheckCircle';

const getClinicalStage = (ckd_stage, health_score) => {
  if (ckd_stage === 'Normal' || health_score >= 90) return 'Early CKD (Onset)';
  if (ckd_stage === 'Stage 1' || ckd_stage === 'Stage 2' || (health_score >= 60 && health_score < 90)) return 'Established CKD';
  if (ckd_stage === 'Stage 3' || (health_score >= 30 && health_score < 60)) return 'Dialysis';
  if (ckd_stage === 'Stage 4' || (health_score >= 15 && health_score < 30)) return 'Pre-transplant';
  if (ckd_stage === 'Stage 5' || health_score < 15) return 'Post-transplant';
  return 'Unknown';
};

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

const HistoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch the record by id from localStorage
  const allHistory = JSON.parse(localStorage.getItem('healthHistory') || '[]');
  const record = allHistory.find(h => String(h.id) === String(id) || String(h.date) === String(id));

  if (!record) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No details available for this record. Please select a valid record from your history.
        </Typography>
      </Container>
    );
  }

  const { health_score, ckd_stage, gfr, recommendations, date } = record;
  const clinicalStage = getClinicalStage(ckd_stage, health_score);

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2
            }}
          >
            Health Record Details
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Date: {new Date(date).toLocaleString()}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
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
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Health Score
                </Typography>
                <Chip
                  label={`${health_score}%`}
                  color={getScoreColor(health_score)}
                  sx={{ fontSize: 24, p: 2, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  (0 = worst, 100 = best)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
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
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Typography variant="h6" gutterBottom>
                  CKD Stage
                </Typography>
                <Chip
                  label={ckd_stage}
                  color={getStageColor(ckd_stage)}
                  sx={{ fontSize: 20, p: 2, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {clinicalStage}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
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
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  GFR (if available)
                </Typography>
                <Chip
                  label={gfr ? gfr.toFixed(1) : '-'}
                  color={getGfrColor(gfr)}
                  sx={{ fontSize: 20, p: 2, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Glomerular Filtration Rate
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
              Recommendations
            </Typography>
            {recommendations && typeof recommendations === 'object' && !Array.isArray(recommendations) ? (
              Object.entries(recommendations).map(([section, recs], idx) => (
                <Box key={section} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Typography>
                  <List>
                    {recs.map((rec, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))
            ) : Array.isArray(recommendations) && recommendations.length > 0 ? (
              <List>
                {recommendations.map((rec, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No recommendations available.</Typography>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/history')}
            >
              Back to History
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HistoryDetails; 