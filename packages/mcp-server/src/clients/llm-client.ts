/**
 * LLM Client
 * Communicates with Data Engineering LLM and Core Product LLM
 */

import axios, { AxiosInstance } from 'axios';

export interface LLMEndpoints {
    dataEngineering: string;
    coreProduct: string;
}

export interface IntentClassificationResult {
    primaryIntent: string;
    confidence: number;
    dimensionPriorities: string[];
    suggestedFilters: string[];
    suggestedGenerators: string[];
}

export interface KPIDefinition {
    name: string;
    type: string;
    metrics: Array<{
        name: string;
        aggregation: string;
    }>;
    dimensions: string[];
}

export class LLMClient {
    private dataEngClient: AxiosInstance;
    private coreProductClient: AxiosInstance;
    private cache: Map<string, any>;

    constructor(endpoints: LLMEndpoints) {
        this.dataEngClient = axios.create({
            baseURL: endpoints.dataEngineering,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.coreProductClient = axios.create({
            baseURL: endpoints.coreProduct,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.cache = new Map();
    }

    /**
     * Classify KPI intent using Core Product LLM
     */
    async classifyIntent(kpiDefinition: KPIDefinition): Promise<IntentClassificationResult> {
        // Check cache
        const cacheKey = this.getCacheKey('intent', kpiDefinition);
        if (this.cache.has(cacheKey)) {
            console.log('Intent classification cache hit');
            return this.cache.get(cacheKey);
        }

        const prompt = this.generateIntentPrompt(kpiDefinition);

        try {
            const response = await this.coreProductClient.post('/completions', {
                prompt,
                temperature: 0.0,
                max_tokens: 256
            });

            const result = this.parseIntentResponse(response.data.text);

            // Cache result
            this.cache.set(cacheKey, result);

            return result;
        } catch (error) {
            console.error('Intent classification failed:', error);
            // Return fallback classification
            return this.getFallbackIntentClassification(kpiDefinition);
        }
    }

    /**
     * Generate connector code using Data Engineering LLM
     */
    async generateConnector(sourceMetadata: Record<string, any>): Promise<string> {
        const prompt = this.generateConnectorPrompt(sourceMetadata);

        try {
            const response = await this.dataEngClient.post('/completions', {
                prompt,
                temperature: 0.1,
                max_tokens: 1024
            });

            return response.data.text;
        } catch (error) {
            console.error('Connector generation failed:', error);
            throw new Error('Failed to generate connector');
        }
    }

    /**
     * Normalize schema using Data Engineering LLM
     */
    async normalizeSchema(rawSchema: Record<string, any>): Promise<Record<string, any>> {
        const prompt = this.generateSchemaPrompt(rawSchema);

        try {
            const response = await this.dataEngClient.post('/completions', {
                prompt,
                temperature: 0.1,
                max_tokens: 512
            });

            return JSON.parse(response.data.text);
        } catch (error) {
            console.error('Schema normalization failed:', error);
            // Return minimally normalized schema
            return this.basicSchemaNormalization(rawSchema);
        }
    }

    /**
     * Generate intent classification prompt
     */
    private generateIntentPrompt(kpi: KPIDefinition): string {
        return `Given the following KPI definition, classify the analytical intent.

KPI: ${kpi.name}
Type: ${kpi.type}
Metrics: ${kpi.metrics.map(m => `${m.name} (${m.aggregation})`).join(', ')}
Dimensions: ${kpi.dimensions.join(', ')}

Available Intent Categories:
- TREND_ANALYSIS: Time-based pattern analysis
- COMPARATIVE_ANALYSIS: Cross-dimensional comparisons
- AGGREGATION_REPORTING: Summary statistics
- DRILL_DOWN_ANALYSIS: Hierarchical exploration
- ANOMALY_DETECTION: Outlier identification
- FORECASTING: Predictive analysis

Respond with JSON:
{
  "primary_intent": "<category>",
  "confidence": <0.0-1.0>,
  "dimension_priorities": ["dim1", "dim2"],
  "suggested_filters": [],
  "suggested_generators": ["generator1", "generator2"]
}`;
    }

    /**
     * Generate connector generation prompt
     */
    private generateConnectorPrompt(sourceMetadata: Record<string, any>): string {
        return `Generate a Python connector for the following data source:
- Type: ${sourceMetadata.type}
- Host: ${sourceMetadata.host}
- Port: ${sourceMetadata.port}
- Database: ${sourceMetadata.database}
- Schema: ${JSON.stringify(sourceMetadata.schema, null, 2)}

Requirements:
1. Use Polars for DataFrame operations
2. Implement connection pooling
3. Handle authentication securely
4. Include error handling and retries
5. Log connection events
6. Implement incremental load capability

Generate complete, production-ready code.`;
    }

    /**
     * Generate schema normalization prompt
     */
    private generateSchemaPrompt(rawSchema: Record<string, any>): string {
        return `Normalize the following schema:
${JSON.stringify(rawSchema, null, 2)}

Normalize column names to:
- Use snake_case
- Remove special characters
- Suggest semantic names based on patterns
- Identify primary keys and foreign keys
- Recommend data types

Respond with normalized schema JSON.`;
    }

    /**
     * Parse intent classification response
     */
    private parseIntentResponse(responseText: string): IntentClassificationResult {
        try {
            const parsed = JSON.parse(responseText);
            return {
                primaryIntent: parsed.primary_intent,
                confidence: parsed.confidence,
                dimensionPriorities: parsed.dimension_priorities || [],
                suggestedFilters: parsed.suggested_filters || [],
                suggestedGenerators: parsed.suggested_generators || []
            };
        } catch (error) {
            console.error('Failed to parse intent response:', error);
            throw new Error('Invalid intent classification response');
        }
    }

    /**
     * Fallback intent classification when LLM unavailable
     */
    private getFallbackIntentClassification(kpi: KPIDefinition): IntentClassificationResult {
        // Basic heuristic-based classification
        let primaryIntent = 'AGGREGATION_REPORTING';
        
        if (kpi.dimensions.some(d => d.includes('time') || d.includes('date'))) {
            primaryIntent = 'TREND_ANALYSIS';
        } else if (kpi.dimensions.length > 3) {
            primaryIntent = 'DRILL_DOWN_ANALYSIS';
        }

        return {
            primaryIntent,
            confidence: 0.5,
            dimensionPriorities: kpi.dimensions,
            suggestedFilters: [],
            suggestedGenerators: [
                'ingest-generator',
                'prep-clean-generator',
                'autodimensions-generator',
                'autocube-generator'
            ]
        };
    }

    /**
     * Basic schema normalization without LLM
     */
    private basicSchemaNormalization(rawSchema: Record<string, any>): Record<string, any> {
        const normalized: Record<string, any> = {};

        for (const [key, value] of Object.entries(rawSchema)) {
            // Convert to snake_case
            const normalizedKey = key
                .replace(/[^a-zA-Z0-9_]/g, '_')
                .replace(/([A-Z])/g, '_$1')
                .toLowerCase()
                .replace(/^_/, '');

            normalized[normalizedKey] = value;
        }

        return normalized;
    }

    /**
     * Generate cache key
     */
    private getCacheKey(operation: string, data: any): string {
        return `${operation}:${JSON.stringify(data)}`;
    }
}


