import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample data: user applications and job descriptions
application_data = {
    'user1': ['job1', 'job3'],
    'user2': ['job1', 'job3', 'job5'],
    'user3': ['job1', 'job4'],
}

job_descriptions = {
    'job1': 'Data Scientist position with machine learning expertise',
    'job2': 'Software Engineer role focused on web development',
    'job3': 'Product Manager for a tech startup',
    'job4': 'Data Scientist in a financial services company expertise',
    'job5': 'Data Scientist in a financial services company',
    # Add more job descriptions as needed
}

# Function to calculate Euclidean distance between two users' job lists
def euclidean_distance(user1_jobs, user2_jobs):
    common_jobs = list(set(user1_jobs) & set(user2_jobs))
    if len(common_jobs) == 0:
        return np.inf
    
    user1_ratings = [user1_jobs.index(job) + 1 for job in common_jobs]
    user2_ratings = [user2_jobs.index(job) + 1 for job in common_jobs]
    
    print("euclidean_distance", user_id + ":", user1_ratings, user2_ratings, user1_jobs, user2_jobs)
    
    return np.linalg.norm(np.array(user1_ratings) - np.array(user2_ratings))

# Function to calculate content-based similarity
def calculate_content_similarity(user_id, user_applications, job_descriptions):
    user_description = ' '.join([job_descriptions.get(job_id, '') for job_id in user_applications])
    tfidf_vectorizer = TfidfVectorizer()
    job_vectors = tfidf_vectorizer.fit_transform(job_descriptions.values())
    user_vector = tfidf_vectorizer.transform([user_description])
    similarities = cosine_similarity(user_vector, job_vectors).flatten()
    return similarities

# Function to recommend jobs using combined filtering
def recommend_jobs_combined(user_id, application_data, job_descriptions):
    # Collaborative filtering
    similar_users = {}
    user_jobs = application_data[user_id]
    for user, jobs in application_data.items():
        if user != user_id:
            similarity = euclidean_distance(user_jobs, jobs)
            print("similar_users", user_id + ":", similarity, user_jobs, jobs)
            similar_users[user] = similarity
    similar_users = {k: v for k, v in sorted(similar_users.items(), key=lambda item: item[1])}
    
    print("similar_users", user_id + ":", similar_users)


    # Content-based filtering
    content_similarities = calculate_content_similarity(user_id, user_jobs, job_descriptions)
    
    print("content_similarities", user_id + ":", content_similarities)
    
    # Combine the two methods
    job_scores = {}
    for job_id in job_descriptions.keys():
        print("job_id", job_id + ":", user_jobs)

        if job_id not in user_jobs:
            job_index = list(job_descriptions.keys()).index(job_id)
            content_score = content_similarities[job_index]
            
            collaborative_score = 0
            for user, similarity in similar_users.items():
                if job_id in application_data[user]:
                    if similarity != 0:
                        collaborative_score += (1 / similarity)
                    else:
                        collaborative_score = 1  # Setăm scorul colaborativ la 1 în caz de similaritate zero
            
            print("job_id", job_id + ":", collaborative_score)
            
            combined_score = 0.5 * content_score + 0.5 * collaborative_score
            job_scores[job_id] = combined_score
    
    # Sort jobs by combined score
    recommended_jobs = sorted(job_scores, key=job_scores.get, reverse=True)
    return recommended_jobs

# Example usage
user_id = 'user1'
recommended_jobs = recommend_jobs_combined(user_id, application_data, job_descriptions)
print("Recommended jobs for", user_id + ":", recommended_jobs)