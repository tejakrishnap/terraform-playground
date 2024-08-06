import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Box, Button, Tooltip, Typography } from '@material-ui/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e1e4e8',
    },
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
  copiedIcon: {
    color: 'green',
  },
}));

interface CopyToClipboardButtonProps {
  label?: string;
  textToCopy: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  label,
  textToCopy,
}) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <>
    {label && <Typography variant="h6" gutterBottom>{label}</Typography>}
    <Box sx={{display: 'flex', alignItems: 'center', my: 2, pl: 4, py: 1, backgroundColor: '#e1e4e8', justifyContent: 'space-between', borderRadius: 8}}>
      <Typography variant="subtitle1" gutterBottom>{textToCopy}</Typography>
      <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
        <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'} arrow>
          <Button className={classes.button}>
            {copied ? (
              <CheckIcon className={`${classes.icon} ${classes.copiedIcon}`} />
            ) : (
              <ContentCopyIcon className={classes.icon} />
            )}
          </Button>
        </Tooltip>
      </CopyToClipboard>
    </Box>
    </>
  );
};
