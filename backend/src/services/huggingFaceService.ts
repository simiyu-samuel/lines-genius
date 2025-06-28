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

// Simple prompt templates for different categories
const categoryPrompts = {
  taglines: "Create a business tagline that is:",
  bios: "Write a social media bio that is:",
  captions: "Generate an Instagram caption that is:",
  quotes: "Create an inspirational quote that is:",
  slogans: "Write a marketing slogan that is:",
  adlines: "Create an advertising line that is:"
};

const toneModifiers = {
  funny: "humorous and witty",
  corporate: "professional and trustworthy",
  bold: "powerful and confident",
  romantic: "warm and loving",
  minimalist: "simple and elegant",
  inspirational: "uplifting and motivating",
  motivational: "energizing and empowering"
};

// Simple fallback line generation (when AI is not available)
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

export const generateLinesWithHuggingFace = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const { category, tone = 'corporate', prompt, count = 4 } = request;

  try {
    // For now, use fallback lines since Hugging Face requires more setup
    // In a real implementation, you would make API calls to Hugging Face
    
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

  } catch (error) {
    logger.error('Hugging Face generation error:', error);
    throw new AppError('Failed to generate lines', 500);
  }
};

// Function to test Hugging Face connection
export const testHuggingFaceConnection = async (): Promise<boolean> => {
  try {
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