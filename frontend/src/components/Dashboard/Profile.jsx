import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Paper, TextField, Button, Grid, CircularProgress, Alert, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Immediately redirect to login if no token
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  }

  const [profile, setProfile] = useState(null); // null means not loaded, {} means no profile
  const [form, setForm] = useState({ fullName: '', age: '', mobile: '', country: '', state: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5001/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && Object.keys(res.data).length > 0) {
          setProfile(res.data);
          setForm({
            fullName: res.data.fullName || '',
            age: res.data.age || '',
            mobile: res.data.mobile || '',
            country: res.data.country || '',
            state: res.data.state || '',
          });
        } else {
          setProfile({}); // No profile yet
        }
      } catch (err) {
        setError('Failed to load profile.');
        setProfile({});
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5001/api/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to save profile.');
    }
    setSaving(false);
  };

  // Show loading spinner
  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show form if no profile or editing
  if (!profile || Object.keys(profile).length === 0 || editing) {
    return (
      <Container>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 4,
              background: theme.palette.background.gradient,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[4],
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AccountCircleIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                {editing ? 'Edit Profile' : 'Create Profile'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
              {editing ? 'Update your personal information' : 'Enter your personal information'}
            </Typography>
            <Box component="form" autoComplete="off" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2, background: theme.palette.background.paper }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2, background: theme.palette.background.paper }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Age"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2, background: theme.palette.background.paper }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2, background: theme.palette.background.paper }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2, background: theme.palette.background.paper }}
                  />
                </Grid>
              </Grid>
              {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={saving}
                sx={{ mt: 4, borderRadius: 2, fontWeight: 700, fontSize: 18, boxShadow: theme.shadows[2] }}
                fullWidth
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Show profile card if profile exists
  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.background.gradient,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[4],
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
              Profile
            </Typography>
            <IconButton sx={{ ml: 2 }} onClick={() => setEditing(true)}>
              <EditIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile.fullName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile.mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Age</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile.age}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Country</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile.country}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">State</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile.state}</Typography>
            </Grid>
          </Grid>
          {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 