import React, {
  useState,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
  useRef,
} from 'react';
import { useDrop } from 'react-dnd';
import { Box, Button, Chip, Modal, TextField } from '@material-ui/core';
import { theme } from '../Root/Root';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import axios from 'axios';
import CustomEdge from './CustomEdge';
import { MappingModal } from './MappingModal';
import CustomNode from './CustomNode';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    onRemove: () => {};
    onOpen: () => (newItem: any) => {};
    handleRemoveItem: () => {};
  };
  handleRemoveItem: (id: string) => {};
}

interface CanvasProps {
  items: any[];
  setItems: Dispatch<SetStateAction<never[]>>;
}

const ItemType = {
  TOOL: 'tool',
};

const nodeTypes = {
  custom: (props: React.JSX.IntrinsicAttributes & CustomNodeProps) => (
    <CustomNode {...props} handleRemoveItem={props.data.handleRemoveItem} />
  ),
};

export const Canvas = ({ items, setItems }: CanvasProps) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [variableData, setVariableData] = useState({ inputs: {}, outputs: {} });
  const [error, setError] = useState(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState({
    source: '',
    target: '',
    sourceName: '',
    targetName: '',
  });
  const [sourceOutputs, setSourceOutputs] = useState<any[]>([]);
  const [targetInputs, setTargetInputs] = useState<any[]>([]);
  const dropContainerRef = useRef(null);
  const configApi = useApi(configApiRef);
  const backendBaseUrl = configApi.getString('backend.baseUrl');

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const edgeTypes = {
    'custom-edge': CustomEdge,
  };

  const fetchVariableData = async item => {
    try {
      const response = await axios.post(
        `${backendBaseUrl}/api/terraform-backend-api/get-variable-data`,
        { serviceKey: item.name },
      );
      const data = response.data;

      if (response.status === 200) {
        return data;
      } else {
        setError(data.message);
        return { inputs: {}, outputs: {} };
      }
    } catch (error) {
      console.error('Error fetching variable data:', error);
      setError('Failed to fetch variable data');
      return { inputs: {}, outputs: {} };
    }
  };

  const handleMappingSave = (mappings) => {
    // Update the items state with the selected mappings
    const updatedItems = items.map(item => {
      // Check if the item is the target of the mapping
      if (item.id === connectionInfo.target) {
        const updatedInputs = { ...item.inputs };
        Object.keys(mappings).forEach(outputKey => {
          const mappedInput = mappings[outputKey];
          if (mappedInput) {
            updatedInputs[outputKey] = mappedInput;
          }
        });
        return { ...item, inputs: updatedInputs };
      }
      return item;
    });

    setItems(updatedItems);
  };

  useEffect(() => {
    const newNodes = items.map(item => ({
      id: item.id,
      position: item.position || { x: 100, y: 100 },
      data: {
        label: item.name,
        onRemove: handleRemoveNode,
        onOpen: () => handleOpen(item),
        handleRemoveItem: handleRemoveItem,
      },
      type: 'custom',
    }));

    setNodes(newNodes as any);

    const newEdges = items.flatMap((item: any) =>
      (item.connections || [])
        .filter((conn: { target: string }) => conn.target !== item.id)
        .map((conn: { target: string }) => ({
          id: `${item.id}-${conn.target}`,
          type: 'custom-edge',
          source: item.id,
          target: conn.target,
          sourceHandle: 'source',
          targetHandle: 'target',
          animated: true,
        })),
    );

    const distinctEdges = Array.from(
      new Set(newEdges.map(edge => JSON.stringify(edge))),
    ).map(e => JSON.parse(e));

    setEdges(distinctEdges);
  }, [items, setNodes, setEdges]);

  useEffect(() => {
    console.log('Source Outputs Updated:', sourceOutputs);
  }, [sourceOutputs]);

  useEffect(() => {
    console.log('Target Inputs Updated:', targetInputs);
  }, [targetInputs]);

  const handleConnect = useCallback(
    params => {
      setEdges(eds =>
        addEdge(
          {
            ...params,
            sourceHandle: 'source',
            targetHandle: 'target',
            animated: true,
            type: 'custom-edge',
          },
          eds,
        ),
      );

      const { source, target } = params;
      setItems(items =>
        items.map(item => {
          if (item.id === source || item.id === target) {
            const updatedConnections = (item.connections || []).concat({
              source,
              target,
            });
            return { ...item, connections: updatedConnections };
          }
          return item;
        }),
      );
    },
    [setEdges, setItems],
  );

  const findItem = (itemId: string) => items.find(item => item.id === itemId);

  const onConnect = useCallback(
    async (params: Edge | Connection) => {
      handleConnect(params);

      const sourceItem = findItem(params.source);
      const targetItem = findItem(params.target);

      if (sourceItem && targetItem) {
        setConnectionInfo({
          source: params.source,
          target: params.target,
          sourceName: sourceItem.name.replace(/-/g, ' '),
          targetName: targetItem.name.replace(/-/g, ' '),
        });

        setSourceOutputs(
          Object.entries(sourceItem.outputs || {}).map(([key, value]) => ({
            key,
            ...value,
          })),
        );
        setTargetInputs(
          Object.entries(targetItem.inputs || {}).map(([key, value]) => ({
            key,
            ...value,
          })),
        );

        setConnectModalOpen(true);
      } else {
        console.warn('Source or target item not found in items array.');
      }
    },
    [handleConnect, findItem],
  );

  const handleOpen = item => {
    setSelectedItem(item);
    const existingItem = items.find(i => i.id === item.id);
    const initializedInputValues = Object.keys(item.inputs || {}).reduce(
      (acc, key) => {
        if (
          typeof existingItem?.inputs?.[key] === 'object' &&
          !Array.isArray(existingItem.inputs[key])
        ) {
          acc[key] = '';
        } else {
          acc[key] = existingItem?.inputs?.[key] || '';
        }
        return acc;
      },
      {},
    );

    setInputValues(initializedInputValues);
    setVariableData({ inputs: item.inputs || {}, outputs: item.outputs || {} });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setInputValues({});
  };

  const handleInputChange = (key, value) => {
    setInputValues({ ...inputValues, [key]: value });
  };

  const handleSave = async () => {
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, inputs: inputValues };
      }
      return item;
    });

    setItems(updatedItems);
    handleClose();
  };

  const [, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: async (item, monitor) => {
      const offset = monitor.getSourceClientOffset();

      if (!offset || !dropContainerRef.current) return;

      const dropRect = dropContainerRef.current.getBoundingClientRect();

      const newPosition = {
        x: offset.x - dropRect.left,
        y: offset.y - dropRect.top,
      };

      const newItem = {
        ...item,
        id: Date.now().toString(),
        position: newPosition,
      };

      if (!items.some(existingItem => existingItem.id === newItem.id)) {
        const data = await fetchVariableData(newItem);

        const newItems = [
          ...items,
          { ...newItem, inputs: data.inputs, outputs: data.outputs },
        ];
        setItems(newItems);

        const newNode = {
          id: newItem.id,
          position: newItem.position,
          data: {
            label: newItem.name,
            onRemove: handleRemoveNode,
            onOpen: () => handleOpen(newItem),
            handleRemoveItem: handleRemoveItem,
          },
          type: 'custom',
        };
        setNodes(nds => [...nds, newNode]);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleRemoveNode = nodeId => {
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setEdges(eds =>
      eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
    );
  };

  const handleRemoveItem = id => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    handleRemoveNode(id);
  };

  const toCapitalCase = name => {
    return name.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  };

  const handleNodeDragStop = (event, node) => {
    const updatedItems = items.map(item => {
      if (item.id === node.id) {
        return { ...item, position: node.position };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Combine refs into a single ref callback
  const combinedRef = useCallback(
    node => {
      drop(node); // Pass the node to drop
      dropContainerRef.current = node; // Set the dropContainerRef
    },
    [drop],
  );

  return (
    <div
      ref={combinedRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.primary.main,
        zIndex: 1,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background />
        <Controls style={{ position: 'absolute', bottom: '40px' }} />
      </ReactFlow>

      <MappingModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        sourceOutputs={sourceOutputs}
        targetInputs={targetInputs}
        connectionInfo={connectionInfo}
        onSave={handleMappingSave}
      />
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
          <h3
            style={{
              color: theme.palette.greentheme.offwhite,
              marginBottom: 0,
            }}
          >
            Inputs
          </h3>

          {Object.entries(variableData.inputs || {}).map(([key, value]) => (
            <TextField
              key={key}
              label={toCapitalCase(key)}
              helperText={value.description || ''}
              type={value.type === 'number' ? 'number' : 'text'}
              defaultValue={value.default || ''}
              value={
                typeof inputValues[key] === 'object'
                  ? JSON.stringify(inputValues[key])
                  : inputValues[key] || ''
              }
              onChange={e => handleInputChange(key, e.target.value)}
              fullWidth
              margin="normal"
              disabled={value.readOnly}
            />
          ))}
          <h3 style={{ color: theme.palette.greentheme.offwhite }}>Outputs</h3>
          <Box sx={{ display: 'flex', gridGap: 6 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              style={{ marginTop: 16, marginLeft: 8 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
