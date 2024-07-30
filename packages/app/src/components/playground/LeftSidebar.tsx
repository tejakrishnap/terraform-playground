import React from 'react';
import { useDrag } from 'react-dnd';

const ItemType = {
  TOOL: 'tool',
};

const ToolItem = ({ name }: {name: string}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TOOL,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', margin: '4px', border: '1px solid #ccc' }}>
      {name}
    </div>
  );
};

export const LeftSidebar = () => {
  return (
    <div>
      <ToolItem name="Item A" />
      <ToolItem name="Item B" />
      <ToolItem name="Item C" />
    </div>
  );
};
