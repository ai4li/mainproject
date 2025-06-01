import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import openai
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the backend directory to the Python path
backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from personas import PERSONAS, DEFAULT_PERSONA
from config import AVAILABLE_MODELS, OPENAI_API_KEY, OPENAI_BASE_URL

class ChatService:
    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.base_url = OPENAI_BASE_URL
        logger.info(f"Initializing ChatService with base_url: {self.base_url}")
        logger.info(f"API Key present: {'Yes' if self.api_key else 'No'}")
        
        # Initialize OpenAI client with OpenRouter headers
        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
            default_headers={
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Mindful Companion"
            }
        )
        self.history: List[Dict[str, Any]] = []
        self.current_persona = DEFAULT_PERSONA
        self.available_models = AVAILABLE_MODELS
        self.current_model = AVAILABLE_MODELS[0]  # Set first model as default

    def set_model(self, model: str) -> bool:
        if model in self.available_models:
            self.current_model = model
            return True
        return False

    def get_available_models(self) -> List[str]:
        return self.available_models

    def get_current_model(self) -> str:
        return self.current_model

    def set_persona(self, persona_id: str) -> bool:
        if persona_id in PERSONAS:
            self.current_persona = persona_id
            return True
        return False

    def get_current_persona(self) -> str:
        return self.current_persona

    def get_personas(self) -> Dict[str, Dict[str, str]]:
        return {
            key: {"name": value["name"], "description": value["description"]}
            for key, value in PERSONAS.items()
        }

    def add_message(self, role: str, content: str) -> None:
        self.history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().timestamp()
        })

    def clear_history(self) -> None:
        self.history = []

    def get_history(self) -> List[Dict[str, Any]]:
        return self.history

    def generate_response(self, message: str, model: Optional[str] = None) -> Dict[str, Any]:
        # Add user message to history
        self.add_message("user", message)
        
        # Use provided model or current model
        model_to_use = model if model else self.current_model
        
        # Get system message for current persona
        system_message = PERSONAS[self.current_persona]["system_message"]
        logger.info(f"Using persona: {self.current_persona}")
        logger.info(f"System prompt: {system_message}")
        
        # Prepare messages for API call
        messages = [
            {"role": "system", "content": system_message}
        ]
        
        # Add history messages
        for msg in self.history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000
            )
            
            # Log the response
            logger.info(f"API Response: {response}")
            
            # Check if the response is None
            if response is None:
                logger.error("Received None response from OpenRouter API.")
                return {
                    "error": "Error: No response from the API.",
                    "history": self.history
                }
            
            # Extract response content
            response_content = response.choices[0].message.content
            
            # Add assistant message to history
            self.add_message("assistant", response_content)
            
            return {
                "message": response_content,
                "history": self.history
            }
            
        except Exception as e:
            error_message = f"Error generating response: {str(e)}"
            logger.error(error_message)
            return {
                "error": error_message,
                "history": self.history
            } 
        
    def stream_response(self, message: str, model: Optional[str] = None):
        self.add_message("user", message)
        model_to_use = model if model else self.current_model
        system_message = PERSONAS[self.current_persona]["system_message"]

        messages = [{"role": "system", "content": system_message}] + self.history

        try:
            response = self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000
            )

            full_response = ""
            for chunk in response:
                # Depending on the client used, adjust access path
                delta = chunk.choices[0].delta
                if hasattr(delta, "content") and delta.content:
                    token = delta.content
                    full_response += token
                    yield token  # Yield each token to the frontend

            self.add_message("assistant", full_response)

        except Exception as e:
            logger.error(f"Error during streaming: {str(e)}")
            yield f"[Error] {str(e)}"
