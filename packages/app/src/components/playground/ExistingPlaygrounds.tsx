import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, List, ListItemIcon } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const ExistingPlayground = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const navigate = useNavigate();
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await axios.get(
          `${backendBaseUrl}/api/terraform-backend-api/get-playgrounds`,
        );
        setPlaygrounds(response.data);
      } catch (error) {
        console.error('Error fetching playgrounds:', error);
      }
    };

    fetchPlaygrounds();
  }, [backendBaseUrl]);

  const handleLoadPlayground = playground => {
    navigate(`/playground?name=${playground.name}`);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <h1 style={{ marginLeft: 16, color: 'black'}}>Existing Playgrounds</h1>
      <Divider />
      {playgrounds.map(playground => (
        <List
          component="nav"
          aria-label="Existing Items List"
          key={playground.name}
          style={{color: 'black'}}
        >
          <ListItemButton onClick={() => handleLoadPlayground(playground)}>
            <ListItemIcon>
              <PlayCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={playground.name}
              sx={{ textTransform: 'capitalize' }}
            />
          </ListItemButton>
        </List>
      ))}
    </Box>
  );
};

export default ExistingPlayground;
