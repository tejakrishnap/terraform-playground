import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOffSharp';
import { Handle, Position } from '@xyflow/react';
import { ReactSVG } from 'react-svg';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    onRemove: () => void;
    onOpen: (newItem: any) => void;
    handleRemoveItem: () => void;
  };
  handleRemoveItem: (id: string) => void;
}
const iconMapping: { [key: string]: string } = {
    'ECS-Cluster': 'icons/ECS-Cluster.svg',
    'ECS-Service': 'icons/ECS-Service.svg',
    'ECS-Task-Definition': 'icons/ECS-Task-Definition.svg',
    RDS: 'icons/RDS.svg',
    'Security-Group': 'icons/Security-Group.svg',
    'Application-Load-Balancer': 'icons/Application-Load-Balancer.svg',
  };

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, handleRemoveItem }) => {
  const handleRemoveNode = () => {
    handleRemoveItem(id);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '48px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <HighlightOffIcon
        onClick={handleRemoveNode}
        style={{
          position: 'absolute',
          left: '44px',
          top: '-10px',
          color: '#27ae60',
          width: '12px',
          cursor: 'pointer',
        }}
      />
      <ReactSVG
        src={iconMapping[data.label]}
        style={{ width: '38px', height: '38px', cursor: 'pointer' }}
        onDoubleClick={data.onOpen}
        title={data.label}
      />
      <Handle type="source" position={Position.Right} id="source" />
      <Handle type="target" position={Position.Left} id="target" />
    </div>
  );
};

export default CustomNode;
