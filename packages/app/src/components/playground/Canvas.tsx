import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReactSVG } from 'react-svg';
import { terraformTemplates } from '../../terraformTemplates';
import HighlightOffIcon from '@material-ui/icons/HighlightOffSharp';
import { Box, Button, Modal, TextField } from '@material-ui/core';

const ItemType = {
  TOOL: 'tool',
};

const iconMapping = {
  ECS: 'icons/Ecs.svg',
  Lambda: 'icons/Lambda.svg',
  RDS: 'icons/Rds.svg',
  Redshift: 'icons/Redshift.svg',
};

const getInputsForItem = (itemName: string) => {
  switch (itemName) {
    case 'ECS':
      return [
        { label: 'Name', key: 'name' },
        { label: 'Age', key: 'age' },
        { label: 'Gender', key: 'gender' },
      ];
    case 'Lambda':
      return [
        { label: 'Function Name', key: 'functionName' },
        { label: 'Runtime', key: 'runtime' },
      ];
    case 'RDS':
      return [
        { label: 'DB Name', key: 'dbName' },
        { label: 'Username', key: 'username' },
      ];
    case 'Redshift':
      return [
        { label: 'Cluster ID', key: 'clusterId' },
        { label: 'Node Type', key: 'nodeType' },
      ];
    default:
      return [];
  }
};

export const Canvas = ({ items, setItems }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const handleOpen = item => {
    setSelectedItem(item);
    setInputValues(item.data || {});
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
    generateTerraformFile(updatedItems);
    handleClose();
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: item => {
      const newItem = { ...item, id: Date.now() };
      const newItems = [...items, newItem];
      setItems(newItems);
      generateTerraformFile(newItems);

      return newItems;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const generateTerraformFile = items => {
    let terraformContent = '';
    items.forEach(item => {
      const moduleContent = terraformTemplates[item.name.toLowerCase()];
      terraformContent += `\n# Module: ${item.name}\n${moduleContent}`;
    });
    console.log(terraformContent);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    generateTerraformFile(updatedItems);
  };

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#1E1E1E',
      }}
    >
      {items.map((item, index) => (
        <Box sx={{ position: 'relative' }}>
          <div
            key={item.id}
            style={{
              marginTop: '20px',
              position: 'absolute',
              top: `${index * 120}px`,
              left: '50px',
            }}
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
              onClick={() => handleOpen(item)}
            />
          </div>
        </Box>
      ))}
      <Modal open={open} onClose={handleClose} style={{ outline: 'none' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            outline: 'none',
            borderRadius: 16,
          }}
        >
          <h2>Edit {selectedItem?.name} Configuration</h2>
          {selectedItem &&
            getInputsForItem(selectedItem.name).map(input => (
              <TextField
                key={input.key}
                label={input.label}
                value={inputValues[input.key] || ''}
                onChange={e => handleInputChange(input.key, e.target.value)}
                fullWidth
                margin="normal"
              />
            ))}
          <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
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
              onClick={handleSave}
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
