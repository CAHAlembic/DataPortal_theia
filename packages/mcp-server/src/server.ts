/**
 * DataPortal MCP Server
 * 
 * Exposes DataPortal resources and tools via Model Context Protocol:
 * - Generator Services (all 12 generators)
 * - LLM Resources (Data Engineering LLM + Core Product LLM)
 * - Data Resources (Checkpoints, Schema Catalog)
 * - Tools for workflow orchestration
 */

import { Server } from '@modelcontextprotocol/sdk';
import { GeneratorServiceClient } from './clients/generator-client';
import { CheckpointManager } from './clients/checkpoint-manager';
import { LLMClient } from './clients/llm-client';
import { SchemaRegistry } from './clients/schema-registry';

export interface MCPServerConfig {
    port: number;
    generatorServiceEndpoint: string;
    gravitinoEndpoint: string;
    checkpointStorage: string;
    llmEndpoints: {
        dataEngineering: string;
        coreProduct: string;
    };
}

export class DataPortalMCPServer {
    private server: Server;
    private generatorClient: GeneratorServiceClient;
    private checkpointManager: CheckpointManager;
    private llmClient: LLMClient;
    private schemaRegistry: SchemaRegistry;
    private config: MCPServerConfig;

    constructor(config: MCPServerConfig) {
        this.config = config;
        
        this.server = new Server({
            name: 'dataportal-mcp-server',
            version: '1.0.0',
            description: 'MCP Server for DataPortal - Generator Services, LLMs, and Data Resources'
        });

        // Initialize clients
        this.generatorClient = new GeneratorServiceClient(config.generatorServiceEndpoint);
        this.checkpointManager = new CheckpointManager(config.checkpointStorage);
        this.llmClient = new LLMClient(config.llmEndpoints);
        this.schemaRegistry = new SchemaRegistry(config.gravitinoEndpoint);

        // Register resources and tools
        this.registerGeneratorResources();
        this.registerLLMResources();
        this.registerDataResources();
        this.registerTools();
    }

    /**
     * Register all 12 generator services as MCP resources
     */
    private registerGeneratorResources(): void {
        const generators = [
            {
                id: 'ingest-generator',
                name: 'Ingest Generator',
                description: 'Load raw data from multiple sources into standardized format',
                gpuRequired: false,
                llmRequired: false
            },
            {
                id: 'prep-clean-generator',
                name: 'Prep & Clean Generator',
                description: 'Data quality checks, missing value handling, normalization',
                gpuRequired: false,
                llmRequired: false
            },
            {
                id: 'schema-normalizer-generator',
                name: 'Schema Normalizer Generator',
                description: 'LLM-powered schema discovery and normalization',
                gpuRequired: false,
                llmRequired: 'data-engineering'
            },
            {
                id: 'schema-mapper-generator',
                name: 'Schema Mapper Generator',
                description: 'Map entities to MTL dimensions',
                gpuRequired: false,
                llmRequired: 'core-product'
            },
            {
                id: 'intent-classifier-generator',
                name: 'Intent Classifier Generator',
                description: 'Classify KPI intent and generate execution rules',
                gpuRequired: false,
                llmRequired: 'core-product'
            },
            {
                id: 'autodimensions-generator',
                name: 'AutoDimensions Generator',
                description: 'Intelligent dimension and metric detection (4-pass algorithm)',
                gpuRequired: true,
                llmRequired: false
            },
            {
                id: 'autocube-generator',
                name: 'AutoCube Generator',
                description: 'GPU-accelerated cube generation with scoring',
                gpuRequired: true,
                llmRequired: false
            },
            {
                id: 'autodetections-generator',
                name: 'AutoDetections Generator',
                description: 'Intelligent detector configuration',
                gpuRequired: false,
                llmRequired: false
            },
            {
                id: 'autoenhancers-detractors-generator',
                name: 'AutoEnhancers-Detractors Generator',
                description: 'Enhancement analysis via Causal Graph simulation',
                gpuRequired: true,
                llmRequired: false
            },
            {
                id: 'template-selector-generator',
                name: 'Template Selector Generator',
                description: 'Select query template from library',
                gpuRequired: false,
                llmRequired: 'core-product'
            },
            {
                id: 'parameter-extractor-generator',
                name: 'Parameter Extractor Generator',
                description: 'Extract parameters for GPU jobs',
                gpuRequired: false,
                llmRequired: 'core-product'
            },
            {
                id: 'oesnn-generator',
                name: 'OeSNN Generator',
                description: 'Anomaly detection and causal inference',
                gpuRequired: true,
                llmRequired: false
            }
        ];

        for (const generator of generators) {
            this.server.resource(`generator://${generator.id}`, {
                name: generator.name,
                description: generator.description,
                read: async () => {
                    const metadata = await this.generatorClient.getMetadata(generator.id);
                    return {
                        generatorId: generator.id,
                        name: generator.name,
                        description: generator.description,
                        endpoint: metadata.endpoint,
                        inputSchema: metadata.inputSchema,
                        outputSchema: metadata.outputSchema,
                        gpuRequired: generator.gpuRequired,
                        llmRequired: generator.llmRequired,
                        status: metadata.status,
                        version: metadata.version
                    };
                }
            });
        }
    }

