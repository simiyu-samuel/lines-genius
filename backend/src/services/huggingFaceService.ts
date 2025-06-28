import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

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
}

// Hugging Face API configuration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Model selection for different tasks
const MODELS = {
  text_generation: 'gpt2', // Free and reliable
  creative_writing: 'microsoft/DialoGPT-medium',
  business_text: 'distilgpt2'
};

// Category-specific prompts for better results
const categoryPrompts = {
  taglines: {
    description: "business taglines and slogans",
    examples: "Just Do It, Think Different, Have It Your Way",
    instructions: "Create memorable, concise taglines that capture brand essence"
  },
  bios: {
    description: "social media bio descriptions",
    examples: "Creative • Dreamer • Doer, Making magic happen ✨",
    instructions: "Write engaging, personality-driven bios for social profiles"
  },
  captions: {
    description: "Instagram and social media captions",
    examples: "Living my best life, Mood: Unstoppable",
    instructions: "Generate engaging captions that encourage interaction"
  },
  quotes: {
    description: "inspirational and motivational quotes",
    examples: "Be the change you wish to see, Dream big, work hard",
    instructions: "Create uplifting quotes that inspire and motivate"
  },
  slogans: {
    description: "marketing slogans and advertising phrases",
    examples: "Quality you can trust, Innovation at its finest",
    instructions: "Develop catchy marketing slogans that sell products/services"
  },
  adlines: {
    description: "advertising lines and jingles",
    examples: "Get ready to be amazed, The best just got better",
    instructions: "Write memorable advertising lines that stick in people's minds"
  }
};

// Tone-specific modifiers
const toneModifiers = {
  funny: "Make it humorous, witty, and entertaining. Use clever wordplay and light humor.",
  corporate: "Keep it professional, trustworthy, and business-appropriate. Focus on reliability and expertise.",
  bold: "Make it powerful, confident, and attention-grabbing. Use strong, impactful language.",
  romantic: "Make it warm, loving, and emotionally appealing. Focus on feelings and connections.",
  minimalist: "Keep it simple, clean, and elegant. Use fewer words with maximum impact.",
  inspirational: "Make it uplifting, motivating, and encouraging. Focus on positive transformation.",
  motivational: "Make it energizing, action-oriented, and empowering. Inspire people to take action."
};

// Fallback lines for when API fails
const fallbackLines = {
  taglines: {
    corporate: [
      "Excellence in every detail",
      "Building tomorrow's solutions",
      "Trusted by millions",
      "Quality you can count on"
    ],
    bold: [
      "Unleash your potential",
      "Break through barriers",
      "Dominate your market",
      "Lead the revolution"
    ],
    funny: [
      "We're not perfect, but we're close",
      "Saving the world, one customer at a time",
      "Because good enough isn't good enough",
      "Making magic happen since forever"
    ]
  },
  bios: {
    corporate: [
      "Professional • Leader • Innovator",
      "Building the future, one project at a time",
      "Strategic thinker with a passion for results",
      "Dedicated to excellence in everything I do"
    ],
    bold: [
      "Dreamer • Doer • Game Changer",
      "Making waves and breaking rules",
      "Unstoppable force of nature",
      "Living life on my own terms"
    ]
  },
  captions: {
    corporate: [
      "Another day, another opportunity to excel",
      "Building success one step at a time",
      "Professional growth never stops",
      "Focused on the bigger picture"
    ],
    bold: [
      "Living my best life, no apologies",
      "Making it happen, every single day",
      "Unstoppable and unapologetic",
      "This is what success looks like"
    ]
  }
};

