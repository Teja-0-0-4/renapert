import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Restaurant as DietIcon,
  DirectionsRun as ExerciseIcon,
  LocalHospital as MedicationIcon,
  Spa as LifestyleIcon
} from '@mui/icons-material';

const ResultDashboard = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          No results available. Please submit biomarkers first.
        </Typography>
      </Container>
    );
  }

  const { health_score, ckd_stage, recommendations } = result;

  return (
    <Container>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Health Score Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Health Score
            </Typography>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                my: 2
              }}
            >
              <CircularProgress
                variant="determinate"
                value={health_score}
                size={120}
                thickness={4}
                sx={{
                  color: health_score > 70 ? 'success.main' :
                         health_score > 40 ? 'warning.main' :
                         'error.main'
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h4" component="div">
                  {health_score}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" color="text.secondary">
              {ckd_stage}
            </Typography>
          </Paper>
        </Grid>

        {/* Recommendations Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DietIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Diet"
                  secondary={recommendations.diet}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ExerciseIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Exercise"
                  secondary={recommendations.exercise}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <MedicationIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Medication"
                  secondary={recommendations.medication}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <LifestyleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Lifestyle"
                  secondary={recommendations.lifestyle}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResultDashboard; 