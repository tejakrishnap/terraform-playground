import React from 'react';
import { Box, Divider, Paper } from '@material-ui/core';
import { ReactSVG } from 'react-svg';
import { useDrag } from 'react-dnd';
import { theme } from '../Root/Root';

const ItemType = {
  TOOL: 'tool',
};

interface ToolItemProps {
  id: string;
  name: string;
  svgSrc: string;
}

const ToolItem: React.FC<ToolItemProps> = ({ id, name, svgSrc }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TOOL,
    item: { id, name },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      style={{
        width: 'fit-content',
        color: theme.palette.greentheme.offwhite,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 12,
        fontWeight: 700,
        alignItems: 'center',
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
      }}
      ref={drag}
    >
      <ReactSVG src={svgSrc} style={{ width: '48px', height: '48px' }} />
      {name}
    </div>
  );
};

const ResourcePalette = ({ resources }) => {
  return (
    <Paper
      elevation={3}
      style={{
        marginLeft: '10px',
        backgroundColor: theme.palette.greentheme.green,
        borderRadius: 8,
        height: '100vh',
      }}
    >
      <h2
        style={{
          paddingTop: '8px',
          marginLeft: '8px',
          textAlign: 'center',
          color: theme.palette.greentheme.offwhite,
        }}
      >
        Toolbar
      </h2>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gridGap: '8px',
          flexWrap: 'wrap',
          mt: '8px',
          mx: '10px',
        }}
      >
        {resources.map(resource => (
          <ToolItem
            key={resource.id}
            id={resource.id}
            name={resource.name}
            svgSrc={resource.svgSrc}
          />
        ))}
      </Box>
    </Paper>
  );
};

export const LeftSidebar = () => {
  const resources = [
    { id: '1', name: 'ECS', svgSrc: 'icons/Ecs.svg' },
    { id: '2', name: 'Lambda', svgSrc: 'icons/Lambda.svg' },
    { id: '3', name: 'RDS', svgSrc: 'icons/Rds.svg' },
    { id: '4', name: 'Redshift', svgSrc: 'icons/Redshift.svg' },
  ];

  return (
    <>
      {/* <Divider style={{ backgroundColor: theme.palette.orangePeel.main }} /> */}
      <ResourcePalette resources={resources} />
    </>
  );
};

export default LeftSidebar;
