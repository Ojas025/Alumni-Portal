import faiss
import numpy as np
import math
from datetime import datetime
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
from rapidfuzz.process import extractOne
from rapidfuzz.fuzz import ratio
import networkx as nx
import logging

# Assume these are provided externally
from mappings import skill_mapping, known_skills, skill_expansion, known_languages

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize model and FAISS index
model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight model
embedding_dim = model.get_sentence_embedding_dimension()
faiss_index = faiss.IndexFlatIP(embedding_dim)  # Inner product for cosine similarity

# Build skill graph
skill_graph = nx.Graph()
for skill, related_skills in skill_expansion.items():
    skill = skill.lower()
    for related in related_skills:
        skill_graph.add_edge(skill, related.lower(), weight=0.8)

# Default feature weights
weights = {
    'bio': 0.20,
    'projects': 0.30,
    'skills': 0.35,
    'languages': 0.05,
}

def jaccard_similarity(set1, set2):
    """Compute Jaccard similarity between two sets."""
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0.0

def fuzzy_match(input_string, known_list, threshold=95, scorer=ratio):
    """Fuzzy match input string against a known list."""
    try:
        match, score, _ = extractOne(input_string, known_list, scorer=scorer)
        return match if score >= threshold else input_string
    except Exception as e:
        logger.warning(f"Fuzzy match failed for '{input_string}': {e}")
        return input_string

def get_language_vector(languages: list[str]) -> np.ndarray:
    """Generate normalized embedding for languages."""
    if not languages or not isinstance(languages, list):
        return np.zeros(embedding_dim)
    res = set()
    for language in languages:
        language = language.strip().lower()
        language = fuzzy_match(language, known_languages, 90, ratio)
        res.add(language)
    if not res:
        return np.zeros(embedding_dim)
    language_string = " ".join(res)
    try:
        vector = model.encode(language_string)
        norm = np.linalg.norm(vector)
        return vector / norm if norm > 0 else vector
    except Exception as e:
        logger.error(f"Language encoding failed: {e}")
        return np.zeros(embedding_dim)

def preprocess_project_text(title: str, description: str) -> str:
    """Preprocess project title and description, removing stop words."""
    text = f"{title or ''} {description or ''}".lower().strip()
    stop_words = {
        'built', 'developed', 'using', 'integrated', 'created', 'implemented', 'designed',
        'application', 'project', 'tool', 'platform', 'solution', 'system', 'used', 'features',
        'website', 'toolkit', 'integration', 'personal', 'customer', 'service', 'automated'
    }
    words = [word for word in text.split() if word not in stop_words]
    return " ".join(words)

def get_projects_vector(projects: list) -> np.ndarray:
    """Generate weighted average embedding for projects with time decay."""
    if not projects:
        return np.zeros(embedding_dim)
    
    has_dates = all(hasattr(p, 'createdAt') and p.createdAt is not None for p in projects)
    if has_dates:
        try:
            projects = sorted(projects, key=lambda p: p.createdAt, reverse=True)
        except Exception as e:
            logger.warning(f"Project sorting failed: {e}")
            has_dates = False

    project_vectors = []
    project_weights = []
    
    for i, project in enumerate(projects):
        title = project.title or ''
        description = project.description or ''
        technologiesUsed = project.technologiesUsed or []
        
        # Preprocess project text
        project_text = preprocess_project_text(title, description)
        text_vector = model.encode(project_text) if project_text else np.zeros(embedding_dim)
        text_norm = np.linalg.norm(text_vector)
        text_vector = text_vector / text_norm if text_norm > 0 else text_vector
        
        # Normalize technologies
        res = set()
        for tech in technologiesUsed:
            tech = tech.strip().lower()
            tech = fuzzy_match(tech, known_skills, 95, ratio)
            tech = skill_mapping.get(tech, tech)
            res.add(tech)
        
        tech_string = " ".join(res) if res else ""
        tech_vector = model.encode(tech_string) if tech_string else np.zeros(embedding_dim)
        tech_norm = np.linalg.norm(tech_vector)
        tech_vector = tech_vector / tech_norm if tech_norm > 0 else tech_vector
        
        # Combine text and tech vectors
        combined_vector = 0.3 * text_vector + 0.7 * tech_vector
        combined_norm = np.linalg.norm(combined_vector)
        combined_vector = combined_vector / combined_norm if combined_norm > 0 else combined_vector
        
        # Apply time-based weight
        current_weight = math.exp(-0.2 * i) if has_dates else 1.0
        project_vectors.append(combined_vector)
        project_weights.append(current_weight)
    
    if not project_vectors:
        return np.zeros(embedding_dim)
    
    project_weights = np.array(project_weights)
    avg_vector = np.average(project_vectors, axis=0, weights=project_weights)
    avg_norm = np.linalg.norm(avg_vector)
    return avg_vector / avg_norm if avg_norm > 0 else avg_vector