    /**
     * Register LLM resources
     */
    private registerLLMResources(): void {
        // Data Engineering LLM
        this.server.resource('llm://data-engineering', {
            name: 'Data Engineering LLM',
            description: 'Local LLM for pipeline setup and data engineering tasks',
            read: async () => {
                return {
                    model: 'phi-2',
                    modelSize: '2.7B',
                    endpoint: this.config.llmEndpoints.dataEngineering,
                    capabilities: [
                        'connector-generation',
                        'schema-normalization',
                        'etl-pipeline-generation',
                        'data-quality-rules',
                        'data-profiling'
                    ],
                    deployment: 'local',
                    temperature: 0.1,
                    maxTokens: 1024
                };
            }
        });

        // Core Product LLM
        this.server.resource('llm://core-product', {
            name: 'Core Product LLM',
            description: 'LLM for intent classification and rule generation',
            read: async () => {
                return {
                    model: 'phi-3-medium',
                    modelSize: '14B',
                    endpoint: this.config.llmEndpoints.coreProduct,
                    capabilities: [
                        'intent-classification',
                        'schema-mapping',
                        'template-selection',
                        'parameter-extraction'
                    ],
                    deployment: 'hosted',
                    temperature: 0.0,
                    maxTokens: 512
                };
            }
        });
    }

    /**
     * Register data resources (checkpoints, schema catalog)
     */
    private registerDataResources(): void {
        // Checkpoint resources
        this.server.resource('data://checkpoints', {
            name: 'Workflow Checkpoints',
            description: 'All workflow checkpoints with state and lineage',
            read: async () => {
                const checkpoints = await this.checkpointManager.listAll();
                return {
                    count: checkpoints.length,
                    checkpoints: checkpoints.map(cp => ({
                        id: cp.id,
                        stageName: cp.stageName,
                        branch: cp.branch,
                        timestamp: cp.timestamp,
                        qualityScore: cp.metadata.qualityScore
                    }))
                };
            }
        });

        // Schema catalog
        this.server.resource('data://schema-catalog', {
            name: 'Schema Catalog',
            description: 'Gravitino-based schema catalog with MTL dimensions',
            read: async () => {
                const schemas = await this.schemaRegistry.listSchemas();
                return {
                    count: schemas.length,
                    schemas: schemas
                };
            }
        });
    }

