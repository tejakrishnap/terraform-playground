import React from 'react';
import { Box, Divider } from '@material-ui/core';
import { ReactSVG } from 'react-svg';
import { useDrag } from 'react-dnd';

const ItemType = {
  TOOL: 'tool',
};

interface ToolItemProps {
  id: string;
  name: string;
  svgSrc: string;
}

const ToolItem: React.FC<ToolItemProps>  = ({ id, name, svgSrc }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TOOL,
    item: { id, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div style={{width: "fit-content", color: 'whitesmoke', display: 'flex', flexDirection: 'column', alignItems: 'center',  opacity: isDragging ? 0.5 : 1, padding: '8px', margin: '4px'}} ref={drag}>
      <ReactSVG src={svgSrc} style={{width: "48px", height: "48px"}} />
      {name}
    </div>
  );
};

const ResourcePalette = ({ resources }) => {
  return (
    <Box sx={{ display: 'flex', gridGap: "8px", flexWrap: 'wrap', mt: "8px" }}>
      {resources.map((resource) => (
        <ToolItem key={resource.id} id={resource.id} name={resource.name} svgSrc={resource.svgSrc} />
      ))}
    </Box>
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
      <h2 style={{ marginLeft: '8px', textAlign: 'center', color: '#fff' }}>Toolbar</h2>
      <Divider style={{ backgroundColor: '#ffc107' }} />
        <ResourcePalette resources={resources} />
    </>
  );
};

export default LeftSidebar;
