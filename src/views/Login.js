import { React, useRef, useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../service/auth';
import { useNavigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { setAuth } = useAuth();
    const theme = createTheme({
      palette: {
        mode: 'dark',
      }
    });
    const userRef = useRef()
    const errRef = useRef()
    let navigate = useNavigate()
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    console.log(from)

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    
    useEffect(() => {
        setErrMsg('')
    }, [user, password])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { status, role, token } = await login(user, password)
        console.log(status)
        if(status) {
          setAuth({ user, password, role, token })
          if(role == "admin") {
            navigate('/')
          } else if (role == "reviewer") {
            navigate('/reviewer')
          } else if (role == "guest") {
            navigate('/guest')
          }
          //navigate(from, { replace: true });
        }

    }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In To Continue
          </Typography>
          <Typography component="h1" variant="h5" ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              ref={userRef}
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body1">
                  {"Don't have Account? Create One"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Login