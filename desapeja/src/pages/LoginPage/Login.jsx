import React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
function Login() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
      }}
    >
      <Box>
        <img
          src="../../assets/logo-projeto.png"
          alt="Logo"
          style={{ width: '200px', height: 'auto', marginTop: '20px' }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '50vw',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4">Login</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl sx={{ width: '50vh', mb: 2 }} variant="standard">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" aria-describedby="email-helper-text" />
            <FormHelperText id="email-helper-text">
              Escreva seu email acima.
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ width: '50vh' }} variant="standard">
            <InputLabel htmlFor="senha">Senha</InputLabel>
            <Input
              id="senha"
              aria-describedby="senha-helper-text"
              type="password"
            />
            <FormHelperText id="senha-helper-text">
              Escreva sua senha acima.
            </FormHelperText>
          </FormControl>

          <Button variant="contained">Enviar</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
