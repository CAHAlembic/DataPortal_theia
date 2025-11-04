/**
 * Generator Service Client
 * Communicates with DataPortal Generator Services
 */

import axios, { AxiosInstance } from 'axios';

export interface GeneratorMetadata {
    id: string;
    name: string;
    version: string;
    description: string;
    endpoint: string;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    gpuRequired: boolean;
    llmRequired: boolean | string;
    status: 'healthy' | 'degraded' | 'unavailable';
}

export interface GeneratorExecutionResult {
    success: boolean;
    data: any;
    checkpointId: string;
    metadata: Record<string, any>;
    executionTimeMs: number;
}

export class GeneratorServiceClient {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 300000, // 5 minutes for GPU operations
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Get metadata for a specific generator
     */
    async getMetadata(generatorId: string): Promise<GeneratorMetadata> {
        try {
            const response = await this.client.get(`/api/v1/generators/${generatorId}/metadata`);
            return response.data;
        } catch (error) {
            console.error(`Failed to get metadata for ${generatorId}:`, error);
            // Return mock metadata if service unavailable (for development)
            return this.getMockMetadata(generatorId);
        }
    }

    /**
     * Execute a generator with input data
     */
    async execute(
        generatorId: string,
        inputData: any,
        parameters: Record<string, any> = {},
        parentCheckpointId?: string
    ): Promise<GeneratorExecutionResult> {
        const startTime = Date.now();

        try {
            const response = await this.client.post(`/api/v1/generators/${generatorId}/execute`, {
                inputData,
                parameters,
                parentCheckpointId
            });

            const executionTimeMs = Date.now() - startTime;

            return {
                success: true,
                data: response.data.data,
                checkpointId: response.data.checkpointId,
                metadata: response.data.metadata || {},
                executionTimeMs
            };
        } catch (error) {
            console.error(`Failed to execute ${generatorId}:`, error);
            throw new Error(`Generator execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * List all available generators
     */
    async listAll(): Promise<GeneratorMetadata[]> {
        try {
            const response = await this.client.get('/api/v1/generators');
            return response.data.generators;
        } catch (error) {
            console.error('Failed to list generators:', error);
            // Return mock list for development
            return this.getMockGeneratorList();
        }
    }

    /**
     * Health check for a generator
     */
    async healthCheck(generatorId: string): Promise<{ status: string; timestamp: string }> {
        try {
            const response = await this.client.get(`/api/v1/generators/${generatorId}/health`);
            return response.data;
        } catch (error) {
            return {
                status: 'unavailable',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Mock metadata for development (when actual service not available)
     */
    private getMockMetadata(generatorId: string): GeneratorMetadata {
        const mockMetadata: Record<string, Partial<GeneratorMetadata>> = {
            'ingest-generator': {
                name: 'Ingest Generator',
                description: 'Load raw data from multiple sources',
                gpuRequired: false,
                llmRequired: false
            },
            'prep-clean-generator': {
                name: 'Prep & Clean Generator',
                description: 'Data quality and cleaning',
                gpuRequired: false,
                llmRequired: false
            },
            'autodimensions-generator': {
                name: 'AutoDimensions Generator',
                description: 'Dimension detection with 4-pass algorithm',
                gpuRequired: true,
                llmRequired: false
            },
            'autocube-generator': {
                name: 'AutoCube Generator',
                description: 'GPU-accelerated cube generation',
                gpuRequired: true,
                llmRequired: false
            },
            'oesnn-generator': {
                name: 'OeSNN Generator',
                description: 'Causal inference and anomaly detection',
                gpuRequired: true,
                llmRequired: false
            }
        };

        const metadata = mockMetadata[generatorId] || {
            name: generatorId,
            description: 'Generator service',
            gpuRequired: false,
            llmRequired: false
        };

        return {
            id: generatorId,
            name: metadata.name!,
            version: '1.0.0',
            description: metadata.description!,
            endpoint: `${this.baseUrl}/api/v1/generators/${generatorId}`,
            inputSchema: {},
            outputSchema: {},
            gpuRequired: metadata.gpuRequired!,
            llmRequired: metadata.llmRequired!,
            status: 'healthy'
        };
    }

    /**
     * Mock generator list for development
     */
    private getMockGeneratorList(): GeneratorMetadata[] {
        const generatorIds = [
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
        ];

        return generatorIds.map(id => this.getMockMetadata(id));
    }
}


