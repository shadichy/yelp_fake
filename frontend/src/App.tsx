
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './app/store';
import { clearToken } from './features/auth/authSlice';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TherapistProfile from './pages/TherapistProfile';
import Availability from './pages/Availability';
import Appointments from './pages/Appointments';
import Messaging from './pages/Messaging';
import ProtectedRoute from './components/ProtectedRoute';
import React, { useState, useMemo } from 'react';

const ColorModeContext = React.createContext({
  toggleColorMode: () => { },
});

const Home = () => (
  <Container>
    <Typography variant="h2" component="h1" gutterBottom>
      Welcome to Yelp
    </Typography>
    <Typography variant="h5" component="h2" gutterBottom>
      Find the right therapist for you.
    </Typography>
  </Container>
);

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const root = document.getElementById('root')!;
          if (prevMode === 'light') {
            root.style.backgroundColor = '#121212';
            root.style.color = 'rgba(255, 255, 255, 0.87)';
          } else {
            root.style.backgroundColor = '#ffffff';
            root.style.color = 'rgba(0, 0, 0, 0.87)';
          }
          return (prevMode === 'light' ? 'dark' : 'light');
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                Yelp
              </Typography>
              <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              {isAuthenticated ? (
                <>
                  <Button color="inherit" component={Link} to="/profile">Profile</Button>
                  <Button color="inherit" component={Link} to="/search">Search</Button>
                  <Button color="inherit" component={Link} to="/appointments">Appointments</Button>
                  <Button color="inherit" component={Link} to="/messaging">Messages</Button>
                  {user?.user_type === 'THERAPIST' && (
                    <Button color="inherit" component={Link} to="/availability">Availability</Button>
                  )}
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">Login</Button>
                  <Button color="inherit" component={Link} to="/register">Register</Button>
                </>
              )}
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/therapist/:id" element={<ProtectedRoute><TherapistProfile /></ProtectedRoute>} />
              <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
