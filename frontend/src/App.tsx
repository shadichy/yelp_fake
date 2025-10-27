
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { clearToken } from './features/auth/authSlice';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TherapistProfile from './pages/TherapistProfile';

const Home = () => (
  <Container>
    <Typography variant="h2" component="h1" gutterBottom>
      Welcome to Yelp for Therapists
    </Typography>
    <Typography variant="h5" component="h2" gutterBottom>
      Find the right therapist for you.
    </Typography>
  </Container>
);

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            Yelp for Therapists
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" component={Link} to="/search">Search</Button>
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/therapist/:id" element={<TherapistProfile />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
