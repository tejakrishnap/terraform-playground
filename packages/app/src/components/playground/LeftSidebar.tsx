import { Box, Divider } from '@material-ui/core';

import React from 'react';
import { useDrag } from 'react-dnd';
import { ReactSVG } from 'react-svg';

const ItemType = {
  TOOL: 'tool',
};

const ToolItem = ({ name, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TOOL,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{width: "fit-content", opacity: isDragging ? 0.5 : 1, padding: '8px', margin: '4px'}}>
      {children}
    </div>
  );
};

export const LeftSidebar = () => {
  return (
    <>
    <h2 style={{marginLeft: "8px", textAlign: 'center'}}>Toolbar</h2>
    <Divider/>
    <Box sx={{ display: 'flex', gridGap: "8px", flexWrap: 'wrap', mt: "8px" }}>
      <ToolItem name="ECS">
        <ReactSVG src={`icons/Ecs.svg`} style={{width: "48px", height: "48px"}}/>
      </ToolItem>
      <ToolItem name="Lambda">
        <ReactSVG src={`icons/Lambda.svg`} style={{width: "48px", height: "48px"}}/>
      </ToolItem>
      <ToolItem name="RDS">
        <ReactSVG src={`icons/Rds.svg`} style={{width: "48px", height: "48px"}}/>
      </ToolItem>
      <ToolItem name="Redshift">
        <ReactSVG src={`icons/Redshift.svg`} style={{width: "48px", height: "48px"}}/>
      </ToolItem>
    </Box>
    </>
  );
};
