import { Divider } from '@material-ui/core';
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReactSVG } from 'react-svg';

const ItemType = {
  TOOL: 'tool',
};

type ToolName = 'ECS' | 'Lambda' | 'RDS' | 'Redshift';

interface DragItem {
  name: ToolName;
}

const iconMapping: Record<ToolName, string> = {
  ECS: 'icons/Ecs.svg',
  Lambda: 'icons/Lambda.svg',
  RDS: 'icons/Rds.svg',
  Redshift: 'icons/Redshift.svg',
};

export const Canvas = () => {
  const [items, setItems] = useState<DragItem[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: (item: DragItem) => {
      setItems((prevItems) => [...prevItems, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <>
    <h2 style={{marginLeft: "8px", textAlign: 'center'}}>Canvas</h2>
    <Divider/>
    <div ref={drop} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: isOver ? '#f0f0f0' : '#fff' }}>
      {items.map((item, index) => (
        <div key={index} style={{ marginTop: '20px', position: 'absolute', top: `${index * 80}px`, left: '50px' }}>
          <ReactSVG src={iconMapping[item.name]} style={{ width: '60px', height: '60px' }} />
        </div>
      ))}
    </div>
    </>
  );
};