def get_skills_vector(skills: list[str]) -> np.ndarray:
    """Generate embedding for skills, including related skills from graph."""
    if not skills or not isinstance(skills, list):
        return np.zeros(embedding_dim)
    
    res = set()
    for skill in skills:
        skill = skill.strip().lower()
        skill = fuzzy_match(skill, known_skills, 95, ratio)
        skill = skill_mapping.get(skill, skill)
        res.add(skill)
        # Add related skills from graph
        if skill in skill_graph:
            for neighbor in skill_graph.neighbors(skill):
                res.add(neighbor)
    
    if not res:
        return np.zeros(embedding_dim)
    
    try:
        skill_embeddings = [model.encode(skill) for skill in res]
        vector = np.average(skill_embeddings, axis=0)
        norm = np.linalg.norm(vector)
        return vector / norm if norm > 0 else vector
    except Exception as e:
        logger.error(f"Skills encoding failed: {e}")
        return np.zeros(embedding_dim)

def get_bio_vector(bio: str) -> np.ndarray:
    """Generate embedding for bio, removing generic terms."""
    if not bio or not isinstance(bio, str):
        return np.zeros(embedding_dim)
    
    stop_words = {
        'passionate', 'experienced', 'strong', 'dedicated', 'driven', 'enthusiastic',
        'proficient', 'expert', 'proven', 'background', 'career', 'professional'
    }
    tokenized_bio = [word for word in bio.lower().split() if word not in stop_words]
    processed_bio = " ".join(tokenized_bio)
    
    if not processed_bio:
        return np.zeros(embedding_dim)
    
    try:
        vector = model.encode(processed_bio)
        norm = np.linalg.norm(vector)
        return vector / norm if norm > 0 else vector
    except Exception as e:
        logger.error(f"Bio encoding failed: {e}")
        return np.zeros(embedding_dim)

def compute_feature_similarity(student_vector: np.ndarray, alumni_vector: np.ndarray, weight: float) -> float:
    """Compute cosine similarity for a specific feature."""
    if not np.any(student_vector) or not np.any(alumni_vector):
        return 0.0
    return cos_sim(student_vector * weight, alumni_vector * weight).item()

def precompute_alumni_embeddings(alumni_list: list) -> list:
    """Precompute and index alumni embeddings, applying filters."""
    embeddings = []
    alumni_data = []
    
    for alumni in alumni_list:
        # Apply rule-based filter: skip unavailable mentors
        if not hasattr(alumni, 'availableForMentorship') or not alumni.availableForMentorship:
            logger.debug(f"Skipping alumni {getattr(alumni, 'id', 'unknown')} due to unavailability")
            continue
        
        try:
            bio = get_bio_vector(alumni.bio or '') * weights['bio']
            skills = get_skills_vector(alumni.skills or []) * weights['skills']
            languages = get_language_vector(alumni.languages or []) * weights['languages']
            projects = get_projects_vector(alumni.projects or []) * weights['projects']
            
            vector = bio + skills + languages + projects
            norm = np.linalg.norm(vector)
            vector = vector / norm if norm > 0 else vector
            
            embeddings.append(vector)
            alumni_data.append(alumni)
        except Exception as e:
            logger.error(f"Embedding computation failed for alumni {getattr(alumni, 'id', 'unknown')}: {e}")
    
    if embeddings:
        embeddings = np.array(embeddings, dtype=np.float32)
        faiss_index.add(embeddings)
        logger.info(f"Indexed {len(embeddings)} alumni embeddings")
    else:
        logger.warning("No valid alumni embeddings indexed")
    
    return alumni_data

