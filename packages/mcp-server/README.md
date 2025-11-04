# DataPortal MCP Server

Model Context Protocol (MCP) server for DataPortal, exposing generator services, LLMs, and data resources to AutoGen agents and external tools.

## Overview

The MCP server provides a standardized interface for:

- **12 Generator Services**: All DataPortal generators (Ingest, Prep/Clean, AutoDimensions, AutoCube, OeSNN, etc.)
- **LLM Resources**: Data Engineering LLM and Core Product LLM
- **Data Resources**: Checkpoints, Schema Catalog (Gravitino)
- **Workflow Tools**: Execute generators, create checkpoints, classify intent, fork workflows

## Architecture

```
┌─────────────────────────────────────┐
│      AutoGen Agents / Clients       │
└──────────────┬──────────────────────┘
               │ MCP Protocol
┌──────────────▼──────────────────────┐
│       DataPortal MCP Server         │
│  ┌─────────────────────────────┐   │
│  │  Resources                  │   │
│  │  - Generators (12)          │   │
│  │  - LLMs (2)                 │   │
│  │  - Checkpoints              │   │
│  │  - Schema Catalog           │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Tools                      │   │
│  │  - execute_generator        │   │
│  │  - create_checkpoint        │   │
│  │  - classify_intent          │   │
│  │  - fork_workflow            │   │
│  │  - compare_checkpoints      │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
    ┌──────────▼─────────┬───────────────┬────────────┐
    │                    │               │            │
┌───▼────┐       ┌───────▼────┐  ┌──────▼──────┐  ┌─▼────────┐
│Generator│       │Checkpoint  │  │  Gravitino  │  │   LLMs   │
│Services │       │Storage     │  │  Catalog    │  │          │
└─────────┘       └────────────┘  └─────────────┘  └──────────┘
```

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file or set environment variables:

```bash
# MCP Server Port
MCP_PORT=3000

# Generator Service Endpoint
GENERATOR_SERVICE_ENDPOINT=http://localhost:8080

# Gravitino Endpoint
GRAVITINO_ENDPOINT=http://gravitino:8090

# Checkpoint Storage (Hudi)
CHECKPOINT_STORAGE=hudi://checkpoints

# LLM Endpoints
DATA_ENG_LLM_ENDPOINT=http://localhost:8000/v1
CORE_PRODUCT_LLM_ENDPOINT=http://localhost:8001/v1
```

## Usage

### Start Server

```bash
npm run start
```

Or in development mode:

```bash
npm run dev
```

### Programmatic Usage

```typescript
import { DataPortalMCPServer, MCPServerConfig } from '@dataportal/mcp-server';

const config: MCPServerConfig = {
    port: 3000,
    generatorServiceEndpoint: 'http://localhost:8080',
    gravitinoEndpoint: 'http://gravitino:8090',
    checkpointStorage: 'hudi://checkpoints',
    llmEndpoints: {
        dataEngineering: 'http://localhost:8000/v1',
        coreProduct: 'http://localhost:8001/v1'
    }
};

const server = new DataPortalMCPServer(config);
server.listen();
```

## MCP Resources

### Generator Resources

Access metadata for any generator:

```
generator://ingest-generator
generator://prep-clean-generator
generator://autodimensions-generator
generator://autocube-generator
generator://oesnn-generator
... (12 total)
```

Example response:
```json
{
  "generatorId": "autodimensions-generator",
  "name": "AutoDimensions Generator",
  "description": "Intelligent dimension and metric detection (4-pass algorithm)",
  "endpoint": "http://localhost:8080/api/v1/generators/autodimensions-generator",
  "inputSchema": {...},
  "outputSchema": {...},
  "gpuRequired": true,
  "llmRequired": false,
  "status": "healthy"
}
```

### LLM Resources

```
llm://data-engineering  - Data Engineering LLM (Phi-2)
llm://core-product      - Core Product LLM (Phi-3 Medium)
```

### Data Resources

```
data://checkpoints      - All workflow checkpoints
data://schema-catalog   - Gravitino schema catalog
```

## MCP Tools

### execute_generator

Execute a generator service:

