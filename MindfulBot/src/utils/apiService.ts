/**
 * API service for communicating with the Python backend
 */

// Base URL for the backend API
// In production, you would use an environment variable for this
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for the response from the backend
interface ApiResponse {
  message: string;
  error?: string;
}

// Interface for the models response
interface ModelsResponse {
  models: string[];
  current_model: string;
}

/**
 * Send a message to the backend API and get a response
 * @param message The user's message
 * @param model The model to use for generating the response
 * @returns A promise that resolves to the API response
 */
export const sendMessageToBackend = async (
  message: string,
  model?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message to backend:', error);
    return {
      message: "I'm having trouble connecting to my backend. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Get the available models from the backend
 * @returns A promise that resolves to the models response
 */
export const getAvailableModels = async (): Promise<ModelsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    return {
      models: [],
      current_model: '',
    };
  }
};
