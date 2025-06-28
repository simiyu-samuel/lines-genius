import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

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

export const generateLines = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const { category, tone = 'corporate', prompt, count = 4 } = request;

  // Check if OpenAI API key is available
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  try {
    // Get category-specific information
    const categoryInfo = categoryPrompts[category as keyof typeof categoryPrompts];
    if (!categoryInfo) {
      throw new Error(`Unsupported category: ${category}`);
    }

    // Get tone modifier
    const toneModifier = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.corporate;

    // Build the prompt
    let systemPrompt = `You are a creative copywriter specializing in ${categoryInfo.description}. 

${categoryInfo.instructions}

Tone: ${toneModifier}

Examples of good ${categoryInfo.description}: ${categoryInfo.examples}

Rules:
- Generate exactly ${count} unique lines
- Each line should be on a separate line
- Don't number the lines
- Keep lines concise and impactful
- Make each line distinctly different
- Ensure lines match the specified tone
- Don't include quotes around the lines`;

    let userPrompt = `Generate ${count} creative ${categoryInfo.description} with a ${tone} tone.`;
    
    if (prompt && prompt.trim()) {
      userPrompt += ` Context/Requirements: ${prompt.trim()}`;
    }

    // Make the API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response into individual lines
    const lines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.match(/^\d+\.?\s/)) // Remove numbered lines
      .map(line => line.replace(/^["']|["']$/g, '')) // Remove quotes
      .slice(0, count); // Ensure we don't exceed requested count

    // Fallback if we didn't get enough lines
    if (lines.length === 0) {
      throw new Error('Failed to generate valid lines');
    }

    return {
      lines,
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      } : undefined
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key. Please check your configuration.');
      }
      if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
    }
    
    throw new Error('Failed to generate lines. Please try again.');
  }
};

// Function to test the OpenAI connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const response = await generateLines({
      category: 'taglines',
      tone: 'corporate',
      count: 1
    });
    return response.lines.length > 0;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
};