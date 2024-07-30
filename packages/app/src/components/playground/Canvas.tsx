import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

const ItemType = {
  TOOL: 'tool',
};

export const Canvas = () => {
  const [items, setItems] = useState<any>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType.TOOL,
    drop: (item) => {
      setItems((prevItems: any) => [...prevItems, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: isOver ? '#f0f0f0' : '#fff' }}>
      {items.map((item: any, index: number) => (
        <div key={index} style={{ position: 'absolute', top: `${index * 50}px`, left: '50px' }}>
          {item.name}
        </div>
      ))}
    </div>
  );
};
