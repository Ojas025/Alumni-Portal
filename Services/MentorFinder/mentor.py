from mappings import skill_mapping, known_skills, skill_expansion, known_languages
from rapidfuzz.process import extractOne
from rapidfuzz.fuzz import ratio
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

def fuzzy_match(input_string, known_list, threshold=80, scorer=ratio):
    match, score, _ = extractOne(input_string, known_list, scorer=scorer)
    return match if score >= threshold else input_string

def get_string(list):
    return ', '.join(list)

def get_department_vector(department):
    if not department:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    return model.encode(department.strip().lower()) 

def get_language_vector(languages: list[str]):
    if not languages or not isinstance(languages, list):  
        return np.zeros(model.get_sentence_embedding_dimension())

    res = set()

    for language in languages:
        language = language.strip().lower()
        language = fuzzy_match(language, known_languages, 80, ratio)
        res.add(language)

    language_string = get_string(list(res))    

    return model.encode(language_string)    


def get_company_vector(company: str):
    if not company:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    return model.encode(company.strip().lower()) 

def get_jobTitle_vector(jobTitle: str):
    if not jobTitle:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    return model.encode(jobTitle.strip().lower()) 

def get_projects_vector(skills):
    pass

def get_skills_vector(skills: list[str]):

    def normalize_skills(skills: list[str]):
        res = set()

        for skill in skills:
            skill = skill.strip().lower()

            if (skill in skill_expansion):
                expanded_skills = skill_expansion[skill]
                res.update(expanded_skills)
            else:
                skill = skill_mapping.get(skill, skill)
                skill = fuzzy_match(skill, known_skills, 80, ratio)
                res.add(skill)

        return list(res)
    

    if (not skills or not isinstance(skills, list)):
        return np.zeros(model.get_sentence_embedding_dimension())
    
    normalized_skills = normalize_skills(skills)
    skills_string = get_string(normalized_skills)

    return model.encode(skills_string)
    

def get_bio_vector(bio: str):
    if not bio:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    bio = bio.strip().lower()
    return model.encode(bio)

def find_mentors_for_student(student, alumni_list):
    pass 