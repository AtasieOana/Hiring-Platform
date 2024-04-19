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

# Descărcarea resurselor NLTK (execută o singură dată)
nltk.download('stopwords')
nltk.download('punkt')
    
import numpy as np

# Funcție pentru a calcula Jaccard similarity între doi utilizatori
def jaccard_similarity(user1_jobs, user2_jobs):    
    # Extrage seturile de joburi pentru fiecare utilizator
    user1_jobs_set = set(user1_jobs)
    user2_jobs_set = set(user2_jobs)
        
    # Calculează mărimea intersecției și a uniunii seturilor
    intersection_size = len(user1_jobs_set.intersection(user2_jobs_set))
    union_size = len(user1_jobs_set.union(user2_jobs_set))
    

    # Evită împărțirea la zero
    if union_size == 0:
        return 0.0
    
    # Calculează similaritatea Jaccard
    jaccard_similarity = intersection_size / union_size
    return jaccard_similarity


# Funcție pentru preprocesarea unei propoziții
def preprocess_sentence(sentence):
    words = nltk.word_tokenize(sentence, language='english', preserve_line=True)  # Tokenizarea propoziției în cuvinte
    words = [word.lower() for word in words if word not in string.punctuation]  # Eliminarea semnelor de punctuație și conversia în litere mici
    stopwords = set(nltk.corpus.stopwords.words('english'))  # Obținerea listei de stopwords în limba engleză
    words = [word for word in words if word not in stopwords]  # Eliminarea stopwords
    preprocessed_sentence = ' '.join(words)  # Reconstruirea propoziției preprocesate
    return preprocessed_sentence

# Funcție pentru traducerea textului în limba engleză, dacă este necesar
def translate_to_english(text, translator):
    translated_text = translator.translate(text).text
    return translated_text if detect(translated_text) == 'en' else text

# Funcție pentru calculul similarității de conținut între descrierea utilizatorului și descrierile joburilor
def calculate_content_similarity(user_description, translated_job_descriptions):
    preprocessed_user_description = preprocess_sentence(user_description)
    tfidf_vectorizer = TfidfVectorizer()
    job_vectors = tfidf_vectorizer.fit_transform(translated_job_descriptions.values())
    user_vector = tfidf_vectorizer.transform([preprocessed_user_description])
    similarities = cosine_similarity(user_vector, job_vectors).flatten()
    return similarities

# Funcție pentru recomandarea joburilor folosind filtrarea combinată
def recommend_jobs_combined(user_id, application_data, job_descriptions):
    similar_users = {}
    user_jobs = application_data[user_id]

    # Calculul scorurilor de similaritate între utilizatorul curent și ceilalți utilizatori
    # Calculul scorurilor de similaritate între utilizatorul curent și ceilalți utilizatori
    for user, jobs in application_data.items():
        if user != user_id:
            similarity = jaccard_similarity(user_jobs, jobs)  # Folosirea Jaccard Similarity
            similar_users[user] = similarity
    
    # Sortarea utilizatorilor similari în funcție de scorurile de similaritate
    similar_users = {k: v for k, v in sorted(similar_users.items(), key=lambda item: item[1], reverse=True)}

    
    # Concatenarea descrierilor de joburi ale aplicațiilor utilizatorului
    user_description = ' '.join([job_descriptions.get(job_id, '') for job_id in user_jobs])
    translator = Translator()

    # Traducerea descrierii utilizatorului în limba engleză, dacă este necesar
    translated_user_description = translate_to_english(user_description, translator)

    translated_job_descriptions = {}

    # Traducerea descrierilor joburilor în limba engleză, dacă este necesar
    for job_id, description in job_descriptions.items():
        if detect(description) != 'en':
            translated_job_descriptions[job_id] = translate_to_english(description, translator)
        else:
            translated_job_descriptions[job_id] = description

    # Calculul similarității de conținut între descrierea utilizatorului și descrierile joburilor
    content_similarities = calculate_content_similarity(translated_user_description, translated_job_descriptions)

    job_scores = {}

    # Calculul scorului combinat pentru fiecare recomandare de job
    for job_id in job_descriptions.keys():
        if job_id not in user_jobs:
            job_index = list(job_descriptions.keys()).index(job_id)
            content_score = content_similarities[job_index]
            collaborative_score = 0

            # Calculul scorului de filtrare colaborativă
            for user, similarity in similar_users.items():
                if job_id in application_data[user]:
                    collaborative_score += similarity  # Modificare pentru a utiliza similaritatea Pearson în loc de inversul ei
            # Combinația scorurilor bazate pe conținut și colaborative
            combined_score = 0.5 * content_score + 0.5 * collaborative_score
            job_scores[job_id] = combined_score

    # Sortarea joburilor în funcție de scorul combinat
    recommended_jobs = sorted(job_scores, key=job_scores.get, reverse=True)
    return recommended_jobs

def main():
    # Citirea argumentelor din intrarea standard
    user_id = sys.stdin.readline().strip()  # Eliminarea caracterelor de nouă linie
    application_data_json = sys.stdin.readline().strip()
    job_descriptions_json = sys.stdin.readline().strip()

    # Convertirea JSON-urilor în dicționare Python
    application_data = json.loads(application_data_json)
    job_descriptions = json.loads(job_descriptions_json)

    # Rularea logicii de recomandare
    recommended_jobs = recommend_jobs_combined(user_id, application_data, job_descriptions)
    print(recommended_jobs, flush=True)

if __name__ == "__main__":
    main()