// Make API call to Hugging Face
async function callHuggingFaceAPI(prompt: string): Promise<string> {
  if (!HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  try {
    const response = await fetch(`${HUGGINGFACE_API_URL}/${MODELS.text_generation}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.8,
          top_p: 0.9,
          do_sample: true,
          num_return_sequences: 1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    }
    
    throw new Error('Invalid response format from Hugging Face API');
  } catch (error) {
    logger.error('Hugging Face API call failed:', error);
    throw error;
  }
}

export const generateLinesWithHuggingFace = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const { category, tone = 'corporate', prompt, count = 4 } = request;

  try {
    // Check if Hugging Face API key is available
    if (!HUGGINGFACE_API_KEY) {
      logger.warn('Hugging Face API key not configured, using fallback lines');
      return await generateFallbackLines(request);
    }

    // Get category-specific information
    const categoryInfo = categoryPrompts[category as keyof typeof categoryPrompts];
    if (!categoryInfo) {
      throw new AppError(`Unsupported category: ${category}`, 400);
    }

    // Get tone modifier
    const toneModifier = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.corporate;

    // Build the prompt
    let systemPrompt = `Generate ${count} creative ${categoryInfo.description} with a ${tone} tone. ${toneModifier}. Examples: ${categoryInfo.examples}`;
    
    if (prompt && prompt.trim()) {
      systemPrompt += ` Context: ${prompt.trim()}`;
    }

    logger.info(`Making Hugging Face API call for category: ${category}, tone: ${tone}, count: ${count}`);

    // Make API call
    const generatedText = await callHuggingFaceAPI(systemPrompt);
    
    // Parse the response into individual lines
    const lines = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.match(/^\d+\.?\s/)) // Remove numbered lines
      .map(line => line.replace(/^["']|["']$/g, '')) // Remove quotes
      .slice(0, count); // Ensure we don't exceed requested count

    // If we didn't get enough lines from API, supplement with fallback
    if (lines.length < count) {
      const fallbackResult = await generateFallbackLines(request);
      const additionalLines = fallbackResult.lines.slice(0, count - lines.length);
      lines.push(...additionalLines);
    }

    logger.info(`Generated ${lines.length} lines using Hugging Face for category: ${category}, tone: ${tone}`);

    return {
      lines: lines.slice(0, count),
      usage: {
        prompt_tokens: systemPrompt.length,
        completion_tokens: generatedText.length,
        total_tokens: systemPrompt.length + generatedText.length
      }
    };

  } catch (error) {
    logger.error('Hugging Face generation error:', error);
    
    // Fall back to template lines if API fails
    logger.info('Falling back to template lines due to API error');
    return await generateFallbackLines(request);
  }
};

// Generate fallback lines using templates
async function generateFallbackLines(request: GenerateRequest): Promise<GenerateResponse> {
  const { category, tone = 'corporate', count = 4 } = request;

  const categoryFallback = fallbackLines[category as keyof typeof fallbackLines];
  const toneFallback = categoryFallback?.[tone as keyof typeof categoryFallback];
  
  if (toneFallback) {
    // Shuffle and return requested number of lines
    const shuffled = [...toneFallback].sort(() => Math.random() - 0.5);
    const lines = shuffled.slice(0, count);
    
    logger.info(`Generated ${lines.length} fallback lines for category: ${category}, tone: ${tone}`);
    
    return {
      lines,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }

  // Generic fallback if category/tone not found
  const genericLines = [
    "Innovation at its finest",
    "Quality you can trust",
    "Excellence in every detail",
    "Building the future today"
  ];

  logger.info(`Generated ${count} generic fallback lines`);
  
  return {
    lines: genericLines.slice(0, count),
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
}

// Function to test Hugging Face connection
export const testHuggingFaceConnection = async (): Promise<boolean> => {
  try {
    if (!HUGGINGFACE_API_KEY) {
      logger.warn('Hugging Face API key not configured');
      return false;
    }

    const response = await generateLinesWithHuggingFace({
      category: 'taglines',
      tone: 'corporate',
      count: 1
    });
    return response.lines.length > 0;
  } catch (error) {
    logger.error('Hugging Face connection test failed:', error);
    return false;
  }
}; 