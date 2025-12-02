import { linesAPI } from './apiService';
import { generateLinesFallback } from '../utils/mockAI';
import { retryWithBackoff } from './enhancedApiService';

export interface GenerateRequest {
  category: string;
  tone?: string;
  prompt?: string;
  count?: number;
}

export interface GenerateResponse {
  lines: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  service?: 'api' | 'fallback';
}

export const generateLines = async (request: GenerateRequest): Promise<GenerateResponse> => {
  try {
    // Try to use the backend API with retry logic
    const response = await retryWithBackoff(async () => {
      return await linesAPI.generate(request);
    });
    
    if (response.success && response.data?.lines) {
      console.log('✅ Generated lines using backend API');
      return {
        lines: response.data.lines,
        usage: response.data.usage,
        service: 'api'
      };
    } else {
      throw new Error(response.error || 'Failed to generate lines');
    }
  } catch (error: any) {
    console.warn('⚠️ Backend API failed after retries, falling back to mock AI:', error.message || error);
    
    // Fallback to mock AI if backend fails
    const fallbackLines = await generateLinesFallback(request);
    console.log('✅ Generated lines using fallback mock AI');
    return {
      lines: fallbackLines,
      usage: undefined, // No usage data from fallback
      service: 'fallback'
    };
  }
};

// Function to test the backend connection
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await generateLines({
      category: 'taglines',
      tone: 'corporate',
      count: 1
    });
    return response.lines.length > 0;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};