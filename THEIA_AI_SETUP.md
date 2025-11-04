# Theia AI Beta Setup Guide

This guide explains how to enable Theia AI beta features and connect to a local AI model using Ollama.

## Prerequisites

1. **Ollama installed and running locally**
   - Download from: https://ollama.ai/
   - Install and start Ollama service
   - Default host: `http://localhost:11434`

2. **Models available in Ollama**
   - Pull models using: `ollama pull <model-name>`
   - Popular models: `llama3`, `gemma2`, `mistral`, `phi3`, etc.
   - Verify: `ollama list`

## Configuration Steps

### Step 1: Enable Theia AI Beta

Theia AI features are disabled by default. You need to enable them through preferences.

**Option A: Via UI (Recommended)**
1. Open Theia IDE
2. Go to **File > Preferences** (or `Cmd+,` / `Ctrl+,`)
3. Navigate to **AI Features > AI Enablement**
4. Check the box for **"AI Enable"** (`ai-features.AiEnable.enableAI`)
5. Click **OK**

**Option B: Via settings.json**
Create or edit `.theia/settings.json` in your workspace root or user config directory:

```json
{
  "ai-features.AiEnable.enableAI": true
}
```

### Step 2: Configure Ollama

**Option A: Via UI (Recommended)**
1. In Preferences, navigate to **AI Features > Ollama**
2. Set **Ollama Host**: `http://localhost:11434` (default)
3. Add **Ollama Models**: List the models you have installed, e.g.:
   - `llama3`
   - `gemma2`
   - `mistral`
   - `phi3`
   - etc.

**Option B: Via settings.json**
Add to your `.theia/settings.json`:

```json
{
  "ai-features.AiEnable.enableAI": true,
  "ai-features.ollama.ollamaHost": "http://localhost:11434",
  "ai-features.ollama.ollamaModels": [
    "llama3",
    "gemma2"
  ]
}
```

## Complete Example Configuration

Create or update `.theia/settings.json` in your workspace:

```json
{
  // Enable AI Features (Beta)
  "ai-features.AiEnable.enableAI": true,

  // Ollama Configuration
  "ai-features.ollama.ollamaHost": "http://localhost:11434",
  "ai-features.ollama.ollamaModels": [
    "llama3",
    "gemma2",
    "mistral"
  ],

  // Optional: Configure model selection for different tasks
  "ai-features.languageModelAliases": {
    "default/code": {
      "selectedModel": "ollama/llama3"
    },
    "default/chat": {
      "selectedModel": "ollama/llama3"
    }
  },

  // Optional: Custom request settings
  "ai-features.modelSettings.requestSettings": [
    {
      "scope": {
        "providerId": "ollama"
      },
      "requestSettings": {
        "temperature": 0.7,
        "maxTokens": 2048
      }
    }
  ],

  // Optional: Maximum retries
  "ai-features.modelSettings.maxRetries": 3
}
```

## Verification

1. **Check Ollama is running:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Verify models are available:**
   ```bash
   ollama list
   ```

3. **Test a model:**
   ```bash
   ollama run llama3 "Hello, test"
   ```

4. **In Theia:**
   - Open **AI Configuration View** (Command Palette: `AI: Open AI Configuration`)
   - You should see your Ollama models listed under the "Ollama" provider
   - Select a model for use in AI features

## Using AI Features

Once configured, you can use:

1. **AI Chat**: Open chat panel and start conversations
2. **Code Completion**: AI-powered code suggestions
3. **AI Agents**: Configure and use AI agents for various tasks
4. **MCP Integration**: Use Model Context Protocol for advanced features

## Troubleshooting

### Ollama connection failed
- Verify Ollama is running: `ps aux | grep ollama` or check Ollama service
- Test connection: `curl http://localhost:11434/api/tags`
- Check firewall settings
- Try changing host to `127.0.0.1:11434` if `localhost` doesn't work

### Models not appearing
- Verify models are installed: `ollama list`
- Check model names match exactly (case-sensitive)
- Restart Theia after adding models
- Check Theia logs for errors

### AI features still disabled
- Verify `ai-features.AiEnable.enableAI` is set to `true`
- Restart Theia after changing preferences
- Check preference scope (workspace vs user)

### Performance issues
- Use smaller models for faster responses
- Adjust `maxTokens` in request settings
- Consider using quantized models (e.g., `llama3:8b-q4_0`)

## Alternative: OpenAI-Compatible Local Models

If you're running a local OpenAI-compatible API (e.g., vLLM, llama.cpp server), you can configure it using custom OpenAI models:

```json
{
  "ai-features.AiEnable.enableAI": true,
  "ai-features.openAiCustom.customOpenAiModels": [
    {
      "id": "local-phi3",
      "model": "phi-3-medium",
      "url": "http://localhost:8001/v1",
      "apiKey": "not-needed",
      "enableStreaming": true
    }
  ]
}
```

## References

- [Theia AI Documentation](https://theia-ide.org/docs/user_ai/)
- [Ollama Documentation](https://ollama.ai/docs)
- Theia Preferences: File > Preferences > AI Features

