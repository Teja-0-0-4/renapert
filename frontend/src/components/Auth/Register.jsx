import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Brightness4,
  Brightness7,
  LockOpen,
  CheckCircle,
  PersonAdd
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

const steps = ['Account Information', 'Personal Details'];

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleTheme } = useCustomTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Paper
            elevation={8}
            sx={{
              padding: 4,
              width: '100%',
              borderRadius: 4,
              background: theme.palette.background.gradient,
              borderLeft: `8px solid ${theme.palette.primary.main}`,
              boxShadow: theme.shadows[4],
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                fontSize: 32,
                letterSpacing: 1,
              }}
            >
              <PersonAdd sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Create Account
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Sign up to start managing your kidney health
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, borderRadius: 2, background: 'transparent', boxShadow: 'none' }}>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer', fontWeight: 700, fontSize: 18, color: activeStep === index ? theme.palette.primary.main : 'inherit' }}
                    StepIconComponent={activeStep > index ? CheckCircle : undefined}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}
            <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext} sx={{ mt: 1 }}>
              {getStepContent(activeStep)}
              {activeStep === 0 && (
                <Box sx={{ mt: 2 }}>
                  {formData.password && (
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Box sx={{ height: 8, borderRadius: 4, background: '#eee', overflow: 'hidden' }}>
                        <Box sx={{
                          width: `${Math.min(formData.password.length * 10, 100)}%`,
                          height: '100%',
                          background: formData.password.length > 8 ? 'linear-gradient(90deg, #4caf50, #a259f7)' : formData.password.length > 4 ? 'linear-gradient(90deg, #ff9800, #a259f7)' : '#f44336',
                          transition: 'width 0.3s',
                        }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: formData.password.length > 8 ? '#4caf50' : formData.password.length > 4 ? '#ff9800' : '#f44336', fontWeight: 700 }}>
                        {formData.password.length > 8 ? 'Strong' : formData.password.length > 4 ? 'Medium' : 'Weak'}
                      </Typography>
                    </Box>
                  )}
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <Typography variant="caption" color="error" sx={{ fontWeight: 700 }}>
                      Passwords do not match
                    </Typography>
                  )}
                </Box>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LockOpen />}
                sx={{
                  mt: 3,
                  mb: 2,
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
                {loading ? <CircularProgress size={28} sx={{ color: '#fff' }} /> : activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  fullWidth
                  variant="text"
                  sx={{ mt: 1, borderRadius: 8, fontWeight: 600, color: theme.palette.primary.main, fontSize: 16 }}
                >
                  Back
                </Button>
              )}
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Register; 