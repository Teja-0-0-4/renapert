import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { format } from 'date-fns';

const History = () => {
  const [history, setHistory] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setHistory([]);
      return;
    }
    // Get all history
    const allHistory = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    // Filter history for this user (by email)
    const userHistory = allHistory.filter(h => h.userEmail === user.email);
    setHistory(userHistory);
  }, []);

  // Helper to get color for CKD stage
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

  // Helper to get color for health score
  const getScoreColor = (score) => {
    if (score >= 60) return 'success';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const handleViewDetails = (record) => {
    navigate(`/history-details/${record.id}`);
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
              <HistoryEduIcon sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Your Health History
            </Typography>
            {history.length === 0 ? (
              <Typography variant="body1" align="center" color="text.secondary">
                No history found. Submit your biomarkers to start tracking your health.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {history.map((record, index) => (
                  <Grid item xs={12} key={index}>
                    <Fade in={true} timeout={1000 + index * 200}>
                      <Card
                        sx={{
                          mb: 2,
                          borderRadius: 3,
                          boxShadow: theme.shadows[2],
                          background: theme.palette.background.paper,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4],
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => handleViewDetails(record)}
                      >
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                                {new Date(record.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(record.date).toLocaleTimeString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={`Health Score: ${record.health_score}%`}
                                  color={record.health_score >= 60 ? 'success' : record.health_score >= 40 ? 'warning' : 'error'}
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={`CKD Stage: ${record.ckd_stage}`}
                                  color={record.health_score >= 60 ? 'success' : record.health_score >= 40 ? 'warning' : 'error'}
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default History; 