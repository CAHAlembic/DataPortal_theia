/**
 * Example configuration for DataPortal MCP Server
 * Copy this file to config.ts and adjust for your environment
 */

import { MCPServerConfig } from './src/server';

// Tier 1: Alembic Cloud (Kubernetes)
export const tier1Config: MCPServerConfig = {
    port: 3000,
    generatorServiceEndpoint: 'http://generator-services:8080',
    gravitinoEndpoint: 'http://gravitino:8090',
    checkpointStorage: 'hudi://dataportal/checkpoints',
    llmEndpoints: {
        dataEngineering: 'http://data-eng-llm:8000/v1',
        coreProduct: 'http://core-product-llm:8001/v1'
    }
};

// Tier 2: Alembic Appliance (DGX Spark)
export const tier2Config: MCPServerConfig = {
    port: 3000,
    generatorServiceEndpoint: 'http://host.docker.internal:8080',
    gravitinoEndpoint: 'http://localhost:8090',
    checkpointStorage: 'file:///data/checkpoints',
    llmEndpoints: {
        dataEngineering: 'http://localhost:8000/v1',
        coreProduct: 'http://localhost:8001/v1' // or cloud fallback
    }
};

// Tier 3: Data Engineer Laptop
export const tier3Config: MCPServerConfig = {
    port: 3000,
    generatorServiceEndpoint: 'http://localhost:8080',
    gravitinoEndpoint: 'https://gravitino.alembic.ai:8090', // cloud
    checkpointStorage: 'file://./data/checkpoints',
    llmEndpoints: {
        dataEngineering: 'http://localhost:8000/v1',
        coreProduct: 'https://llm.alembic.ai/v1' // cloud
    }
};

// Select configuration based on environment
const tier = process.env.TIER || '1';
export const config = tier === '1' ? tier1Config : tier === '2' ? tier2Config : tier3Config;


