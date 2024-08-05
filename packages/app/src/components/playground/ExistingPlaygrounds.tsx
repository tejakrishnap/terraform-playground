import { Box, Divider, List, ListItemIcon } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const ExistingPlayground = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaygrounds = () => {
      const keys = Object.keys(localStorage);
      const savedPlaygrounds = keys
        .filter(key => key.startsWith('playground-'))
        .map(key => {
          const playground = JSON.parse(localStorage.getItem(key));
          return {
            ...playground,
            name: key.replace('playground-', ''),
          };
        });
      setPlaygrounds(savedPlaygrounds);
    };

    fetchPlaygrounds();
  }, []);

  const handleLoadPlayground = playground => {
    localStorage.setItem('playground', JSON.stringify(playground));
    navigate(`/playground?name=${playground.name}`);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <h1 style={{ marginLeft: 16 }}>Existing Playgrounds</h1>
      <Divider />
      {playgrounds.map(playground => (
        <List
          component="nav"
          aria-label="Exisiting Items List"
          key={playground.name}
        >
          <ListItemButton onClick={() => handleLoadPlayground(playground)}>
            <ListItemIcon>
              <PlayCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={playground.name} sx={{textTransform: 'capitalize'}}/>
          </ListItemButton>
        </List>
      ))}
    </Box>
  );
};

export default ExistingPlayground;
