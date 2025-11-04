/**
 * Schema Registry Client
 * Communicates with Gravitino for schema catalog operations
 */

import axios, { AxiosInstance } from 'axios';

export interface SchemaDefinition {
    schemaName: string;
    tables: Array<{
        tableName: string;
        columns: Array<{
            name: string;
            dataType: string;
            nullable: boolean;
        }>;
    }>;
}

export class SchemaRegistry {
    private client: AxiosInstance;
    private gravitinoUrl: string;

    constructor(gravitinoUrl: string) {
        this.gravitinoUrl = gravitinoUrl;
        this.client = axios.create({
            baseURL: gravitinoUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * List all schemas in catalog
     */
    async listSchemas(): Promise<SchemaDefinition[]> {
        try {
            const response = await this.client.get('/api/metalakes/dataportal/catalogs/data_products/schemas');
            return response.data.schemas || [];
        } catch (error) {
            console.warn('Failed to list schemas from Gravitino:', error);
            // Return empty array if Gravitino unavailable
            return [];
        }
    }

    /**
     * Query schemas with filters
     */
    async query(query: Record<string, any>): Promise<SchemaDefinition[]> {
        const allSchemas = await this.listSchemas();
        
        let results = allSchemas;

        if (query.schemaName) {
            results = results.filter(s => s.schemaName === query.schemaName);
        }

        if (query.tablePattern) {
            results = results.map(s => ({
                ...s,
                tables: s.tables.filter(t => 
                    t.tableName.includes(query.tablePattern)
                )
            })).filter(s => s.tables.length > 0);
        }

        return results;
    }

    /**
     * Register a new dimension in schema catalog
     */
    async registerDimension(dimension: Record<string, any>): Promise<void> {
        try {
            await this.client.post(
                '/api/metalakes/dataportal/catalogs/data_products/schemas/mtl_dimensions/tables',
                {
                    name: `dim_${dimension.name}`,
                    columns: [{
                        name: dimension.name,
                        dataType: dimension.dataType,
                        nullable: false
                    }],
                    comment: dimension.description,
                    properties: {
                        dimension_type: dimension.dimensionType,
                        cardinality: dimension.cardinality
                    }
                }
            );
        } catch (error) {
            console.error('Failed to register dimension:', error);
        }
    }
}


