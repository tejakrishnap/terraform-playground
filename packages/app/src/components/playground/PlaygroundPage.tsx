import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import { LeftSidebar } from './LeftSidebar';
import { Canvas } from './Canvas';
import { RightSidebar } from './RightSidebar';
import { Box, Button, Container, Divider, Drawer } from '@material-ui/core';
import { CopyToClipboardButton } from './CopyToClipboard';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#1E1E1E',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#1E1E1E',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderLeft: '1px solid #ffc107',
    borderRight: '1px solid #ffc107',
  },
}));

export const PlaygroundPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [playgroundData, setPlaygroundData] = useState({
    webhook: '',
    backend: '',
    accessKey: '',
  });
  const [playgroundName, setPlaygroundName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    setPlaygroundName(name);

    if (name) {
      const storedPlayground = JSON.parse(
        localStorage.getItem(`playground-${name}`),
      );
      if (storedPlayground) {
        setItems(storedPlayground.items);
        setPlaygroundData({
          webhook: storedPlayground.webhook,
          backend: storedPlayground.backend,
          accessKey: storedPlayground.accessKey,
        });
      }
    }
  }, [location]);

  const handleSave = () => {
    if (playgroundName) {
      localStorage.setItem(
        `playground-${playgroundName}`,
        JSON.stringify({
          ...playgroundData,
          items,
        }),
      );
      alert('Playground saved successfully');
    }
  };

  const toggleDrawer = () => {
    () => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
    };

    setDrawerOpen(prev => !prev);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={classes.root}>
          <div className={classes.sidebar}>
            <LeftSidebar />
          </div>
          <div className={classes.canvas}>
            <h2
              style={{ marginLeft: '8px', textAlign: 'center', color: '#fff' }}
            >
              {playgroundName}
            </h2>
            <Divider style={{ backgroundColor: '#ffc107' }} />
            <Canvas items={items} setItems={setItems} />
          </div>
          <div className={classes.sidebar}>
            <RightSidebar />
          </div>
          <Box position="fixed" bottom={72} right={16}>
            <Button color="secondary" onClick={toggleDrawer}>
              Playground data
            </Button>
          </Box>
          <Box position="fixed" bottom={16} right={16}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Playground
            </Button>
          </Box>
        </div>
      </DndProvider>

      <Drawer anchor={'bottom'} open={drawerOpen} onClose={toggleDrawer}>
        <Container style={{maxWidth: '800px', padding: '10px 0 10px 0'}}>
          <CopyToClipboardButton label="Webhook" textToCopy={playgroundData.webhook} />
          <CopyToClipboardButton label="Backend" textToCopy={playgroundData.backend} />
          <CopyToClipboardButton label="Access Key" textToCopy={playgroundData.accessKey} />
        </Container>
      </Drawer>
    </>
  );
};
