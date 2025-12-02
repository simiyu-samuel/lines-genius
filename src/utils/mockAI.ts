// Fallback mock AI for when OpenAI is not available
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
      "Failing forward, one joke at a time!",
      "Powered by coffee and questionable decisions",
      "We're not weird, we're limited edition",
      "Turning 'oops' into 'ta-da!' since forever",
      "Because normal is overrated",
      "Making the impossible... slightly less impossible"
    ],
    corporate: [
      "Innovating tomorrow's solutions today",
      "Excellence through strategic partnerships",
      "Transforming challenges into opportunities",
      "Your success is our commitment",
      "Building bridges to the future",
      "Where vision meets execution",
      "Empowering growth through innovation",
      "Delivering excellence, every single time",
      "Your trusted partner in success",
      "Pioneering the future of business"
    ],
    bold: [
      "Dare to be different. Dare to be you.",
      "Break the rules. Create your own.",
      "Revolution starts with a single step.",
      "Be the change you want to see.",
      "Unstoppable. Unbreakable. Unlimited.",
      "Defy expectations. Define success.",
      "Born to stand out, not fit in",
      "Challenge everything. Achieve anything.",
      "Fearless minds, limitless possibilities",
      "Rewrite the rules. Reshape the world."
    ],
    minimalist: [
      "Simply better.",
      "Less is more.",
      "Pure. Simple. Perfect.",
      "Essence over excess.",
      "Clarity through simplicity.",
      "Refined. Redefined.",
      "Elegance in simplicity.",
      "Nothing more. Nothing less.",
      "Pure essence.",
      "Simplified excellence."
    ],
    romantic: [
      "Where hearts meet dreams",
      "Love in every detail",
      "Creating moments that matter",
      "Your story, beautifully told",
      "Passion meets perfection",
      "Crafted with love, delivered with care",
      "Because every moment is precious",
      "Where magic becomes reality"
    ],
    inspirational: [
      "Dream bigger. Achieve greater.",
      "Your potential is limitless",
      "Believe in the power of you",
      "Transform your vision into reality",
      "Where dreams take flight",
      "Inspiring greatness, one step at a time",
      "Unlock your extraordinary",
      "Rise above. Reach beyond."
    ],
    motivational: [
      "Push harder. Go further.",
      "Your journey starts now",
      "Fuel your ambition",
      "Never settle. Always strive.",
      "Champions are made here",
      "Unleash your inner warrior",
      "Commit. Conquer. Celebrate.",
      "Sweat today. Shine tomorrow."
    ]
  },
  bios: {
    funny: [
      "Professional procrastinator and part-time superhero 🦸‍♀️",
      "I put the 'pro' in procrastination and 'amateur' in everything else",
      "Living proof that you can't have everything... but you can try!",
      "Full-time dreamer, part-time realist, always optimistic",
      "Collecting moments and memes in equal measure",
      "Certified overthinker with a PhD in making things complicated",
      "Sarcasm is my love language | Coffee is my fuel ☕",
      "Making questionable life choices since [birth year]",
      "Professional napper | Amateur adult | Expert snacker",
      "Living my best life... or at least trying to figure out what that means"
    ],
    corporate: [
      "Strategic leader with 10+ years driving innovation and growth",
      "Passionate about building teams and delivering exceptional results",
      "Digital transformation expert | Speaker | Thought leader",
      "Helping businesses scale through technology and leadership",
      "Committed to excellence and continuous improvement",
      "Executive leader | Innovation catalyst | Change agent",
      "Transforming organizations through strategic vision and execution",
      "Building high-performance teams that deliver measurable impact",
      "Tech entrepreneur | Investor | Mentor to emerging leaders",
      "Driving digital excellence across global markets"
    ],
    romantic: [
      "Believer in love stories and happily ever afters 💕",
      "Finding magic in everyday moments with my favorite person",
      "Love is my superpower and kindness is my language",
      "Creating beautiful memories one day at a time",
      "Heart full of dreams and eyes full of stars ✨",
      "Hopeless romantic with a passion for sunsets and soul connections",
      "Dancing through life with love as my compass 💫",
      "Collecting moments, not things | Love is the answer",
      "Writing our love story, one chapter at a time 📖",
      "Forever chasing sunsets and stealing kisses 🌅"
    ],
    bold: [
      "Unapologetically me | Breaking barriers | Making waves",
      "Fearless creator | Risk taker | Game changer",
      "Living loud, loving hard, leaving a legacy",
      "Not here to fit in | Here to stand out",
      "Rebel with a cause | Dreamer with a plan",
      "Disrupting the status quo, one day at a time",
      "Built different. Think different. Be different.",
      "Chasing dreams and catching them 🔥"
    ],
    minimalist: [
      "Less noise. More life.",
      "Simple living. Intentional being.",
      "Creator. Thinker. Minimalist.",
      "Living with purpose, not possessions.",
      "Simplicity is my luxury.",
      "Mindful moments. Meaningful connections.",
      "Less is everything.",
      "Curating life, not collecting it."
    ],
    inspirational: [
      "Inspiring others to discover their greatness ✨",
      "Motivational speaker | Life coach | Dream enabler",
      "Helping you unlock your unlimited potential",
      "Believer in the power of positive transformation",
      "Empowering minds, elevating lives, creating impact",
      "Your journey to greatness starts here 🌟",
      "Turning obstacles into opportunities since day one",
      "Spreading light, love, and limitless possibilities"
    ],
    motivational: [
      "Fitness enthusiast | Goal crusher | Life optimizer",
      "No excuses. No limits. Just results. 💪",
      "Training hard. Living harder. Winning always.",
      "Your only competition is who you were yesterday",
      "Sweat. Sacrifice. Success. Repeat.",
      "Building empires and breaking personal records",
      "Hustle in silence. Let success make the noise.",
      "Committed to the grind. Addicted to the results."
    ]
  },
  captions: {
    funny: [
      "When life gives you lemons, make a TikTok about it 🍋",
      "Currently accepting applications for a personal chef",
      "My wifi went down for 5 minutes so I had to talk to my family",
      "I'm not lazy, I'm on energy-saving mode",
      "Professional over-thinker and snack enthusiast",
      "Plot twist: I have no idea what I'm doing",
      "Confidence level: Kanye. Reality check: George Costanza.",
      "I followed my heart. It led me to the fridge.",
      "Trying to be a rainbow in someone's cloud... but mostly just a cloud",
      "Life status: Currently holding it together with coffee and sarcasm"
    ],
    bold: [
      "Not everyone will understand your journey. That's okay. It's not for them. 🔥",
      "Your only limit is your mind. Break free. Rise up. Conquer.",
      "Stop wishing. Start doing. Your dreams are waiting.",
      "Be fearless in the pursuit of what sets your soul on fire",
      "The world needs your unique magic. Don't hide it.",
      "They said I couldn't. So I did. Twice.",
      "Watch me turn my dreams into my reality",
      "Built different. Playing by my own rules.",
      "Success is my only option. Failure's not.",
      "Creating my own lane because the highway was too crowded"
    ],
    corporate: [
      "Excited to share our latest innovation with you",
      "Proud to announce another milestone achieved",
      "Collaboration drives innovation. Innovation drives success.",
      "Behind every great product is an even greater team",
      "Transforming challenges into opportunities, one project at a time",
      "Excellence isn't an act, it's a habit we practice daily",
      "Building the future, one solution at a time",
      "When passion meets purpose, magic happens"
    ],
    romantic: [
      "Every love story is beautiful, but ours is my favorite 💕",
      "You're my favorite notification",
      "Home is wherever I'm with you",
      "Falling in love with you every single day",
      "You're the reason I believe in magic ✨",
      "Together is my favorite place to be",
      "Love you to the moon and back... and then some",
      "You're my today and all of my tomorrows"
    ],
    minimalist: [
      "Less, but better.",
      "Simplicity speaks volumes.",
      "Finding beauty in the basics.",
      "Quality over quantity, always.",
      "Minimal things. Maximum life.",
      "Curated, not cluttered.",
      "Simple pleasures. Pure joy.",
      "Living intentionally."
    ],
    inspirational: [
      "Your vibe attracts your tribe ✨",
      "Bloom where you are planted",
      "Progress, not perfection",
      "Small steps every day lead to big changes",
      "You are capable of amazing things",
      "Believe in yourself and magic will happen",
      "The best project you'll ever work on is you",
      "Your potential is endless"
    ],
    motivational: [
      "No pain, no gain. No excuses, no limits. 💪",
      "Sweat now. Shine later.",
      "Your body can stand almost anything. It's your mind you have to convince.",
      "The only bad workout is the one that didn't happen",
      "Stronger than yesterday. Better than before.",
      "Champions train. Legends never stop.",
      "Push yourself because no one else will",
      "Results happen over time, not overnight"
    ]
  },
  quotes: {
    inspirational: [
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Your current situation is not your final destination.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only impossible journey is the one you never begin.",
      "Believe you can and you're halfway there.",
      "Stars can't shine without darkness.",
      "Every accomplishment starts with the decision to try.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "You are never too old to set another goal or to dream a new dream.",
      "What lies behind us and what lies before us are tiny matters compared to what lies within us."
    ],
    motivational: [
      "Champions aren't made in the comfort zone.",
      "Your dreams don't work unless you do.",
      "Fall seven times, stand up eight.",
      "The pain you feel today is the strength you feel tomorrow.",
      "Don't watch the clock; do what it does. Keep going.",
      "Success is the sum of small efforts repeated day in and day out.",
      "The harder you work for something, the greater you'll feel when you achieve it.",
      "Don't stop when you're tired. Stop when you're done.",
      "Wake up with determination. Go to bed with satisfaction.",
      "Your limitation—it's only your imagination."
    ],
    funny: [
      "I'm not arguing, I'm just explaining why I'm right.",
      "Life is short. Smile while you still have teeth.",
      "I'm not lazy, I'm on energy-saving mode.",
      "Common sense is like deodorant. The people who need it most never use it.",
      "I don't need a hair stylist, my pillow gives me a new hairstyle every morning.",
      "I'm not weird, I'm limited edition.",
      "Life is too short to be serious all the time. So, if you can't laugh at yourself, call me—I'll laugh at you.",
      "I'm not clumsy. The floor just hates me, the table and chairs are bullies, and the walls get in my way."
    ],
    corporate: [
      "Innovation distinguishes between a leader and a follower.",
      "The way to get started is to quit talking and begin doing.",
      "Success usually comes to those who are too busy to be looking for it.",
      "Opportunities don't happen. You create them.",
      "Don't be afraid to give up the good to go for the great.",
      "The secret of getting ahead is getting started.",
      "Quality is not an act, it is a habit.",
      "Excellence is not a destination; it is a continuous journey that never ends."
    ],
    bold: [
      "Be so good they can't ignore you.",
      "The only way to do great work is to love what you do.",
      "Don't wait for opportunity. Create it.",
      "Fortune favors the bold.",
      "Life begins at the end of your comfort zone.",
      "Be fearless in the pursuit of what sets your soul on fire.",
      "Great things never come from comfort zones.",
      "The biggest risk is not taking any risk."
    ],
    romantic: [
      "Love is not about how many days, months, or years you have been together. It's about how much you love each other every single day.",
      "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      "You are my today and all of my tomorrows.",
      "I love you not only for what you are, but for what I am when I am with you.",
      "Every love story is beautiful, but ours is my favorite.",
      "You're the reason I believe in love.",
      "Together is a wonderful place to be.",
      "I choose you. And I'll choose you over and over and over. Without pause, without a doubt, in a heartbeat. I'll keep choosing you."
    ],
    minimalist: [
      "Less is more.",
      "Simplicity is the ultimate sophistication.",
      "The ability to simplify means to eliminate the unnecessary so that the necessary may speak.",
      "Simplicity is the keynote of all true elegance.",
      "Live simply so that others may simply live.",
      "Simplify your life. You don't need all that stuff.",
      "The secret of happiness is not found in seeking more, but in developing the capacity to enjoy less.",
      "Minimalism is not a lack of something. It's simply the perfect amount of something."
    ]
  },
  slogans: {
    corporate: [
      "Excellence in every detail",
      "Where innovation meets execution",
      "Your vision, our expertise",
      "Beyond expectations, every time",
      "Quality that speaks for itself",
      "Trusted by leaders worldwide",
      "Building tomorrow's solutions today",
      "Your success is our mission",
      "Delivering results that matter",
      "Partnership you can count on"
    ],
    bold: [
      "Unleash your potential",
      "Power your possibilities",
      "Dare to be extraordinary",
      "Fuel your ambition",
      "Ignite your passion",
      "Break boundaries. Make history.",
      "Redefine what's possible",
      "Lead the revolution",
      "Unstoppable by design",
      "Born to dominate"
    ],
    funny: [
      "We're kind of a big deal",
      "Making awesome happen daily",
      "Seriously good. Seriously fun.",
      "Because boring is not an option",
      "We put the 'fun' in functional",
      "Ridiculously good at what we do",
      "Not your average anything",
      "Expect the unexpected"
    ],
    romantic: [
      "Love in every detail",
      "Where hearts meet dreams",
      "Crafted with love",
      "Your story, beautifully told",
      "Creating moments that last forever",
      "Because love matters",
      "Passion meets perfection",
      "Made with love, delivered with care"
    ],
    minimalist: [
      "Simply exceptional",
      "Less. Better.",
      "Pure essence",
      "Refined simplicity",
      "Nothing more. Nothing less.",
      "Elegantly simple",
      "Clarity by design",
      "Simplified excellence"
    ],
    inspirational: [
      "Dream bigger. Achieve greater.",
      "Inspiring greatness daily",
      "Where dreams take flight",
      "Unlock your extraordinary",
      "Believe. Achieve. Inspire.",
      "Empowering your journey",
      "Transform your tomorrow",
      "Your potential realized"
    ],
    motivational: [
      "Push harder. Go further.",
      "Never settle. Always strive.",
      "Champions are made here",
      "Fuel your fire",
      "Commit. Conquer. Celebrate.",
      "Unleash the beast within",
      "Train insane or remain the same",
      "Sweat today. Shine tomorrow."
    ]
  },
  adlines: {
    funny: [
      "So good, even your mother-in-law will approve!",
      "Warning: May cause excessive happiness and impulse buying",
      "The only thing missing is you (and maybe some common sense)",
      "Side effects may include: smiling, laughing, and looking fabulous",
      "Not responsible for sudden urges to dance in public",
      "Caution: Awesomeness ahead",
      "We're not saying we're magic, but have you ever seen us and a unicorn in the same room?",
      "Buy now, adult later",
      "Because you deserve nice things (and we have them)",
      "Your wallet called. It's ready to party."
    ],
    corporate: [
      "Discover the difference quality makes",
      "Experience excellence like never before",
      "Where professional meets personal",
      "Your success story starts here",
      "Invest in your future today",
      "Elevate your expectations",
      "The smart choice for smart businesses",
      "Innovation you can trust",
      "Results that speak for themselves",
      "Your competitive advantage awaits"
    ],
    bold: [
      "Don't just dream it. Own it.",
      "For those who refuse to settle",
      "Unleash your inner champion",
      "This is your moment. Seize it.",
      "Break free. Break through.",
      "Dare to be different",
      "Power moves only",
      "Built for the fearless",
      "Dominate your day",
      "Ordinary is not in our vocabulary"
    ],
    romantic: [
      "Love at first sight, guaranteed",
      "Make every moment magical",
      "Because love deserves the best",
      "Your perfect moment awaits",
      "Crafted with love, delivered with passion",
      "Where romance meets reality",
      "Create memories that last forever",
      "Love is in the details"
    ],
    minimalist: [
      "All you need. Nothing you don't.",
      "Simply perfect",
      "Less clutter. More life.",
      "Elegance redefined",
      "Pure. Simple. Yours.",
      "The art of less",
      "Refined to perfection",
      "Simplicity at its finest"
    ],
    inspirational: [
      "Your journey to greatness begins now",
      "Unlock your unlimited potential",
      "Transform your life today",
      "Believe in the power of you",
      "Your dreams are waiting",
      "Inspire. Aspire. Achieve.",
      "Greatness is within reach",
      "Start your transformation"
    ],
    motivational: [
      "No excuses. Just results.",
      "Push your limits. Exceed your goals.",
      "Train like a beast. Look like a beauty.",
      "Your only competition is yesterday's you",
      "Sweat is just fat crying",
      "Commit to be fit",
      "Strong is the new sexy",
      "Results guaranteed or your sweat back"
    ]
  }
};

export const generateLinesFallback = async (request: GenerateRequest): Promise<string[]> => {
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