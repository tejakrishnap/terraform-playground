import React from 'react';
import { useDrop } from 'react-dnd';
import { ReactSVG } from 'react-svg';
import { terraformTemplates } from '../../terraformTemplates';

const ItemType = {
  TOOL: 'tool',
};

const iconMapping = {
  ECS: 'icons/Ecs.svg',
  Lambda: 'icons/Lambda.svg',
  RDS: 'icons/Rds.svg',
  Redshift: 'icons/Redshift.svg',
};

export const Canvas = ({ items, setItems }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: (item) => {
      const newItem = { ...item, id: Date.now() };
      const newItems = [...items, newItem];
      setItems(newItems);
      generateTerraformFile(newItems);
      
      return newItems;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const generateTerraformFile = (items) => {
    let terraformContent = '';
    items.forEach(item => {
      const moduleContent = terraformTemplates[item.name.toLowerCase()];
      terraformContent += `\n# Module: ${item.name}\n${moduleContent}`;
    });
    console.log(terraformContent);
  };

  return (
    <div ref={drop} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1E1E1E' }}>
      {items.map((item, index) => (
        <div key={item.id} style={{ marginTop: '20px', position: 'absolute', top: `${index * 80}px`, left: '50px' }}>
          <ReactSVG src={iconMapping[item.name]} style={{ width: '60px', height: '60px' }} />
        </div>
      ))}
    </div>
  );
};

export default Canvas;