    /**
     * Register MCP tools for workflow orchestration
     */
    private registerTools(): void {
        // Tool: Execute Generator
        this.server.tool('execute_generator', {
            description: 'Execute a DataPortal generator service with input data',
            parameters: {
                type: 'object',
                properties: {
                    generatorName: {
                        type: 'string',
                        description: 'Generator service name',
                        enum: [
                            'ingest-generator',
                            'prep-clean-generator',
                            'schema-normalizer-generator',
                            'schema-mapper-generator',
                            'intent-classifier-generator',
                            'autodimensions-generator',
                            'autocube-generator',
                            'autodetections-generator',
                            'autoenhancers-detractors-generator',
                            'template-selector-generator',
                            'parameter-extractor-generator',
                            'oesnn-generator'
                        ]
                    },
                    inputData: {
                        type: 'object',
                        description: 'Input data for generator'
                    },
                    parameters: {
                        type: 'object',
                        description: 'Generator-specific parameters'
                    },
                    parentCheckpointId: {
                        type: 'string',
                        description: 'Parent checkpoint ID for lineage tracking'
                    }
                },
                required: ['generatorName', 'inputData']
            },
            execute: async (params: any) => {
                try {
                    const result = await this.generatorClient.execute(
                        params.generatorName,
                        params.inputData,
                        params.parameters || {},
                        params.parentCheckpointId
                    );

                    return {
                        success: true,
                        data: result.data,
                        checkpointId: result.checkpointId,
                        metadata: result.metadata,
                        executionTimeMs: result.executionTimeMs
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                        generatorName: params.generatorName
                    };
                }
            }
        });

        // Tool: Create Checkpoint
        this.server.tool('create_checkpoint', {
            description: 'Create a workflow checkpoint for state persistence',
            parameters: {
                type: 'object',
                properties: {
                    stageName: {
                        type: 'string',
                        description: 'Stage name for checkpoint'
                    },
                    data: {
                        type: 'object',
                        description: 'Data to checkpoint'
                    },
                    parentCheckpointId: {
                        type: 'string',
                        description: 'Parent checkpoint ID'
                    },
                    metadata: {
                        type: 'object',
                        description: 'Additional metadata'
                    }
                },
                required: ['stageName', 'data']
            },
            execute: async (params: any) => {
                const checkpoint = await this.checkpointManager.create({
                    stageName: params.stageName,
                    data: params.data,
                    parentCheckpoint: params.parentCheckpointId,
                    metadata: params.metadata || {}
                });

                return {
                    checkpointId: checkpoint.id,
                    timestamp: checkpoint.timestamp,
                    dataHash: checkpoint.metadata.dataHash
                };
            }
        });

        // Tool: Classify Intent
        this.server.tool('classify_intent', {
            description: 'Classify KPI intent using Core Product LLM',
            parameters: {
                type: 'object',
                properties: {
                    kpiDefinition: {
                        type: 'object',
                        description: 'KPI definition to classify',
                        properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                            metrics: { type: 'array' },
                            dimensions: { type: 'array' }
                        },
                        required: ['name', 'metrics']
                    }
                },
                required: ['kpiDefinition']
            },
            execute: async (params: any) => {
                const result = await this.llmClient.classifyIntent(params.kpiDefinition);

                return {
                    primaryIntent: result.primaryIntent,
                    confidence: result.confidence,
                    dimensionPriorities: result.dimensionPriorities,
                    suggestedFilters: result.suggestedFilters,
                    suggestedGenerators: result.suggestedGenerators
                };
            }
        });

        // Tool: Fork Workflow
        this.server.tool('fork_workflow', {
            description: 'Create a workflow fork from existing checkpoint',
            parameters: {
                type: 'object',
                properties: {
                    checkpointId: {
                        type: 'string',
                        description: 'Checkpoint to fork from'
                    },
                    branchName: {
                        type: 'string',
                        description: 'Name for fork branch'
                    },
                    ruleModifications: {
                        type: 'object',
                        description: 'Rule modifications for fork'
                    }
                },
                required: ['checkpointId', 'branchName']
            },
            execute: async (params: any) => {
                const fork = await this.checkpointManager.forkCheckpoint(
                    params.checkpointId,
                    params.branchName,
                    params.ruleModifications || {}
                );

                return {
                    forkCheckpointId: fork.id,
                    forkBranch: fork.branch,
                    parentCheckpointId: params.checkpointId,
                    canCompare: true
                };
            }
        });