```json
{
  "tool": "execute_generator",
  "parameters": {
    "generatorName": "autodimensions-generator",
    "inputData": {
      "dataframe": {...},
      "columns": [...]
    },
    "parameters": {
      "force_dimensions": ["user_id", "timestamp"],
      "cardinality_threshold": 100
    },
    "parentCheckpointId": "cp_123"
  }
}
```

### create_checkpoint

Create a workflow checkpoint:

```json
{
  "tool": "create_checkpoint",
  "parameters": {
    "stageName": "autodimensions",
    "data": {...},
    "parentCheckpointId": "cp_122",
    "metadata": {
      "qualityScore": 0.92
    }
  }
}
```

### classify_intent

Classify KPI intent using Core Product LLM:

```json
{
  "tool": "classify_intent",
  "parameters": {
    "kpiDefinition": {
      "name": "Monthly Revenue by Region",
      "type": "aggregation",
      "metrics": [
        {"name": "revenue", "aggregation": "sum"}
      ],
      "dimensions": ["region", "date.month"]
    }
  }
}
```

### fork_workflow

Fork a workflow from a checkpoint:

```json
{
  "tool": "fork_workflow",
  "parameters": {
    "checkpointId": "cp_123",
    "branchName": "aggressive_detection",
    "ruleModifications": {
      "cardinality_threshold": 50
    }
  }
}
```

### compare_checkpoints

Compare two checkpoints:

```json
{
  "tool": "compare_checkpoints",
  "parameters": {
    "checkpoint1Id": "cp_123",
    "checkpoint2Id": "cp_124"
  }
}
```

### list_generators

List all available generators:

```json
{
  "tool": "list_generators",
  "parameters": {
    "filterByCapability": "gpu-required"
  }
}
```

## Integration with AutoGen

The MCP server is designed to work seamlessly with AutoGen agents:

```python
from autogen import AssistantAgent
from dataportal_agents import create_mcp_enabled_agent, MCPClient

# Connect to MCP server
mcp_client = MCPClient("http://localhost:3000")

# Create agent with MCP tools
agent = create_mcp_enabled_agent(
    name="generator-orchestrator",
    system_message="You orchestrate DataPortal generators via MCP tools",
    mcp_client=mcp_client
)

# Agent can now call MCP tools
agent.initiate_chat(
    user_proxy,
    message="Execute ingest generator and then prep-clean generator"
)
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Deployment

### Tier 1 (Cloud - Kubernetes)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: mcp-server
        image: alembic/mcp-server:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: GENERATOR_SERVICE_ENDPOINT
          value: "http://generator-services:8080"
```

### Tier 2 (Appliance - Docker Compose)

```yaml
services:
  mcp-server:
    image: alembic/mcp-server:1.0.0
    ports:
      - "3000:3000"
    environment:
      - GENERATOR_SERVICE_ENDPOINT=http://host.docker.internal:8080
      - LOCAL_MODE=true
```

### Tier 3 (Laptop - Local)

```bash
npm install
npm run start
```

## Architecture Decisions

### Why MCP?

1. **Standardized Protocol**: MCP provides a standardized interface for AI tools
2. **Extensibility**: Third parties can integrate via MCP without modifying DataPortal
3. **Discoverability**: Resources and tools are self-describing
4. **Security**: Centralized permission and authentication model

### Generator Registration

All 12 generators are registered as MCP resources, making them automatically discoverable by AutoGen agents and other MCP clients.

### Checkpoint Integration

Checkpoints are first-class resources in MCP, enabling agents to:
- Create checkpoints at any stage
- Fork workflows for A/B testing
- Compare results across branches
- Rollback to previous states

## Related Documentation

- [MCP + AutoGen Agentic Layer Architecture](../../../data-products-enhancement-plan/MCP_AUTOGEN_AGENTIC_LAYER.md)
- [DataPortal PRD](../../../data-products-enhancement-plan/DataPortal_PRD.md)
- [Theia DataPortal Architecture](../../../data-products-enhancement-plan/THEIA_DATAPORTAL_ARCHITECTURE.md)

## License

Proprietary - Alembic Technologies, Inc.


