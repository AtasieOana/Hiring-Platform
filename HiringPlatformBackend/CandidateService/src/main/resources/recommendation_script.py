import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from langdetect import detect
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
from googletrans import Translator
import sys
import json
from bs4 import BeautifulSoup

# Downloading NLTK resources (runs only once)
nltk.download('stopwords')
nltk.download('punkt')
    
import numpy as np

# Function to calculate Jaccard similarity between two users
def jaccard_similarity(user1_jobs, user2_jobs):    
    # Extracts the job sets for each user
    user1_jobs_set = set(user1_jobs)
    user2_jobs_set = set(user2_jobs)
        
    # Computes the size of the intersection and union of sets
    intersection_size = len(user1_jobs_set.intersection(user2_jobs_set))
    union_size = len(user1_jobs_set.union(user2_jobs_set))
    
    # Avoid division by zero
    if union_size == 0:
        return 0.0
    
    # Calculates Jaccard similarity
    jaccard_similarity = intersection_size / union_size
    return jaccard_similarity


# Function for preprocessing a sentence
def preprocess_sentence(sentence):
    # Extract text from HTML
    soup = BeautifulSoup(sentence, "html.parser")
    text = soup.get_text()
    # Tokenize words
    words = nltk.word_tokenize(text, language='english', preserve_line=True)
    # Convert words to lowercase and remove punctuation
    words = [word.lower() for word in words if word not in string.punctuation]
    # Remove stopwords
    stopwords = set(nltk.corpus.stopwords.words('english'))
    words = [word for word in words if word not in stopwords]
    # Join processed words into a sentence
    preprocessed_sentence = ' '.join(words)
    # Remove remaining punctuation
    preprocessed_sentence = preprocessed_sentence.translate(str.maketrans('', '', string.punctuation))
    return preprocessed_sentence

# Function to translate text into English if needed
def translate_to_english(text, translator):
    # Split text into chunks of 5000 characters (adjust as needed)
    chunk_size = 5000
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

    translated_chunks = []
    for chunk in chunks:
        # Translate each chunk and append to the list
        translated_chunk = translator.translate(chunk, src='auto', dest='en').text
        translated_chunks.append(translated_chunk)

    # Join translated chunks into a single string
    translated_text = ''.join(translated_chunks)
    return translated_text

# Function to calculate content similarity between user description and job descriptions
def calculate_content_similarity(user_description, translated_job_descriptions,tfidf_vectorizer):
    preprocessed_user_description = preprocess_sentence(user_description)
    job_vectors = tfidf_vectorizer.fit_transform(translated_job_descriptions.values())
    user_vector = tfidf_vectorizer.transform([preprocessed_user_description])
    similarities = cosine_similarity(user_vector, job_vectors).flatten()
    return similarities

# Function for recommending jobs using combined filtering
def recommend_jobs_combined(user_id, application_data, job_descriptions):
    similar_users = {}
    user_jobs = application_data[user_id]

    # Calculation of similarity scores between the current user and other users
    for user, jobs in application_data.items():
        if user != user_id:
            similarity = jaccard_similarity(user_jobs, jobs)  # Using Jaccard Similarity
            similar_users[user] = similarity
    
    # Sort similar users by similarity scores
    similar_users = {k: v for k, v in sorted(similar_users.items(), key=lambda item: item[1], reverse=True)}
        
    # Concatenation of user application job descriptions
    user_description = ' '.join([job_descriptions.get(job_id, '') for job_id in user_jobs])
    translator = Translator()
    
    # Translation of the user description into English, if necessary
    translated_user_description = translate_to_english(user_description, translator)
    
    translated_job_descriptions = {}
    
    # Translation of job descriptions into English, if necessary
    for job_id, description in job_descriptions.items():
        if detect(description[:100]) != 'en':
            translated_job_descriptions[job_id] = translate_to_english(description, translator)
        else:
            translated_job_descriptions[job_id] = description
    
    # Calculating content similarity between user description and job descriptions
    tfidf_vectorizer = TfidfVectorizer()
    content_similarities = calculate_content_similarity(
        translated_user_description, translated_job_descriptions, tfidf_vectorizer
    )
 
    job_scores = {}

    # Calculation of the combined score for each job recommendation
    for job_id in job_descriptions.keys():
        if job_id not in user_jobs:
            job_index = list(job_descriptions.keys()).index(job_id)
            content_score = content_similarities[job_index]
            collaborative_score = 0

            # Calculating the collaborative filtering score
            for user, similarity in similar_users.items():
                if job_id in application_data[user]:
                    collaborative_score += similarity 
            # Combination of content-based and collaborative scoring
            combined_score = 0.5 * content_score + 0.5 * collaborative_score
            job_scores[job_id] = combined_score

    # Sort jobs by combined score
    recommended_jobs = sorted(job_scores, key=job_scores.get, reverse=True)
    return recommended_jobs

def main():
    # Reading arguments from standard input
    user_id = sys.stdin.readline().strip()  # Stripping newline characters
    application_data_json = sys.stdin.readline().strip()
    job_descriptions_json = sys.stdin.readline().strip()

    # Converting JSONs to Python dictionaries
    application_data = json.loads(application_data_json)
    job_descriptions = json.loads(job_descriptions_json)
    
    # Running recommendation logic
    recommended_jobs = recommend_jobs_combined(user_id, application_data, job_descriptions)
    print(recommended_jobs, flush=True)

if __name__ == "__main__":
    main()