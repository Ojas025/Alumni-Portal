from mappings import skill_mapping, known_skills, skill_expansion, known_languages
from rapidfuzz.process import extractOne
from rapidfuzz.fuzz import ratio
from sentence_transformers import SentenceTransformer
import numpy as np
import math
from datetime import datetime
from sentence_transformers.util import cos_sim

weights = {
    'bio': 0.20,
    'projects': 0.30,
    'skills': 0.35,
    'languages': 0.05,
    'job_title': 0.10,
}

model = SentenceTransformer('paraphrase-mpnet-base-v2')

def jaccard_similarity(set1, set2):
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0

def fuzzy_match(input_string, known_list, threshold=95, scorer=ratio):
    match, score, _ = extractOne(input_string, known_list, scorer=scorer)
    return match if score >= threshold else input_string

def get_string(list):
    return ', '.join(list)

def get_language_vector(languages: list[str]):
    if not languages or not isinstance(languages, list):
        return np.zeros(model.get_sentence_embedding_dimension())

    res = set()
    for language in languages:
        language = language.strip().lower()
        language = fuzzy_match(language, known_languages, 90, ratio)
        res.add(language)

    if not res:
        return np.zeros(model.get_sentence_embedding_dimension())

    language_string = " ".join(list(res))
    vector = model.encode(language_string)
    norm = np.linalg.norm(vector)
    return vector / norm if norm > 0 else vector

def get_jobTitle_vector(jobTitle: str):
    if not jobTitle:
        return np.zeros(model.get_sentence_embedding_dimension())

    vector = model.encode(jobTitle.strip().lower())
    norm = np.linalg.norm(vector)
    return vector / norm if norm > 0 else vector

def preprocess_project_text(title, description):
    text = f"{title} {description}".lower().strip()
    stop_words = [
        'built', 'developed', 'using', 'integrated', 'created', 'implemented', 'designed',
        'application', 'project', 'tool', 'platform', 'solution', 'system', 'used', 'features',
        'developing', 'for', 'with', 'the', 'and', 'that', 'which', 'an', 'a', 'to', 'of', 'in',
        'on', 'by', 'at', 'from', 'is', 'was', 'were', 'it', 'this', 'these', 'those',
        'website', 'toolkit', 'integration', 'scanning', 'personal', 'customer',
        'service', 'automated', 'real', 'time', 'traffic', 'monitor', 'network',
        'information', 'event', 'anomalies', 'vulnerability', 'testing'
    ]

    words = [word for word in text.split() if word not in stop_words]
    return " ".join(words)

def get_projects_vector(projects):
    if not projects:
        return np.zeros(model.get_sentence_embedding_dimension())

    has_dates = all(hasattr(p, 'createdAt') and p.createdAt is not None for p in projects)

    if has_dates:
        try:
            projects = sorted(projects, key=lambda p: p.createdAt, reverse=True)
        except TypeError:
            print("Warning: Could not sort projects by createdAt due to incompatible types.")
            has_dates = False

    project_vectors = []
    project_weights = []

    for i, project in enumerate(projects):
        title = project.title or ''
        description = project.description or ''
        technologiesUsed = project.technologiesUsed or []

        project_text = preprocess_project_text(title, description)

        text_vector = model.encode(project_text) if project_text else np.zeros(model.get_sentence_embedding_dimension())
        text_norm = np.linalg.norm(text_vector)
        text_vector = text_vector / text_norm if text_norm > 0 else text_vector

        res = set()
        for tech in technologiesUsed:
            tech = tech.strip().lower()
            tech = fuzzy_match(tech, known_skills, 95, ratio)
            tech = skill_mapping.get(tech, tech)
            res.add(tech)

        tech_string = " ".join(res) if res else ""
        tech_vector = model.encode(tech_string) if tech_string else np.zeros(model.get_sentence_embedding_dimension())
        tech_norm = np.linalg.norm(tech_vector)
        tech_vector = tech_vector / tech_norm if tech_norm > 0 else tech_vector

        combined_vector = 0.3 * text_vector + 0.7 * tech_vector
        combined_norm = np.linalg.norm(combined_vector)
        combined_vector = combined_vector / combined_norm if combined_norm > 0 else combined_vector

        current_weight = math.exp(-0.2 * i) if has_dates else 1.0
        project_vectors.append(combined_vector)
        project_weights.append(current_weight)

    project_weights = np.array(project_weights)
    avg_vector = np.average(project_vectors, axis=0, weights=project_weights) if project_vectors else np.zeros(model.get_sentence_embedding_dimension())
    avg_norm = np.linalg.norm(avg_vector)
    avg_vector = avg_vector / avg_norm if avg_norm > 0 else avg_vector
    return avg_vector

def get_skills_vector(skills: list[str]):
    def normalize_skills(skills: list[str]):
        res = set()
        for skill in skills:
            skill = skill.strip().lower()
            skill = fuzzy_match(skill, known_skills, 95, ratio)
            skill = skill_mapping.get(skill, skill)
            res.add(skill)
        return list(res)

    if not skills or not isinstance(skills, list):
        return np.zeros(model.get_sentence_embedding_dimension())

    normalized_skills = normalize_skills(skills)

    if not normalized_skills:
        return np.zeros(model.get_sentence_embedding_dimension())

    skill_embeddings = [model.encode(skill) for skill in normalized_skills]
    skill_embeddings = np.array(skill_embeddings)
    vector = np.average(skill_embeddings, axis=0)
    norm = np.linalg.norm(vector)
    return vector / norm if norm > 0 else vector

