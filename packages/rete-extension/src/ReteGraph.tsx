import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin';
import './rete.css';

type Schemes = GetSchemes<ClassicPreset.Node, ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>>;
type AreaExtra = ReactArea2D<Schemes>;

interface Props {
    initialData?: any;
    onSave?: (data: any) => void;
}

export const ReteGraph: React.FC<Props> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<NodeEditor<Schemes>>();

    React.useEffect(() => {
        if (!ref.current) {
            console.warn('Rete: Container ref not available');
            return;
        }

        const container = ref.current;
        console.log('Rete: Initializing editor with container', {
            width: container.offsetWidth,
            height: container.offsetHeight,
            dimensions: container.getBoundingClientRect()
        });

        const editor = new NodeEditor<Schemes>();
        const area = new AreaPlugin<Schemes, AreaExtra>(container);
        const connection = new ConnectionPlugin<Schemes, AreaExtra>();
        const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

        AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
            accumulating: AreaExtensions.accumulateOnCtrl()
        });

        render.addPreset(Presets.classic.setup());
        connection.addPreset(ConnectionPresets.classic.setup());

        editor.use(area);
        area.use(connection);
        area.use(render);

        AreaExtensions.simpleNodesOrder(area);

        editorRef.current = editor;

        const socket = new ClassicPreset.Socket('socket');

        const importData = async (data: any) => {
            if (!data || !data.nodes) {
                console.log('Rete: No data to import');
                return;
            }

            console.log('Rete: Importing data', { nodeCount: Object.keys(data.nodes).length });
            const nodesMap = new Map<string, ClassicPreset.Node>();

            // Create nodes
            for (const [id, nodeData] of Object.entries(data.nodes) as [string, any][]) {
                const node = new ClassicPreset.Node(nodeData.name || 'Node');
                node.id = id;

                // Add inputs
                if (nodeData.inputs) {
                    for (const [key, inputData] of Object.entries(nodeData.inputs)) {
                        node.addInput(key, new ClassicPreset.Input(socket, key));
                    }
                }

                // Add outputs
                if (nodeData.outputs) {
                    for (const [key, outputData] of Object.entries(nodeData.outputs)) {
                        node.addOutput(key, new ClassicPreset.Output(socket, key));
                    }
                }

                // Add controls (simple number control for demo if data has 'num')
                if (nodeData.data && typeof nodeData.data.num === 'number') {
                    // In a real app we'd have specific controls. 
                    // For now, let's just store the data.
                }

                await editor.addNode(node);
                nodesMap.set(id, node);
                console.log(`Rete: Added node ${id} (${nodeData.name})`);

                if (nodeData.position) {
                    await area.translate(id, { x: nodeData.position[0], y: nodeData.position[1] });
                    console.log(`Rete: Positioned node ${id} at [${nodeData.position[0]}, ${nodeData.position[1]}]`);
                } else {
                    console.warn(`Rete: Node ${id} has no position data`);
                }
            }

            // Create connections
            for (const [nodeId, nodeData] of Object.entries(data.nodes) as [string, any][]) {
                const sourceNode = nodesMap.get(nodeId);
                if (!sourceNode || !nodeData.outputs) continue;

                for (const [outputKey, outputData] of Object.entries(nodeData.outputs) as [string, any][]) {
                    if (outputData.connections) {
                        for (const conn of outputData.connections) {
                            const targetNode = nodesMap.get(String(conn.node));
                            if (targetNode) {
                                try {
                                    await editor.addConnection(new ClassicPreset.Connection(
                                        sourceNode,
                                        outputKey,
                                        targetNode,
                                        conn.input
                                    ));
                                    console.log(`Rete: Created connection from ${nodeId}:${outputKey} to ${conn.node}:${conn.input}`);
                                } catch (e) {
                                    console.warn('Rete: Failed to create connection', e);
                                }
                            }
                        }
                    }
                }
            }
        };

        const initialize = async () => {
            console.log('Rete: Starting initialization', { hasInitialData: !!(props.initialData && Object.keys(props.initialData).length > 0) });

            if (props.initialData && Object.keys(props.initialData).length > 0) {
                await importData(props.initialData);
            } else {
                console.log('Rete: Creating default Welcome node');
                const node = new ClassicPreset.Node('Welcome');
                await editor.addNode(node);
                // Position the node in a visible area
                await area.translate(node.id, { x: 80, y: 80 });
                console.log('Rete: Positioned Welcome node at [80, 80]');
            }

            const nodes = editor.getNodes();
            console.log(`Rete: Total nodes created: ${nodes.length}`);

            // Increase timeout to ensure DOM is fully laid out
            setTimeout(() => {
                console.log('Rete: Zooming to fit nodes', { nodeCount: nodes.length });
                try {
                    AreaExtensions.zoomAt(area, nodes);
                    console.log('Rete: Zoom complete');
                } catch (e) {
                    console.error('Rete: Failed to zoom', e);
                }
            }, 300);
        };

        initialize();

        editor.addPipe(context => {
            if (['connectioncreated', 'connectionremoved', 'nodecreated', 'noderemoved', 'nodedragged'].includes(context.type)) {
                if (props.onSave) {
                    // Basic export to match the input format roughly
                    const nodes: any = {};

                    for (const node of editor.getNodes()) {
                        const inputs: any = {};
                        const outputs: any = {};

                        // We would need to reconstruct the connections here
                        // This is a simplified export
                        nodes[node.id] = {
                            id: node.id,
                            name: node.label,
                            position: [0, 0], // We need to get position from area
                            inputs,
                            outputs
                        };

                        // Get position
                        const view = area.nodeViews.get(node.id);
                        if (view) {
                            nodes[node.id].position = [view.position.x, view.position.y];
                        }
                    }

                    // Populate connections
                    for (const conn of editor.getConnections()) {
                        const sourceNode = nodes[conn.source];
                        const targetNode = nodes[conn.target];

                        if (sourceNode && targetNode) {
                            if (!sourceNode.outputs[conn.sourceOutput]) {
                                sourceNode.outputs[conn.sourceOutput] = { connections: [] };
                            }
                            sourceNode.outputs[conn.sourceOutput].connections.push({
                                node: conn.target,
                                input: conn.targetInput,
                                data: {}
                            });

                            if (!targetNode.inputs[conn.targetInput]) {
                                targetNode.inputs[conn.targetInput] = { connections: [] };
                            }
                            targetNode.inputs[conn.targetInput].connections.push({
                                node: conn.source,
                                output: conn.sourceOutput,
                                data: {}
                            });
                        }
                    }

                    props.onSave({ id: 'demo@0.1.0', nodes });
                }
            }
            return context;
        });

        return () => {
            area.destroy();
        };
    }, []);

    return (
        <div
            ref={ref}
            className="rete-container"
            style={{
                width: '100%',
                height: '100%',
                minHeight: '500px',
                position: 'relative',
                background: '#1e1e1e',
                overflow: 'hidden'
            }}
        />
    );
};
