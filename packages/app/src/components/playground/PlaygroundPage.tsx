import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';
import { LeftSidebar } from './LeftSidebar';
import { Canvas } from './Canvas';
import { RightSidebar } from './RightSidebar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  sidebar: {
    width: 250,
    backgroundColor: theme.palette.background.paper,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
  },
}));

export const PlaygroundPage = () => {
  const classes = useStyles();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.root}>
        <div className={classes.sidebar}><LeftSidebar /></div>
        <div className={classes.canvas}><Canvas /></div>
        <div className={classes.sidebar}><RightSidebar /></div>
      </div>
    </DndProvider>
  );
};
