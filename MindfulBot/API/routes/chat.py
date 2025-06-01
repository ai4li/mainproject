from flask import Blueprint, request, jsonify, Response, stream_with_context
import logging
from backend.services.chat_service import ChatService
from backend.config import AVAILABLE_MODELS, DEFAULT_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)
chat_service = ChatService()

@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return Response(status=200)
        
    data = request.json
    if not data or 'message' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing message in request body"
        }), 400

    try:
        logger.info(f"Received chat request with message: {data['message'][:50]}...")

        model = data.get('model', chat_service.get_current_model())
        logger.info(f"Using model: {model}")

        # Define streaming generator
        def generate():
            for token in chat_service.stream_response(
                message=data['message'],
                model=model
            ):
                yield token  # stream raw tokens

        return Response(stream_with_context(generate()), content_type='text/plain')

    except Exception as e:
        logger.error(f"Error in chat route: {str(e)}", exc_info=True)
        return jsonify({
            "message": "I'm having trouble connecting right now. Could you please try again?",
            "error": str(e)
        }), 500


@chat_bp.route('/models', methods=['GET'])
def get_models():
    return jsonify({
        "models": AVAILABLE_MODELS,
        "current_model": chat_service.get_current_model()
    })

@chat_bp.route('/set-model', methods=['POST'])
def set_model():
    data = request.json
    if not data or 'model' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing model in request body"
        }), 400
    
    logger.info(f"Setting model to: {data['model']}")
    if chat_service.set_model(data['model']):
        return jsonify({
            "message": "Model updated successfully",
            "current_model": chat_service.get_current_model()
        })
    else:
        return jsonify({
            "message": "Invalid model",
            "error": f"Model {data['model']} is not available"
        }), 400

@chat_bp.route('/clear-history', methods=['POST'])
def clear_history():
    chat_service.clear_history()
    return jsonify({
        "message": "Chat history cleared",
        "history": chat_service.get_history()
    })

@chat_bp.route('/personas', methods=['GET'])
def get_personas():
    return jsonify({
        "personas": chat_service.get_personas(),
        "current_persona": chat_service.get_current_persona()
    })

@chat_bp.route('/set-persona', methods=['POST'])
def set_persona():
    data = request.json
    if not data or 'persona' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing persona in request body"
        }), 400
    
    if chat_service.set_persona(data['persona']):
        return jsonify({
            "message": "Persona updated successfully",
            "current_persona": chat_service.get_current_persona()
        })
    else:
        return jsonify({
            "message": "Invalid persona",
            "error": f"Persona {data['persona']} is not available"
        }), 400

@chat_bp.route('/chat-advanced', methods=['POST', 'OPTIONS'])
def chat_advanced():
    if request.method == 'OPTIONS':
        return Response(status=200)
    data = request.json
    missing = [p for p in ['model', 'persona', 'message'] if p not in data]
    if missing:
        return jsonify({
            "message": "Invalid request format",
            "error": f"Missing parameter(s): {', '.join(missing)}"
        }), 400
    try:
        logger.info(f"Received chat-advanced request with message: {data['message'][:50]}... model: {data['model']}, persona: {data['persona']}")
        # Optionally set model and persona for this request
        chat_service.set_model(data['model'])
        chat_service.set_persona(data['persona'])
        def generate():
            for token in chat_service.stream_response(
                message=data['message'],
                model=data['model']
            ):
                yield token
        return Response(stream_with_context(generate()), content_type='text/plain')
    except Exception as e:
        logger.error(f"Error in chat-advanced route: {str(e)}", exc_info=True)
        return jsonify({
            "message": "I'm having trouble connecting right now. Could you please try again?",
            "error": str(e)
        }), 500 