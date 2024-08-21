import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  styled,
} from '@material-ui/core';
import axios from 'axios';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { theme } from '../Root/Root';

export const RoundedButton = styled(Button)(() => ({
  borderRadius: '50px',
  textTransform: 'capitalize',
  fontWeight: 700,
}));

export const CreatePlaygroundPage = () => {
  const [playgroundName, setPlaygroundName] = useState('');
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!playgroundName) {
      alert('Playground Name is required');
      return;
    }

    const newPlayground = {
      name: playgroundName,
      items: []
    };

    try {
      await axios.post(
        `${backendBaseUrl}/api/terraform-backend-api/create-playground`,
        newPlayground,
      );
      navigate(`/playground?name=${encodeURIComponent(playgroundName)}`);
    } catch (error) {
      console.error('Error creating playground:', error);
      alert('Failed to create playground');
    }
  };

  const handleExistingPlaygrounds = () => {
    navigate('/existing-playgrounds');
  };

  return (
    <Container
      style={{
        paddingTop: 24,
        height: '100vh',
        backgroundColor: 'greentheme.offwhite',
      }}
    >
      <Box
        display={'flex'}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box
          width={600}
          height={'auto'}
          bgcolor={'greentheme.green'}
          padding={8}
          paddingBottom={8}
          borderRadius={16}
          color={'#F5F3ED'}
          sx={{ input: { color: '#F5F3ED' } }}
        >
          <Typography
            variant="h4"
            style={{ fontWeight: 800, textAlign: 'center', marginTop: 0 }}
            gutterBottom
          >
            Create a New Playground
          </Typography>
          <TextField
            label="Enter Playground Name"
            value={playgroundName}
            onChange={e => setPlaygroundName(e.target.value)}
            fullWidth
            margin="normal"
            color="primary"
            InputLabelProps={{ className: 'textfield__label' }}
          />
          <RoundedButton
            variant="contained"
            color="primary"
            onClick={handleCreate}
            style={{ marginTop: 48 }}
          >
            Create Playground
          </RoundedButton>
          <RoundedButton
            variant="contained"
            onClick={handleExistingPlaygrounds}
            style={{
              marginTop: 48,
              marginLeft: 24,
              backgroundColor: `${theme.palette.orangePeel.main}`,
              color: `${theme.palette.primary.main}`,
              '&:hover': {
                backgroundColor: `${theme.palette.orangePeel.dark}`,
              },
            }}
          >
            Existing Playgrounds
          </RoundedButton>
        </Box>
      </Box>
    </Container>
  );
};