def find_mentors_for_student(student, alumni_list: list, top_k: int = 7) -> list:
    """Find top-k unique mentor matches for a student with explainability."""
    # Precompute alumni embeddings if index is empty
    global faiss_index
    if faiss_index.ntotal == 0:
        alumni_data = precompute_alumni_embeddings(alumni_list)
    else:
        alumni_data = alumni_list
    
    # Compute student vector
    try:
        bio = get_bio_vector(student.bio or '') * weights['bio']
        skills = get_skills_vector(student.skills or []) * weights['skills']
        languages = get_language_vector(student.languages or []) * weights['languages']
        projects = get_projects_vector(student.projects or []) * weights['projects']
        
        student_vector = bio + skills + languages + projects
        student_norm = np.linalg.norm(student_vector)
        student_vector = student_vector / student_norm if student_norm > 0 else student_vector
    except Exception as e:
        logger.error(f"Student vector computation failed: {e}")
        student_vector = np.zeros(embedding_dim)
    
    results = []
    processed_mentor_ids = set()  # Track processed mentors to avoid duplicates
    
    # Fallback for sparse data
    if not np.any(student_vector):
        logger.info("Using Jaccard similarity fallback for sparse student data")
        for i, alumni in enumerate(alumni_data):
            alumni_id = getattr(alumni, 'id', f"unknown_{i}")
            if alumni_id in processed_mentor_ids:
                logger.debug(f"Skipping duplicate alumni ID {alumni_id} in fallback")
                continue
            score = jaccard_similarity(set(student.skills or []), set(alumni.skills or []))
            results.append({
                'index': i,
                'alumni': alumni,
                'distance': score,
                'explanation': ['Fallback: Jaccard similarity on skills']
            })
            processed_mentor_ids.add(alumni_id)
        results.sort(key=lambda x: x['distance'], reverse=True)
    else:
        # Perform FAISS search, fetching extra results to handle potential duplicates
        try:
            student_vector = student_vector.astype(np.float32).reshape(1, -1)
            distances, indices = faiss_index.search(student_vector, top_k * 2)  # Fetch extra to ensure enough unique mentors
            for idx, distance in zip(indices[0], distances[0]):
                if idx >= len(alumni_data):
                    logger.warning(f"Invalid index {idx} returned by FAISS, skipping")
                    continue
                
                alumni = alumni_data[idx]
                alumni_id = getattr(alumni, 'id', f"unknown_{idx}")
                if alumni_id in processed_mentor_ids:
                    logger.debug(f"Skipping duplicate alumni ID {alumni_id}")
                    continue
                
                # Compute feature-specific similarities for explainability
                explanations = []
                feature_vectors = {
                    'bio': get_bio_vector(alumni.bio or '') * weights['bio'],
                    'skills': get_skills_vector(alumni.skills or []) * weights['skills'],
                    'languages': get_language_vector(alumni.languages or []) * weights['languages'],
                    'projects': get_projects_vector(alumni.projects or []) * weights['projects']
                }
                
                for feature, weight in weights.items():
                    student_feat = locals()[feature]
                    alumni_feat = feature_vectors[feature]
                    feat_sim = compute_feature_similarity(student_feat, alumni_feat, weights[feature])
                    explanations.append(f"{feature.capitalize()} similarity: {feat_sim:.3f}")
                
                # Print mentor similarity scores
                mentor_name = f"{getattr(alumni, 'firstName', '')} {getattr(alumni, 'lastName', '')}".strip()
                print(f"Mentor: {mentor_name or 'Unknown'} (ID: {alumni_id})")
                print(f"  Distance Score (overall): {distance:.4f}")
                print(f"  Feature Similarities:")
                for explanation in explanations:
                    print(f"    {explanation}")
                print("-" * 60)
                
                results.append({
                    'index': idx,
                    'alumni': alumni,
                    'distance': distance,
                    'explanation': explanations
                })
                processed_mentor_ids.add(alumni_id)
                
                # Stop if we have enough unique mentors
                if len(results) >= top_k:
                    break
        except Exception as e:
            logger.error(f"FAISS search failed: {e}")
            return []
    
    # Sort and filter results
    results.sort(key=lambda x: x['distance'], reverse=True)
    results = results[:top_k]
    
    # Format output
    res = []
    for mentor in results:
        alumni = mentor['alumni']
        try:
            mentor_data = {
                "id": getattr(alumni, 'id', None),
                "skills": getattr(alumni, 'skills', []) or [],
                "bio": getattr(alumni, 'bio', '') or '',
                "languages": getattr(alumni, 'languages', []) or [],
                "department": getattr(alumni, 'department', None),
                "role": alumni.role.value if hasattr(alumni, 'role') and alumni.role else None,
                "projects": [
                    {
                        "title": getattr(p, 'title', '') or '',
                        "description": getattr(p, 'description', '') or '',
                        "url": getattr(p, 'url', '') or '',
                        "technologiesUsed": getattr(p, 'technologiesUsed', []) or []
                    } for p in (getattr(alumni, 'projects', []) or [])
                ],
                "availableForMentorship": getattr(alumni, 'availableForMentorship', False),
                "firstName": getattr(alumni, 'firstName', None),
                "lastName": getattr(alumni, 'lastName', None),
                "linkedin": getattr(alumni, 'linkedin', None),
                "github": getattr(alumni, 'github', None),
                "batch": str(alumni.batch) if hasattr(alumni, 'batch') and alumni.batch else None,
                "location": getattr(alumni, 'location', None),
                "profileImageURL": getattr(alumni, 'profileImageURL', None),
                "distance": mentor['distance'],
                "explanation": mentor['explanation']
            }
            res.append(mentor_data)
        except Exception as e:
            logger.error(f"Output formatting failed for alumni {getattr(alumni, 'id', 'unknown')}: {e}")
    
    logger.info(f"Returning {len(res)} mentor matches for student")
    return res