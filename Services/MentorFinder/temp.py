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

# model = SentenceTransformer('all-MiniLM-L6-v2')
# model = SentenceTransformer('all-mpnet-base-v2')
# model = SentenceTransformer('all-distilroberta-v1')
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

def preprocess_project_text(title, description):
    text = f"{title} {description}".lower()
    stop_words = [
        'built', 'developed', 'using', 'integrated', 'created', 'implemented', 'designed',
        'application', 'project', 'tool', 'platform', 'solution', 'system', 'used', 'features',
        'developing', 'for', 'with', 'the', 'and', 'that', 'which', 'an', 'a', 'to', 'of', 'in',
        'on', 'by', 'at', 'from', 'is', 'was', 'were', 'it', 'this', 'these', 'those',
        'website', 'chatbot', 'toolkit', 'integration', 'scanning', 'personal', 'customer',
        'service', 'automated', 'real', 'time', 'traffic', 'monitor', 'network', 'web',
        'information', 'event', 'anomalies', 'vulnerability', 'testing'
    ]
    words = [word for word in text.split() if word not in stop_words]
    return " ".join(words)

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
    return vector / np.linalg.norm(vector) if np.linalg.norm(vector) > 0 else vector

def get_jobTitle_vector(jobTitle: str):
    if not jobTitle:
        return np.zeros(model.get_sentence_embedding_dimension())
    vector = model.encode(jobTitle.strip().lower())
    return vector / np.linalg.norm(vector) if np.linalg.norm(vector) > 0 else vector

def get_projects_vector(projects):
    if not projects:
        return np.zeros(model.get_sentence_embedding_dimension()), set()

    has_dates = all(hasattr(p, 'createdAt') for p in projects)
    if has_dates:
        projects = sorted(projects, key=lambda p: p.createdAt, reverse=True)

    project_vectors = []
    project_weights = []
    all_tech = set()

    for i, project in enumerate(projects):
        title = project.get('title', '').strip().lower()
        description = project.get('description', '').strip().lower()
        project_text = preprocess_project_text(title, description)
        text_vector = model.encode(project_text) if project_text else np.zeros(model.get_sentence_embedding_dimension())
        text_vector = text_vector / np.linalg.norm(text_vector) if np.linalg.norm(text_vector) > 0 else text_vector

        res = set()
        for tech in project.get('technologiesUsed', []):
            tech = tech.strip().lower()
            tech = fuzzy_match(tech, known_skills, 95, ratio)
            tech = skill_mapping.get(tech, tech)
            res.add(tech)
        all_tech.update(res)
        
        tech_string = " ".join(sorted(res)) if res else ""
        tech_vector = model.encode(tech_string) if tech_string else np.zeros(model.get_sentence_embedding_dimension())
        tech_vector = tech_vector / np.linalg.norm(tech_vector) if np.linalg.norm(tech_vector) > 0 else tech_vector

        combined_vector = 0.3 * text_vector + 0.7 * tech_vector
        combined_vector = combined_vector / np.linalg.norm(combined_vector) if np.linalg.norm(combined_vector) > 0 else combined_vector

        current_weight = math.exp(-0.2 * i) if has_dates else 1.0
        project_vectors.append(combined_vector)
        project_weights.append(current_weight)

    project_weights = np.array(project_weights)
    avg_vector = np.average(project_vectors, axis=0, weights=project_weights) if project_vectors else np.zeros(model.get_sentence_embedding_dimension())
    avg_vector = avg_vector / np.linalg.norm(avg_vector) if np.linalg.norm(avg_vector) > 0 else avg_vector

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
    skill_embeddings = [model.encode(skill) for skill in normalized_skills]
    weights = [0.5 if skill in ['python', 'javascript', 'react'] else 1.0 for skill in normalized_skills]
    skill_embeddings = np.array(skill_embeddings)
    weights = np.array(weights) / np.sum(weights)
    vector = np.average(skill_embeddings, axis=0, weights=weights)
    return vector / np.linalg.norm(vector) if np.linalg.norm(vector) > 0 else vector

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
        bio_words = [word for word in bio.lower().split() if word not in stop_words]
        return " ".join(bio_words)

    if not bio:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    bio = preprocess_bio(bio)
    vector = model.encode(bio)
    return vector / np.linalg.norm(vector) if np.linalg.norm(vector) > 0 else vector

def find_mentors_for_student(student, alumni_list):
    results = []
    
    student_bio = get_bio_vector(student.get('bio', '')) * weights['bio']
    student_skills = get_skills_vector(student.get('skills', [])) * weights['skills']
    student_languages = get_language_vector(student.get('languages', [])) * weights['languages']
    student_job_title = get_jobTitle_vector(student.get('jobTitle', '')) * weights['job_title']
    student_projects_vector_raw, student_tech = get_projects_vector(student.get('projects', []))
    student_projects_vector = student_projects_vector_raw * weights['projects']
    
    student_vector = (
        student_bio + student_skills + student_languages + student_job_title + student_projects_vector
    ) 

    student_vector = student_vector / np.linalg.norm(student_vector)

    for index, alumni in enumerate(alumni_list):
        
        alumni_bio = get_bio_vector(alumni.get('bio', '')) * weights['bio']
        alumni_skills = get_skills_vector(alumni.get('skills', [])) * weights['skills']
        alumni_languages = get_language_vector(alumni.get('languages', [])) * weights['languages']
        alumni_job_title = get_jobTitle_vector(alumni.get('jobTitle', '')) * weights['job_title']
        alumni_projects_vector = get_projects_vector(alumni.get('projects', [])) * weights['projects']


        alumni_vector = (
            alumni_bio + alumni_skills + alumni_languages + alumni_job_title + alumni_projects_vector
        ) 

        alumni_vector = alumni_vector / np.linalg.norm(alumni_vector)
        
        result = {
            'index': index,
            'alumni': alumni,
            'distance': cos_sim(student_vector, alumni_vector).item(),
        }
        results.append(result)

    results.sort(lambda x: x['distance'], reverse=True)        
    
    return results[:5] if len(results) >= 5 else results  

