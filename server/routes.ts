import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { storage } from './storage';
import {
  insertConversationSchema,
  insertMessageSchema,
  chatCompletionRequestSchema,
  type OpenRouterMessage,
} from '@shared/schema';
import { z } from 'zod';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations
  app.get('/api/conversations', async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });

  // Create new conversation
  app.post('/api/conversations', async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create conversation' });
      }
    }
  });

  // Get messages for a conversation
  app.get('/api/conversations/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Create new message
  app.post('/api/messages', async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create message' });
      }
    }
  });

  // Chat completion using Groq API
  app.post('/api/chat/completions', async (req, res) => {
    try {
      const { messages, conversationId } = chatCompletionRequestSchema.parse(
        req.body
      );

      // Debug: Log the incoming messages to see the format
      console.log('Received messages:', JSON.stringify(messages, null, 2));

      const openRouterApiKey = process.env.GROQ_API_KEY;
      if (!openRouterApiKey) {
        return res.status(500).json({ error: 'GROQ API key not configured' });
      }

      // Validate messages - ensure we have proper conversation flow
      if (messages.length === 0) {
        throw new Error('No messages provided');
      }

      // Check for consecutive user messages (which might be invalid)
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === 'user' && messages[i - 1].role === 'user') {
          console.warn('Warning: Consecutive user messages detected');
        }
      }

      console.log('Sending to Groq...');

      // Call OpenRouter API
      // https://openrouter.ai/api/v1/chat/completions
      // https://api.deepseek.com/v1/chat/completions
      const response = await fetch(`${process.env.GROQ_COMPLETIONS_URL}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // model: 'llama3-8b-8192', // Old Free model - no longer valid
          model: 'llama-3.1-8b-instant', // ✅ Use this instead
          // model: 'llama-3.2-1b-preview', // ✅ Alternative option
          // model: 'llama-3.2-3b-preview', // ✅ Another alternative
          // model: 'mixtral-8x7b-32768',   // ✅ Also available
          messages: messages,
          // stream: false,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      console.log('Groq response status:', response.status);
      console.log(
        'Groq response headers:',
        Object.fromEntries(response.headers.entries())
      );

      let aiMessage;

      if (!response.ok) {
        // Get the actual error message from Groq
        let errorBody;
        try {
          errorBody = await response.json();
          console.error(
            'Groq API error JSON:',
            JSON.stringify(errorBody, null, 2)
          );
        } catch (e) {
          errorBody = await response.text();
          console.error('Groq API error text:', errorBody);
        }

        // Properly stringify the error body
        const errorMessage =
          typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody);

        throw new Error(`Groq API error: ${response.status} - ${errorMessage}`);
      } else {
        const completion = await response.json();
        aiMessage = completion.choices[0].message;
      }

      // If conversationId is provided, save the AI response
      if (conversationId) {
        await storage.createMessage({
          conversationId,
          role: aiMessage.role,
          content: aiMessage.content,
        });
      }

      res.json(aiMessage);
    } catch (error) {
      console.error('Chat completion error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : 'Failed to process chat completion',
        });
      }
    }
  });

  // Delete conversation
  app.delete('/api/conversations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteConversation(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
