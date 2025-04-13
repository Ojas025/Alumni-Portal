from skill_normalized_mapping import skill_mapping

def normalize_skills(skills):
    res = [] 

    for skill in skills:
        skill = skill.strip().lower()
        skill = skill_mapping.get(skill, skill)
        res.append(skill)

    return list(set(res)) 

arr = normalize_skills([" Python ", "ML", "machine learning", "JS", "web-dev "])       

def get_skills_string(skills):
    return ', '.join(skills)

print(get_skills_string(arr))