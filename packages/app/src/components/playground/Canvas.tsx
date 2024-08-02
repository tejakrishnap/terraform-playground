import { Divider } from '@material-ui/core';
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReactSVG } from 'react-svg';
import axios from 'axios'; // Add axios for HTTP requests
import { useApi, configApiRef } from '@backstage/core-plugin-api';

import { terraformTemplates } from '../../terraformTemplates';

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

export const Canvas: React.FC = () => {
  const [items, setItems] = useState<DragItem[]>([]);
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: (item: DragItem) => {
      setItems((prevItems) => {
        const newItems = [...prevItems, item];
        generateTerraformFile(newItems);
        return newItems;
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const generateTerraformFile = async (items: DragItem[]) => {
    let terraformContent = '';
    items.forEach(item => {
      const moduleContent = terraformTemplates[item.name.toLowerCase()];
      terraformContent += `\n# Module: ${item.name}\n` + moduleContent;
    });

    try {
      await axios.post(`${backendBaseUrl}/api/terraform-backend-api/save-terraform`, { content: terraformContent });
      console.log('File saved successfully');
    } catch (error) {
      console.error('Failed to save file', error);
    }
  };

  return (
    <>
      <h2 style={{ marginLeft: '8px', textAlign: 'center', color: '#fff' }}>Canvas</h2>
      <Divider style={{ backgroundColor: '#43E8B0' }} />
      <div ref={drop} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1E1E1E' }}>
        {items.map((item, index) => (
          <div key={index} style={{ marginTop: '20px', position: 'absolute', top: `${index * 80}px`, left: '50px' }}>
            <ReactSVG src={iconMapping[item.name]} style={{ width: '60px', height: '60px' }} />
          </div>
        ))}
      </div>
    </>
  );
};
