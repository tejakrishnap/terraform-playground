import { Divider } from '@material-ui/core';
import React from 'react';
import { theme } from '../Root/Root';

export const RightSidebar = () => {
  return (
    <>
      <h2
        style={{
          marginLeft: '8px',
          textAlign: 'center',
          color: theme.palette.greentheme.green,
        }}
      >
        Generated Code
      </h2>
      <Divider style={{ backgroundColor: theme.palette.orangePeel.main }} />
    </>
  );
};
