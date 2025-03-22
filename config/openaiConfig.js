import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_KEY,
  engine: 'gpt-4o',
  dangerouslyAllowBrowser: true, //WE NEED TO CHANGE THIS; ONLY FOR LOCAL DEV
});

export { openai };
