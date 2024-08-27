import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { theme } from '../Root/Root';

export const MappingModal = ({
  open,
  onClose,
  sourceOutputs,
  targetInputs,
  onSave,
  sourceName,
  targetName,
}) => {
  const [selectedMappings, setSelectedMappings] = useState({});

  useEffect(() => {
    console.log(selectedMappings);
  }, [selectedMappings]);

  const handleSelectChange = (outputKey, event) => {
    console.log(outputKey, event.target.value);
    setSelectedMappings(prev => ({
      ...prev,
      [event.target.value]: outputKey.value,
    }));
  };

  const toCapitalCase = name => {
    return name
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleSave = () => {
    onSave(selectedMappings);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'greentheme.green',
          p: 4,
          outline: 'none',
          borderRadius: 16,
          color: theme.palette.greentheme.offwhite,
        }}
      >
        <h2
          style={{ color: theme.palette.greentheme.offwhite, marginBottom: 8 }}
        >
          You are connecting {sourceName} to {targetName}
        </h2>
        <Typography
          variant="subtitle1"
          style={{ color: theme.palette.greentheme.yellow, fontWeight: 600 }}
        >
          Map your outputs on the left to the inputs on the right
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 24 }}>
          {Object.entries(sourceOutputs || {}).map(
            ([outputKey, outputValue]) => (
              <Grid
                container
                item
                xs={12}
                key={outputKey}
                style={{
                  marginBottom: 16,
                  alignItems: 'center',
                  columnGap: 50,
                  justifyContent: 'center',
                }}
              >
                <Grid item style={{ alignContent: 'center' }} xs={3}>
                  <Typography
                    variant="subtitle1"
                    style={{
                      color: theme.palette.greentheme.yellow,
                      fontWeight: 600,
                    }}
                  >
                    {toCapitalCase(outputValue.key)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{ textAlign: 'center', alignContent: 'center' }}
                >
                  <ArrowForwardIcon />
                </Grid>
                <Grid item xs={5}>
                  <FormControl component="fieldset" fullWidth size="small">
                    <Select
                      value={
                        Object.keys(selectedMappings).find(
                          key => selectedMappings[key] === outputValue.value,
                        ) || ''
                      }
                      onChange={e => handleSelectChange(outputValue, e)}
                      displayEmpty
                      variant="outlined"
                      style={{ color: theme.palette.greentheme.offwhite }}
                    >
                      <MenuItem value="" disabled>
                        Select Input
                      </MenuItem>
                      {Object.entries(targetInputs || {}).map(
                        ([inputKey, inputValue]) => (
                          <MenuItem
                            key={inputValue.key}
                            value={inputValue.key}
                            style={{ fontWeight: 600 }}
                          >
                            {toCapitalCase(inputValue.key)}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ),
          )}
        </Grid>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
