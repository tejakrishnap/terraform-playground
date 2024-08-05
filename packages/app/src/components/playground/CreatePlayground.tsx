import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@material-ui/core';

export const CreatePlaygroundPage = () => {
  const [playgroundName, setPlaygroundName] = useState('');
  const [webhook, setWebhook] = useState('');
  const [backend, setBackend] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!playgroundName) {
      alert('Playground Name is required');
      return;
    }

    const newPlayground = {
      name: playgroundName,
      items: [],
      webhook,
      backend,
      accessKey
    };

    localStorage.setItem(`playground-${playgroundName}`, JSON.stringify(newPlayground));

    navigate(`/playground?name=${encodeURIComponent(playgroundName)}`);
  };

  const handleExistingPlaygrounds = () => {
    navigate('/exisiting-playgrounds');
  };

  return (
    <Container style={{ marginTop: 24 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Playground
      </Typography>
      <TextField
        label="Playground Name"
        value={playgroundName}
        onChange={(e) => setPlaygroundName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Gitlab Integration Webhook"
        value={webhook}
        onChange={(e) => setWebhook(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Terraform Backend"
        value={backend}
        onChange={(e) => setBackend(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Access Key"
        value={accessKey}
        onChange={(e) => setAccessKey(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginTop: 24 }}>
        Create Playground
      </Button>
      <Button variant="contained" color="secondary" onClick={handleExistingPlaygrounds} style={{ marginTop: 24, marginLeft: 24 }}>
        Existing Playgrounds
      </Button>
    </Container>
  );
};
