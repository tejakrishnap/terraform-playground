import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReactSVG } from 'react-svg';
import Draggable from 'react-draggable';
import axios from 'axios';
import HighlightOffIcon from '@material-ui/icons/HighlightOffSharp';
import { Box, Button, Chip, Modal, TextField } from '@material-ui/core';
import { theme } from '../Root/Root';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const ItemType = {
  TOOL: 'tool',
};

const iconMapping = {
  'ECS-Cluster': 'icons/ECS-Cluster.svg',
  'ECS-Service': 'icons/ECS-Service.svg',
  'ECS-Task-Definition': 'icons/ECS-Task-Definition.svg',
  RDS: 'icons/RDS.svg',
  'Security-Group': 'icons/Security-Group.svg',
  'Application-Load-Balancer': 'icons/Application-Load-Balancer.svg',
};

export const Canvas = ({ items, setItems }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValues, setInputValues] = useState({});
  // const [variableData, setVariableData] = useState([]);
  const [variableData, setVariableData] = useState({ inputs: {}, outputs: {} });
  const [error, setError] = useState(null);
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');

  const handleOpen = async item => {
    setSelectedItem(item);
    setInputValues(item.data || {});

    try {
      const response = await axios.post(
        `${backendBaseUrl}/api/terraform-backend-api/get-variable-data`,
        {
          serviceKey: item.name, // Send the service key as payload
        },
      );
      // console.log('Variable data response:', response.data);
      // setVariableData(response.data[item.name]?.inputs || []);
      const data = response.data;

      if (response.status === 200) {
        setVariableData(data);
      } else {
        setError(data.message);
        setVariableData({ inputs: {}, outputs: {} });
      }
    } catch (error) {
      console.error('Error fetching variable data:', error);
      setError('Failed to fetch variable data');
      setVariableData({ inputs: {}, outputs: {} });
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (key, value) => {
    setInputValues({ ...inputValues, [key]: value });
  };

  const handleSave = () => {
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, data: inputValues };
      }
      return item;
    });
    setItems(updatedItems);
    handleClose();
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: item => {
      const newItem = { ...item, id: Date.now() };
      const newItems = [...items, newItem];
      setItems(newItems);

      return newItems;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleRemoveItem = id => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const toCapitalCase = name => {
    return name
      .replace(/_/g, ' ') // Replace underscores with spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      {items.map((item, index) => (
        <Draggable key={item.id}>
          <Box
            sx={{ position: 'absolute', top: `${index * 120}px`, left: '50px' }}
          >
            <HighlightOffIcon
              onClick={() => handleRemoveItem(item.id)}
              style={{
                position: 'relative',
                left: '50px',
                top: '0px',
                color: '#27ae60',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            <ReactSVG
              src={iconMapping[item.name]}
              style={{ width: '60px', height: '60px', cursor: 'pointer' }}
              onDoubleClick={() => handleOpen(item)}
            />
          </Box>
        </Draggable>
      ))}
      <Modal open={open} onClose={handleClose} style={{ outline: 'none' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80%',
            bgcolor: 'greentheme.green',
            p: 4,
            outline: 'none',
            borderRadius: 16,
            overflowY: 'auto',
          }}
        >
          <h2 style={{ color: theme.palette.greentheme.offwhite }}>
            {selectedItem?.name.replace(/-/g, ' ')} Configuration
          </h2>

          <h3 style={{ color: theme.palette.greentheme.offwhite }}>Outputs</h3>
          <Box sx={{display: 'flex', gridGap: 6}}>
            {Object.entries(variableData.outputs || {}).map(([key, value]) => (
              <Chip
                key={key}
                label={value.value}
                style={{
                  backgroundColor: theme.palette.greentheme.offwhite,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
          <h3
            style={{
              color: theme.palette.greentheme.offwhite,
              marginBottom: 0,
            }}
          >
            Inputs
          </h3>
          {Object.entries(variableData?.inputs).map(([key, value]) => (
            <TextField
              key={key}
              label={toCapitalCase(key)}
              helperText={value.description || ''}
              type={value.type === 'number' ? 'number' : 'text'}
              defaultValue={value.default || ''}
              value={inputValues[key] || ''}
              onChange={e => handleInputChange(key, e.target.value)}
              fullWidth
              margin="normal"
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginTop: 16 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              style={{ marginTop: 16, marginLeft: 16 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Canvas;
