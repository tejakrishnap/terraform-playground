import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import { LeftSidebar } from './LeftSidebar';
import { Canvas } from './Canvas';
import {
  Box,
} from '@material-ui/core';
import axios from 'axios';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { theme } from '../Root/Root';
import { RoundedButton } from './CreatePlayground';
import ExtensionIcon from '@mui/icons-material/Extension';
import Stepper from './Stepper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
  },
  sidebar: {
    width: 300,
    backgroundColor: theme.palette.primary.main,
  },
  canvas: {
    flex: 1,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const PlaygroundPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');
  const [items, setItems] = useState([]);
  const [playgroundData, setPlaygroundData] = useState({
    webhook: '',
    backend: '',
    accessKey: '',
  });
  const [playgroundName, setPlaygroundName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const steps = ['1. Generate', '2. Plan', '3. Push to Gitlab'];

  const clickHandlers = [
    async () => {
      // await axios.get('/api/generate');
      alert('Generate step completed');
    },
    async () => {
      // await axios.get('/api/plan');
      alert('Plan step completed');
    },
    async () => {
      // await axios.get('/api/push-to-gitlab');
      alert('Push to Gitlab step completed');
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    setPlaygroundName(name as string);

    if (name) {
      axios
        .get(
          `${backendBaseUrl}/api/terraform-backend-api/get-playground-data`,
          {
            params: { name },
          },
        )
        .then(response => {
          const { items, webhook, backend, accessKey } = response.data;
          setItems(items);
          setPlaygroundData({ webhook, backend, accessKey });
        })
        .catch(error => {
          console.error('Error fetching playground data:', error);
        });
    }
  }, [location, backendBaseUrl]);

  const handleSave = async () => {
    if (playgroundName) {
      try {
        await axios.post(
          `${backendBaseUrl}/api/terraform-backend-api/save-playground`,
          {
            name: playgroundName,
            items,
            webhook: playgroundData.webhook,
            backend: playgroundData.backend,
            accessKey: playgroundData.accessKey,
          },
        );
        alert('Playground saved successfully');
      } catch (error) {
        console.error('Error saving playground:', error);
        alert('Failed to save playground');
      }
    }
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={classes.root}>
          <div className={classes.sidebar}>
            <LeftSidebar />
          </div>
          <div className={classes.canvas}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
                gap: 4,
              }}
            >
              <ExtensionIcon
                sx={{ color: theme.palette.greentheme.green, fontSize: 20 }}
              />
              <Box
                sx={{
                  color: theme.palette.greentheme.green,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {playgroundName} playground
              </Box>
            </Box>
            <Canvas items={items} setItems={setItems} />
          </div>
          <Box zIndex={2} position={'absolute'} bottom={10} left={'48%'}><Stepper steps={steps} clickHandlers={clickHandlers} /></Box>
          <Box position="fixed" bottom={16} right={16} zIndex={2}>
            <RoundedButton
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{
                backgroundColor: `${theme.palette.greentheme.yellow}`,
                color: `${theme.palette.greentheme.green}`,
              }}
            >
              Save Playground
            </RoundedButton>
          </Box>
        </div>
      </DndProvider>
    </>
  );
};
