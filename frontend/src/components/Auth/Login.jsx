import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
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
  Brightness4,
  Brightness7,
  LockOpen
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { darkMode, toggleTheme } = useCustomTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              <LockOpen sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Sign in to access your CKD Patient Portal
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  borderRadius: 12,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    '&:hover fieldset': {
                      borderColor: '#a259f7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a259f7',
                      boxShadow: '0 0 0 2px #a259f733',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
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
                sx={{
                  borderRadius: 12,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    '&:hover fieldset': {
                      borderColor: '#a259f7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#a259f7',
                      boxShadow: '0 0 0 2px #a259f733',
                    },
                  },
                }}
              />
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<LockOpen />}
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
                  {loading ? <CircularProgress size={28} sx={{ color: '#fff' }} /> : 'Login'}
                </Button>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{ color: '#a259f7', fontWeight: 700 }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login; 