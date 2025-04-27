import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Container,
  Alert,
  Chip,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  InputAdornment,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SendIcon from '@mui/icons-material/Send';

const SubmitBiomarkers = () => {
  const [formData, setFormData] = useState({
    age: '',
    bp: '',
    sg: '',
    al: '',
    su: '',
    bgr: '',
    bu: '',
    sc: '',
    sod: '',
    pot: '',
    hemo: '',
    pcv: '',
    wc: '',
    rc: '',
    rbc: 0,
    pc: 0,
    pcc: 0,
    ba: 0,
    htn: 0,
    dm: 0,
    cad: 0,
    appet: 0,
    pe: 0,
    ane: 0,
    gender: 0, // 0 for male, 1 for female
    race: 0    // 0 for non-black, 1 for black
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to submit biomarkers');
      }
      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not found. Please login again.');
      }
      // Convert empty strings to 0 and ensure numeric values
      const processedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? 0 : Number(value)
        ])
      );
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedData),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to get prediction');
      }
      const data = await response.json();
      setResult(data);
      // Store the result in localStorage with userEmail, preserving recommendations as-is
      const historyEntry = {
        date: new Date().toISOString(),
        health_score: data.health_score,
        ckd_stage: data.ckd_stage,
        gfr: data.gfr,
        recommendations: data.recommendations, // store as object or array as returned
        biomarkers: processedData,
        userEmail: user.email
      };
      const existingHistory = JSON.parse(localStorage.getItem('healthHistory') || '[]');
      localStorage.setItem('healthHistory', JSON.stringify([historyEntry, ...existingHistory]));
      // Debug log
      console.log('Saved history entry:', historyEntry);
      // Navigate to health score page with the result
      navigate('/health-score', { state: { result: data } });
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Session expired')) {
        // Redirect to login if session expired
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            boxShadow: theme.shadows[4],
            background: theme.palette.background.gradient,
            color: theme.palette.text.primary,
            maxWidth: 800,
            mx: 'auto',
            borderLeft: `8px solid ${theme.palette.primary.main}`,
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
            Submit Your Biomarkers
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Enter your latest biomarker values to assess your kidney health
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Fade in={true} timeout={1000}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Your Results
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={`Health Score: ${result.health_score}%`}
                    color={result.health_score >= 60 ? 'success' : result.health_score >= 40 ? 'warning' : 'error'}
                    sx={{ fontSize: '1.1rem', padding: '20px 10px' }}
                  />
                  <Chip
                    label={`CKD Stage: ${result.ckd_stage}`}
                    color={result.ckd_stage === 'Normal' ? 'success' : result.ckd_stage === 'Mild' ? 'warning' : 'error'}
                    sx={{ fontSize: '1.1rem', padding: '20px 10px' }}
                  />
                  <Chip
                    label={`GFR: ${result.gfr.toFixed(1)}`}
                    color={result.gfr >= 90 ? 'success' : result.gfr >= 60 ? 'warning' : 'error'}
                    sx={{ fontSize: '1.1rem', padding: '20px 10px' }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/recommendations', { state: { result } })}
                  sx={{ mt: 2 }}
                >
                  View Detailed Recommendations
                </Button>
              </Box>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <Fade in={true} timeout={800}>
              <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[1] }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', fontSize: 28 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 32, color: theme.palette.primary.main }} /> Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      required
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      variant="outlined"
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                      InputProps={{ 
                        endAdornment: <InputAdornment position="end">years</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        label="Gender" 
                        sx={{ 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MenuItem value={0}>Male</MenuItem>
                        <MenuItem value={1}>Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Race</InputLabel>
                      <Select 
                        name="race" 
                        value={formData.race} 
                        onChange={handleChange} 
                        label="Race" 
                        sx={{ 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MenuItem value={0}>Non-Black</MenuItem>
                        <MenuItem value={1}>Black</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
            <Fade in={true} timeout={1000}>
              <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[1] }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', fontSize: 28 }}>
                  <ScienceIcon sx={{ mr: 1, fontSize: 32, color: theme.palette.primary.main }} /> Biomarker Values
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Blood Pressure" 
                      name="bp" 
                      type="number" 
                      value={formData.bp} 
                      onChange={handleChange} 
                      helperText="Normal: 90-120 mmHg" 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Specific Gravity" 
                      name="sg" 
                      type="number" 
                      value={formData.sg} 
                      onChange={handleChange} 
                      helperText="Normal: 1.005-1.030" 
                      inputProps={{ min: 0, step: 0.001 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Albumin" 
                      name="al" 
                      type="number" 
                      value={formData.al} 
                      onChange={handleChange} 
                      helperText="Normal: 3.4-5.4 g/dL" 
                      inputProps={{ min: 0, step: 0.1 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Blood Glucose" 
                      name="bgr" 
                      type="number" 
                      value={formData.bgr} 
                      onChange={handleChange} 
                      helperText="Normal: 70-140 mg/dL" 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Blood Urea" 
                      name="bu" 
                      type="number" 
                      value={formData.bu} 
                      onChange={handleChange} 
                      helperText="Normal: 7-20 mg/dL" 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Serum Creatinine" 
                      name="sc" 
                      type="number" 
                      value={formData.sc} 
                      onChange={handleChange} 
                      helperText="Normal: 0.7-1.3 mg/dL" 
                      inputProps={{ min: 0, step: 0.1 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Sodium" 
                      name="sod" 
                      type="number" 
                      value={formData.sod} 
                      onChange={handleChange} 
                      helperText="Normal: 135-145 mEq/L" 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Potassium" 
                      name="pot" 
                      type="number" 
                      value={formData.pot} 
                      onChange={handleChange} 
                      helperText="Normal: 3.5-5.0 mEq/L" 
                      inputProps={{ min: 0, step: 0.1 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Hemoglobin" 
                      name="hemo" 
                      type="number" 
                      value={formData.hemo} 
                      onChange={handleChange} 
                      helperText="Normal: 12-17 g/dL" 
                      inputProps={{ min: 0, step: 0.1 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
            <Fade in={true} timeout={1200}>
              <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[1] }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', fontSize: 28 }}>
                  <AssessmentIcon sx={{ mr: 1, fontSize: 32, color: theme.palette.primary.main }} /> Additional Values
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Packed Cell Volume" 
                      name="pcv" 
                      type="number" 
                      value={formData.pcv} 
                      onChange={handleChange} 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="White Blood Cells" 
                      name="wc" 
                      type="number" 
                      value={formData.wc} 
                      onChange={handleChange} 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Red Blood Cells" 
                      name="rc" 
                      type="number" 
                      value={formData.rc} 
                      onChange={handleChange} 
                      inputProps={{ min: 0 }} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 12,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
            <Fade in={true} timeout={1400}>
              <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[1] }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', fontSize: 28 }}>
                  <MedicalServicesIcon sx={{ mr: 1, fontSize: 32, color: theme.palette.primary.main }} /> Medical Conditions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          size="small" 
                          checked={formData.htn === 1} 
                          onChange={handleChange} 
                          name="htn" 
                          sx={{ 
                            borderRadius: 12,
                            '& .MuiSwitch-thumb': { 
                              borderRadius: 8,
                              backgroundColor: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-track': { 
                              borderRadius: 12,
                              backgroundColor: theme.palette.divider,
                            },
                          }}
                        />
                      } 
                      label="Hypertension" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          size="small" 
                          checked={formData.dm === 1} 
                          onChange={handleChange} 
                          name="dm" 
                          sx={{ 
                            borderRadius: 12,
                            '& .MuiSwitch-thumb': { 
                              borderRadius: 8,
                              backgroundColor: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-track': { 
                              borderRadius: 12,
                              backgroundColor: theme.palette.divider,
                            },
                          }}
                        />
                      } 
                      label="Diabetes Mellitus" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          size="small" 
                          checked={formData.cad === 1} 
                          onChange={handleChange} 
                          name="cad" 
                          sx={{ 
                            borderRadius: 12,
                            '& .MuiSwitch-thumb': { 
                              borderRadius: 8,
                              backgroundColor: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-track': { 
                              borderRadius: 12,
                              backgroundColor: theme.palette.divider,
                            },
                          }}
                        />
                      } 
                      label="Coronary Artery Disease" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          size="small" 
                          checked={formData.pe === 1} 
                          onChange={handleChange} 
                          name="pe" 
                          sx={{ 
                            borderRadius: 12,
                            '& .MuiSwitch-thumb': { 
                              borderRadius: 8,
                              backgroundColor: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-track': { 
                              borderRadius: 12,
                              backgroundColor: theme.palette.divider,
                            },
                          }}
                        />
                      } 
                      label="Pedal Edema" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          size="small" 
                          checked={formData.ane === 1} 
                          onChange={handleChange} 
                          name="ane" 
                          sx={{ 
                            borderRadius: 12,
                            '& .MuiSwitch-thumb': { 
                              borderRadius: 8,
                              backgroundColor: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-track': { 
                              borderRadius: 12,
                              backgroundColor: theme.palette.divider,
                            },
                          }}
                        />
                      } 
                      label="Anemia" 
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  borderRadius: 12,
                  fontWeight: 'bold',
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
                {loading ? 'Submitting...' : 'Submit Biomarkers'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SubmitBiomarkers; 