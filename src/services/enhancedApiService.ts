import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Exponential backoff retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    // Don't retry on 4xx errors (client errors)
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status >= 400 && status < 500 && status !== 429) {
        throw error;
      }
    }

    console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Exponential backoff with jitter
    const nextDelay = delay * 2 + Math.random() * 1000;
    return retryWithBackoff(fn, retries - 1, nextDelay);
  }
}

export { retryWithBackoff };
