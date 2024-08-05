import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import { LeftSidebar } from './LeftSidebar';
import { Canvas } from './Canvas';
import { RightSidebar } from './RightSidebar';
import { Box, Button, Divider } from '@material-ui/core';

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
    borderLeft: '1px solid #43E8B0',
    borderRight: '1px solid #43E8B0',
  },
}));

export const PlaygroundPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [playgroundData, setPlaygroundData] = useState({ webhook: '', backend: '', accessKey: '' });
  const [playgroundName, setPlaygroundName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    setPlaygroundName(name);

    if (name) {
      const storedPlayground = JSON.parse(localStorage.getItem(`playground-${name}`));
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
      localStorage.setItem(`playground-${playgroundName}`, JSON.stringify({
        ...playgroundData,
        items,
      }));
      alert('Playground saved successfully');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.root}>
        <div className={classes.sidebar}><LeftSidebar /></div>
        <div className={classes.canvas}>
          <h2 style={{ marginLeft: '8px', textAlign: 'center', color: '#fff' }}>{playgroundName}</h2>
          <Divider style={{ backgroundColor: '#43E8B0' }} />
          <Canvas items={items} setItems={setItems} />
        </div>
        <div className={classes.sidebar}><RightSidebar /></div>
        <Box position="fixed" bottom={16} right={16}>
          <Button variant="contained" color="primary" onClick={handleSave}>Save Playground</Button>
        </Box>
      </div>
    </DndProvider>
  );
};
