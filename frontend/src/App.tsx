
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Messaging from './pages/Messaging';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'dark'
  },
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

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
              Yelp
            </Typography>
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
  );
}

export default App;
