import React from 'react';
import { Box, Paper } from '@material-ui/core';
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

  const displayName = name.replace(/-/g, ' ');

  return (
    <div
      style={{
        color: theme.palette.greentheme.offwhite,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 12,
        fontWeight: 700,
        alignItems: 'center',
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        width: 60
      }}
      ref={drag}
    >
      <ReactSVG src={svgSrc} style={{ width: '48px', height: '48px' }} />
      <Box sx={{textOverflow: 'wrap', mt: 1, textAlign: 'center'}}>{displayName}</Box>
    </div>
  );
};

const ResourcePalette = ({ resources }: {resources: ToolItemProps[]}) => {
  return (
    <Paper
      elevation={3}
      style={{
        marginLeft: '10px',
        backgroundColor: theme.palette.greentheme.green,
        borderRadius: 8,
        height: '96vh',
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
        Modules
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
    { id: '1', name: 'ECS-Cluster', svgSrc: 'icons/ECS-Cluster.svg' },
    { id: '2', name: 'ECS-Service', svgSrc: 'icons/ECS-Service.svg' },
    { id: '3', name: 'ECS-Task-Definition', svgSrc: 'icons/ECS-Task-Definition.svg' },
    { id: '4', name: 'RDS', svgSrc: 'icons/RDS.svg' },
    { id: '5', name: 'Security-Group', svgSrc: 'icons/Security-Group.svg' },
    { id: '6', name: 'Application-Load-Balancer', svgSrc: 'icons/Application-Load-Balancer.svg' },
  ];

  return (
    <>
      {/* <Divider style={{ backgroundColor: theme.palette.orangePeel.main }} /> */}
      <ResourcePalette resources={resources} />
    </>
  );
};

export default LeftSidebar;