def get_bio_vector(bio: str):
    def preprocess_bio(bio):
        if not bio:
            return ""

        stop_words = [
            'passionate', 'experienced', 'strong', 'focus', 'dedicated', 'driven', 'enthusiastic', 'motivated', 'skilled',
            'proficient', 'expert', 'proven', 'extensive', 'solid', 'background', 'seasoned', 'committed', 'innovative',
            'results-oriented', 'goal-oriented', 'hardworking', 'team-player', 'detail-oriented', 'dynamic', 'talented',
            'self-motivated', 'career', 'professional', 'track', 'record', 'excellent', 'ability', 'adept', 'knowledgeable',
            'capable', 'competent', 'reliable', 'versatile', 'strategic', 'analytical', 'creative', 'resourceful'
        ]

        tokenized_bio = [word for word in bio.lower().split() if word not in stop_words]
        return " ".join(tokenized_bio)

    if not bio:
        return np.zeros(model.get_sentence_embedding_dimension())

    processed_bio = preprocess_bio(bio)
    if not processed_bio:
        return np.zeros(model.get_sentence_embedding_dimension())

    vector = model.encode(processed_bio)
    norm = np.linalg.norm(vector)
    return vector / norm if norm > 0 else vector

def find_mentors_for_student(student, alumni_list):
    # print(student)
    # print("\n\n", alumni_list)
    # print("\n")
    results = []

    student_bio = get_bio_vector(student.bio or '') * weights['bio']
    student_skills = get_skills_vector(student.skills or []) * weights['skills']
    student_languages = get_language_vector(student.languages or []) * weights['languages']
    student_job_title = get_jobTitle_vector('') * weights['job_title']
    student_projects_vector_result = get_projects_vector(student.projects or [])

    if isinstance(student_projects_vector_result, tuple):
        student_vector_part = student_projects_vector_result[0]
    else:
        student_vector_part = student_projects_vector_result

        student_projects_vector = np.array(student_vector_part) * weights['projects']

    student_vector = (
        student_bio + student_skills + student_languages + student_job_title + student_projects_vector
    )
    student_norm = np.linalg.norm(student_vector)
    student_vector = student_vector / student_norm if student_norm > 0 else student_vector

    # print(student_vector)
    # print(alumni_list)

    for index, alumni in enumerate(alumni_list):
        alumni_bio = np.array(get_bio_vector(alumni.bio or '')) * weights['bio']
        alumni_skills = np.array(get_skills_vector(alumni.skills or [])) * weights['skills']
        alumni_languages = np.array(get_language_vector(alumni.languages or [])) * weights['languages']
        alumni_job_title_str = alumni.jobDetails.jobTitle if alumni.jobDetails and alumni.jobDetails.jobTitle else ''
        alumni_job_title = np.array(get_jobTitle_vector(alumni_job_title_str)) * weights['job_title']
        alumni_projects_vector_result = get_projects_vector(alumni.projects or [])
        # print(alumni_projects_vector_result.shape)
        # alumni_projects_vector = (alumni_projects_vector_result[0]) * weights['projects']
        if isinstance(alumni_projects_vector_result, tuple):
            alumni_vector_part = alumni_projects_vector_result[0]
        else:
            alumni_vector_part = alumni_projects_vector_result

        alumni_projects_vector = np.array(alumni_vector_part) * weights['projects']
        alumni_vector = (
            alumni_bio + alumni_skills + alumni_languages + alumni_job_title + alumni_projects_vector
        )
        alumni_norm = np.linalg.norm(alumni_vector)
        alumni_vector = alumni_vector / alumni_norm if alumni_norm > 0 else alumni_vector

        if np.any(student_vector) and np.any(alumni_vector):
            similarity = cos_sim(student_vector, alumni_vector).item()
        else:
            similarity = 0.0

        result = {
            'index': index,
            'alumni': alumni,
            'distance': similarity,
        }
        results.append(result)

    # print('\nresult: ', results)        

    results.sort(key=lambda x: x['distance'], reverse=True)

    res = [] 
    for mentor in results:
        alumni = mentor['alumni']
        print(alumni.id)
        res.append({
            "id": alumni.id,
            "skills": alumni.skills,
            "bio": alumni.bio,
            "languages": alumni.languages,
            "department": alumni.department,
            "role": alumni.role.value if alumni.role else None,  # Convert enum to string value
            "projects": [
                {
                    "title": p.title,
                    "description": p.description,
                    "url": p.url,
                    "technologiesUsed": p.technologiesUsed
                } for p in (alumni.projects or [])
            ],
            "availableForMentorship": alumni.availableForMentorship,
            "jobDetails": {
                "jobTitle": alumni.jobDetails.jobTitle if alumni.jobDetails else None,
                "company": alumni.jobDetails.company if alumni.jobDetails else None
            },
            "firstName": alumni.firstName,
            "lastName": alumni.lastName,
            "linkedin": alumni.linkedin,
            "github": alumni.github,
            "batch": str(alumni.batch) if alumni.batch else None,  # Convert date to string
            "location": alumni.location,
            "profileImageURL": alumni.profileImageURL,
            "distance": mentor['distance']  # Include the similarity score
        })

    return res[:5]