        // Tool: Compare Checkpoints
        this.server.tool('compare_checkpoints', {
            description: 'Compare two checkpoints (e.g., main vs fork)',
            parameters: {
                type: 'object',
                properties: {
                    checkpoint1Id: {
                        type: 'string',
                        description: 'First checkpoint ID'
                    },
                    checkpoint2Id: {
                        type: 'string',
                        description: 'Second checkpoint ID'
                    }
                },
                required: ['checkpoint1Id', 'checkpoint2Id']
            },
            execute: async (params: any) => {
                const comparison = await this.checkpointManager.compareCheckpoints(
                    params.checkpoint1Id,
                    params.checkpoint2Id
                );

                return {
                    checkpoint1: comparison.checkpoint1,
                    checkpoint2: comparison.checkpoint2,
                    dataDiff: comparison.dataDiff,
                    qualityComparison: comparison.qualityComparison,
                    recommendation: comparison.recommendation
                };
            }
        });

        // Tool: List Available Generators
        this.server.tool('list_generators', {
            description: 'List all available generator services with their capabilities',
            parameters: {
                type: 'object',
                properties: {
                    filterByCapability: {
                        type: 'string',
                        description: 'Filter by capability (gpu-required, llm-required, etc.)'
                    }
                }
            },
            execute: async (params: any) => {
                const generators = await this.generatorClient.listAll();
                
                let filtered = generators;
                if (params.filterByCapability) {
                    filtered = generators.filter(g => 
                        g[params.filterByCapability as keyof typeof g] === true
                    );
                }

                return {
                    count: filtered.length,
                    generators: filtered.map(g => ({
                        id: g.id,
                        name: g.name,
                        description: g.description,
                        gpuRequired: g.gpuRequired,
                        llmRequired: g.llmRequired,
                        status: g.status
                    }))
                };
            }
        });

        // Tool: Query Data
        this.server.tool('query_data', {
            description: 'Query checkpoint data or schema catalog',
            parameters: {
                type: 'object',
                properties: {
                    resourceType: {
                        type: 'string',
                        enum: ['checkpoint', 'schema'],
                        description: 'Type of resource to query'
                    },
                    query: {
                        type: 'object',
                        description: 'Query parameters'
                    }
                },
                required: ['resourceType', 'query']
            },
            execute: async (params: any) => {
                if (params.resourceType === 'checkpoint') {
                    return await this.checkpointManager.query(params.query);
                } else if (params.resourceType === 'schema') {
                    return await this.schemaRegistry.query(params.query);
                }
                throw new Error(`Unknown resource type: ${params.resourceType}`);
            }
        });
    }

    /**
     * Start the MCP server
     */
    public listen(port?: number): void {
        const serverPort = port || this.config.port;
        this.server.listen(serverPort);
        console.log(`DataPortal MCP Server listening on port ${serverPort}`);
        console.log(`Generator Service Endpoint: ${this.config.generatorServiceEndpoint}`);
        console.log(`Gravitino Endpoint: ${this.config.gravitinoEndpoint}`);
        console.log(`Checkpoint Storage: ${this.config.checkpointStorage}`);
    }

    /**
     * Stop the MCP server
     */
    public async stop(): Promise<void> {
        await this.server.close();
        console.log('DataPortal MCP Server stopped');
    }
}

// Start server if run directly
if (require.main === module) {
    const config: MCPServerConfig = {
        port: parseInt(process.env.MCP_PORT || '3000'),
        generatorServiceEndpoint: process.env.GENERATOR_SERVICE_ENDPOINT || 'http://localhost:8080',
        gravitinoEndpoint: process.env.GRAVITINO_ENDPOINT || 'http://gravitino:8090',
        checkpointStorage: process.env.CHECKPOINT_STORAGE || 'hudi://checkpoints',
        llmEndpoints: {
            dataEngineering: process.env.DATA_ENG_LLM_ENDPOINT || 'http://localhost:8000/v1',
            coreProduct: process.env.CORE_PRODUCT_LLM_ENDPOINT || 'http://localhost:8001/v1'
        }
    };

    const server = new DataPortalMCPServer(config);
    server.listen();

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('SIGINT received, shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });
}

export default DataPortalMCPServer;