student = {
    'bio': "Enthusiastic software engineer passionate about machine learning and full stack development.",
    'projects': [
        {
            'title': "AI Chatbot",
            'description': "Built a chatbot using Python, NLP and Flask.",
            'technologiesUsed': ["python", "flask", "nlp", "transformers"],
            'createdAt': datetime(2023, 5, 10)
        },
        {
            'title': "Portfolio Website",
            'description': "A personal website built using React and hosted on Netlify.",
            'technologiesUsed': ["react", "netlify", "html", "css"],
            'createdAt': datetime(2022, 12, 1)
        }
    ],
    'languages': ["English", "Hindi", "Spanich"],
    'skills': ["Machine learning", "React", "python", "nlp"],
}

alumni1 = {
    'bio': """
    Experienced software engineer with a focus on web development and AI. I have a strong foundation in full-stack development,
    and I enjoy solving complex problems using modern technologies and frameworks.
    Recently, I’ve been focusing on mentoring and helping others transition into the tech field.
    """,
    'projects': [
        {
            "title": "AI-Powered Chatbot",
            "description": """
                Created an AI-driven chatbot using natural language processing and machine learning. 
                The chatbot was integrated into a customer service platform to improve user engagement.
            """,
            "technologiesUsed": ["Python", "TensorFlow", "NLP", "Flask"]
        },
        {
            "title": "E-Commerce Web Application",
            "description": """
                Developed a full-stack e-commerce platform with features like product search, user authentication, and shopping cart.
                Deployed using AWS and implemented real-time payment gateway integration.
            """,
            "technologiesUsed": ["JavaScript", "React", "Node.js", "AWS", "MongoDB"]
        }
    ],
    'languages': ["English", "German"],
    'skills': ["Python", "JavaScript", "React", "Node.js", "AWS", "Machine Learning", "NLP", "MongoDB"],
    'jobTitle': "Software Engineer",
}

alumni2 = {
    'bio': "Data scientist specializing in predictive modeling and big data analytics.",
    'projects': [
        {
            'title': "Predictive Sales Model",
            'description': "Developed a machine learning model to forecast sales using historical data.",
            'technologiesUsed': ["Python", "Pandas", "Sklearn", "Spark"],
            'createdAt': datetime(2022, 8, 15)
        },
        {
            'title': "Real-Time Analytics Dashboard",
            'description': "Built an interactive dashboard for real-time data visualization.",
            'technologiesUsed': ["Python", "Dash", "PostgreSQL", "Docker"],
            'createdAt': datetime(2023, 2, 20)
        }
    ],
    'languages': ["English", "French"],
    'skills': ["Python", "Machine Learning", "Data Visualization", "Big Data"],
    'jobTitle': "Senior Data Scientist",
}

alumni3 = {
    'bio': "Mobile app developer with expertise in cross-platform solutions.",
    'projects': [
        {
            'title': "Fitness Tracking App",
            'description': "Created a mobile app for tracking fitness activities with real-time metrics.",
            'technologiesUsed': ["Flutter", "Dart", "Firebase"],
            'createdAt': datetime(2023, 1, 10)
        },
        {
            'title': "E-Learning Mobile App",
            'description': "Developed a cross-platform app for online courses with interactive content.",
            'technologiesUsed': ["React Native", "JavaScript", "GraphQL"],
            'createdAt': datetime(2022, 11, 5)
        }
    ],
    'languages': ["English", "Mandarin"],
    'skills': ["Mobile Development", "Flutter", "React Native", "UI/UX"],
    'jobTitle': "Mobile Software Engineer",
}

alumni4 = {
    'bio': "Cybersecurity analyst with a passion for ethical hacking, network security, and incident response. I work on identifying system vulnerabilities and implementing proactive defense strategies against cyber threats.",
    'projects': [
        {
            'title': "Penetration Testing Toolkit",
            'description': "Developed a toolkit for automated penetration testing and vulnerability scanning using industry tools and custom scripts.",
            'technologiesUsed': ["Kali Linux", "Metasploit", "Nmap", "Bash"],
            'createdAt': datetime(2023, 3, 1)
        },
        {
            'title': "SIEM Integration for Threat Detection",
            'description': "Integrated and configured a Security Information and Event Management (SIEM) system to monitor network traffic and detect anomalies in real time.",
            'technologiesUsed': ["Splunk", "Snort", "Python", "Syslog"],
            'createdAt': datetime(2022, 10, 15)
        }
    ],
    'languages': ["English", "Russian"],
    'skills': ["Penetration Testing", "Network Security", "SIEM", "Incident Response", "Threat Intelligence"],
    'jobTitle': "Cybersecurity Analyst at ShieldSec"
}

alumni_list = [alumni1, alumni2, alumni3, alumni4]
results = find_mentors_for_student(student, alumni_list)

for result in results:
    print(f"\nStudent - Alumni{result['index'] + 1}")
    print('Cosine_Similarity: ', result['distance'])
