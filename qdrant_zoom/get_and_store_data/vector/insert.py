import json
import os
import uuid
import base64
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import warnings
from qdrant_client.http.exceptions import ResponseHandlingException
import time
import openai
import logging
from openai import OpenAI

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

warnings.filterwarnings('ignore', category=FutureWarning)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
if not openai_client.api_key:
    logging.error("OPENAI_API_KEY is not set in the environment variables")
    raise ValueError("OPENAI_API_KEY is not set")

# Initialize Qdrant client
qdrant_url = os.getenv('QDRANT_URL')
qdrant_api_key = os.getenv('QDRANT_API_KEY')

logging.info(f"QDRANT_URL = {qdrant_url}")
logging.info(f"QDRANT_API_KEY = {qdrant_api_key[:5]}..." if qdrant_api_key else "QDRANT_API_KEY is not set")

if not qdrant_url or not qdrant_api_key:
    logging.error("QDRANT_URL or QDRANT_API_KEY environment variables are not set")
    raise ValueError("QDRANT_URL or QDRANT_API_KEY environment variables are not set")

try:
    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    logging.info("QdrantClient initialized successfully")
except Exception as e:
    logging.error(f"Error initializing QdrantClient: {str(e)}")
    raise

# Define collection name
collection_name = "shake23"

def ensure_collection_exists():
    try:
        collections = qdrant_client.get_collections().collections
        logging.info(f"Successfully connected to Qdrant Cloud. Found {len(collections)} collections.")
        
        collection_names = [collection.name for collection in collections]
        if collection_name not in collection_names:
            logging.info(f"Collection '{collection_name}' does not exist. Creating it now...")
            qdrant_client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )
            logging.info(f"Collection '{collection_name}' created successfully.")
        else:
            logging.info(f"Collection '{collection_name}' already exists.")
        
    except ResponseHandlingException as e:
        logging.error(f"Failed to connect to Qdrant Cloud: {e}")
        logging.error(f"Host: {qdrant_url}")
        raise
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        raise

def load_data(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def base64_to_uuid(base64_string):
    try:
        # Remove any padding and convert to bytes
        base64_string = base64_string.rstrip('=')
        byte_string = base64.urlsafe_b64decode(base64_string + '=='*(-len(base64_string) % 4))
        
        # Convert bytes to UUID
        return str(uuid.UUID(bytes=byte_string[:16]))
    except:
        # If conversion fails, generate a new UUID
        return str(uuid.uuid4())

def insert_with_retry(client, collection_name, points, max_retries=3, initial_delay=1):
    for attempt in range(max_retries):
        try:
            client.upsert(collection_name=collection_name, points=points)
            print(f"Successfully inserted {len(points)} points")
            return True
        except Exception as e:
            if attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)
                print(f"Insertion failed. Retrying in {delay} seconds... Error: {str(e)}")
                time.sleep(delay)
            else:
                print(f"Failed to insert data after {max_retries} attempts. Error: {str(e)}")
                return False

def insert_data_to_qdrant(data):
    try:
        points = []
        for i, recording in enumerate(data.get('recordings', [])):
            summary = recording.get('summary', {})
            if isinstance(summary, dict):
                summary_text = summary.get('summary_overview', recording.get('topic', ''))
            else:
                summary_text = recording.get('topic', '')

            if not summary_text:
                summary_text = "No summary or topic available"

            try:
                # Get embedding from OpenAI
                response = openai_client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=summary_text
                )
                vector = response.data[0].embedding
            except Exception as e:
                logging.error(f"Error getting embedding for recording {i}: {str(e)}")
                continue

            point_id = base64_to_uuid(recording['uuid'])

            logging.info(f"Preparing point for recording {i + 1}:")
            logging.info(f"  UUID: {point_id}")
            logging.info(f"  Topic: {recording['topic']}")
            logging.info(f"  Summary text: {summary_text}")
            logging.info(f"  Vector size: {len(vector)}")

            point = PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    'topic': recording['topic'],
                    'start_time': recording['start_time'],
                    'duration': recording['duration'],
                    'summary': summary if isinstance(summary, dict) else {}
                }
            )
            points.append(point)

        if points:
            logging.info(f"Total points prepared for insertion: {len(points)}")
            response = insert_with_retry(qdrant_client, collection_name, points)
            logging.info(f"Qdrant response: {response}")
            logging.info(f"Inserted {len(points)} points into Qdrant.")
        else:
            logging.warning("No valid points to insert.")

        # Verify insertion
        collection_info = qdrant_client.get_collection(collection_name)
        logging.info(f"Collection info after insertion: {collection_info}")

    except Exception as e:
        logging.error(f"Error inserting data to Qdrant: {e}")
        raise

if __name__ == "__main__":
    try:
        ensure_collection_exists()
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        data_dir = os.path.join(project_root, 'data')

        for file_name in os.listdir(data_dir):
            if file_name.endswith('.txt'):
                file_path = os.path.join(data_dir, file_name)
                logging.info(f"Processing file: {file_path}")
                data = load_data(file_path)
                insert_data_to_qdrant(data)

        logging.info("Data insertion complete.")
    except Exception as e:
        logging.error(f"An error occurred during data insertion: {str(e)}")
        raise