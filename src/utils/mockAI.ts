export interface GenerateRequest {
  category: string;
  tone?: string;
  prompt?: string;
}

const mockLines = {
  taglines: {
    funny: [
      "We put the 'fun' in dysfunctional!",
      "Making mistakes since day one, and we're proud of it!",
      "Your problems are our opportunities... to laugh!",
      "We're not just a company, we're a comedy show!",
      "Failing forward, one joke at a time!"
    ],
    corporate: [
      "Innovating tomorrow's solutions today",
      "Excellence through strategic partnerships",
      "Transforming challenges into opportunities",
      "Your success is our commitment",
      "Building bridges to the future"
    ],
    bold: [
      "Dare to be different. Dare to be you.",
      "Break the rules. Create your own.",
      "Revolution starts with a single step.",
      "Be the change you want to see.",
      "Unstoppable. Unbreakable. Unlimited."
    ],
    minimalist: [
      "Simply better.",
      "Less is more.",
      "Pure. Simple. Perfect.",
      "Essence over excess.",
      "Clarity through simplicity."
    ]
  },
  bios: {
    funny: [
      "Professional procrastinator and part-time superhero 🦸‍♀️",
      "I put the 'pro' in procrastination and 'amateur' in everything else",
      "Living proof that you can't have everything... but you can try!",
      "Full-time dreamer, part-time realist, always optimistic",
      "Collecting moments and memes in equal measure"
    ],
    corporate: [
      "Strategic leader with 10+ years driving innovation and growth",
      "Passionate about building teams and delivering exceptional results",
      "Digital transformation expert | Speaker | Thought leader",
      "Helping businesses scale through technology and leadership",
      "Committed to excellence and continuous improvement"
    ],
    romantic: [
      "Believer in love stories and happily ever afters 💕",
      "Finding magic in everyday moments with my favorite person",
      "Love is my superpower and kindness is my language",
      "Creating beautiful memories one day at a time",
      "Heart full of dreams and eyes full of stars ✨"
    ]
  },
  captions: {
    funny: [
      "When life gives you lemons, make a TikTok about it 🍋",
      "Currently accepting applications for a personal chef",
      "My wifi went down for 5 minutes so I had to talk to my family",
      "I'm not lazy, I'm on energy-saving mode",
      "Professional over-thinker and snack enthusiast"
    ],
    bold: [
      "Not everyone will understand your journey. That's okay. It's not for them. 🔥",
      "Your only limit is your mind. Break free. Rise up. Conquer.",
      "Stop wishing. Start doing. Your dreams are waiting.",
      "Be fearless in the pursuit of what sets your soul on fire",
      "The world needs your unique magic. Don't hide it."
    ]
  },
  quotes: {
    inspirational: [
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Your current situation is not your final destination.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only impossible journey is the one you never begin.",
      "Believe you can and you're halfway there."
    ],
    motivational: [
      "Champions aren't made in the comfort zone.",
      "Your dreams don't work unless you do.",
      "Fall seven times, stand up eight.",
      "The pain you feel today is the strength you feel tomorrow.",
      "Don't watch the clock; do what it does. Keep going."
    ]
  },
  slogans: {
    corporate: [
      "Excellence in every detail",
      "Where innovation meets execution",
      "Your vision, our expertise",
      "Beyond expectations, every time",
      "Quality that speaks for itself"
    ],
    bold: [
      "Unleash your potential",
      "Power your possibilities",
      "Dare to be extraordinary",
      "Fuel your ambition",
      "Ignite your passion"
    ]
  },
  adlines: {
    funny: [
      "So good, even your mother-in-law will approve!",
      "Warning: May cause excessive happiness and impulse buying",
      "The only thing missing is you (and maybe some common sense)",
      "Side effects may include: smiling, laughing, and looking fabulous",
      "Not responsible for sudden urges to dance in public"
    ],
    corporate: [
      "Discover the difference quality makes",
      "Experience excellence like never before",
      "Where professional meets personal",
      "Your success story starts here",
      "Invest in your future today"
    ]
  }
};

export const generateLines = async (request: GenerateRequest): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { category, tone = 'corporate', prompt } = request;
  
  // Get appropriate mock lines
  const categoryLines = mockLines[category as keyof typeof mockLines];
  if (!categoryLines) {
    return ["Sorry, I couldn't generate lines for that category."];
  }
  
  const toneLines = categoryLines[tone as keyof typeof categoryLines];
  if (!toneLines) {
    // Fallback to first available tone
    const firstTone = Object.keys(categoryLines)[0];
    const fallbackLines = categoryLines[firstTone as keyof typeof categoryLines];
    return fallbackLines.slice(0, 3);
  }
  
  // If there's a custom prompt, add some variation
  if (prompt && prompt.length > 0) {
    const customLines = toneLines.map(line => {
      // Simple prompt integration (in real app, this would be AI-generated)
      if (Math.random() > 0.5) {
        return line.replace(/\b(we|our|you|your)\b/gi, prompt.toLowerCase());
      }
      return line;
    });
    return customLines.slice(0, 4);
  }
  
  // Return 3-4 random lines from the tone category
  const shuffled = [...toneLines].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(4, shuffled.length));
};