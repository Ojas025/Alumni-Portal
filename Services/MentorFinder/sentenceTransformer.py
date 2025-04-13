from sentence_transformers import SentenceTransformer 
import numpy as np 

model = SentenceTransformer('all-MiniLM-L6-v2')

alumni_sentences = [
    "I've spent most of my career building backend systems for web platforms, and I enjoy diving into API design, caching strategies, and database performance. These days, I focus more on mentoring junior devs and guiding system-level thinking.",

    "After years in mobile development, I’ve become really interested in building clean, cross-platform apps that scale. I’ve recently been exploring Jetpack Compose and design patterns for larger app architectures.",

    "My work revolves around data pipelines and cloud infrastructure. I’m especially interested in optimizing data workflows, and I love helping students understand how data flows from ingestion to dashboards.",

    "Cybersecurity has been my focus for the past few years — especially around securing web apps, threat modeling, and cloud misconfiguration detection. I’m passionate about guiding students who want to get into blue team roles.",

    "I’ve transitioned from frontend engineering to full-stack, and what drives me now is building products users genuinely enjoy. I like to chat about design systems, DX, and how frontend connects to business outcomes.",

    "I’ve worked in product-focused engineering roles and enjoy balancing technical decisions with user needs. I’m especially interested in helping others navigate ambiguous product-building environments.",

    "My current focus is DevOps and cloud automation. I’ve spent a lot of time building CI/CD pipelines, container orchestration setups, and monitoring stacks. I’m happy to mentor students trying to understand modern deployment practices.",

    'I’ve been working in backend development for over five years, mainly using Python and Django, along with PostgreSQL and Redis for database management. I specialize in designing scalable systems and optimizing API performance to handle high traffic. I also enjoy mentoring teams on best practices for code structure and system reliability.',

    "I moved into AI/ML from a traditional software background, so I understand the learning curve. I’ve worked on NLP applications and deployment pipelines, and I like helping students bridge theory with practice.",

    "Game development is what got me into tech, and I’ve since worked on Unity-based projects for AR/VR. I’m always excited to support others working at the intersection of interactivity and real-time rendering.",

    "I enjoy building secure-by-design systems and automating infrastructure. My interests lie in cloud-native security and Kubernetes best practices — I’m here to support students trying to get into DevSecOps."
]

student_sentence = 'I’m learning backend development with Node.js and PostgreSQL. Currently building small projects but looking to improve my skills in system architecture, scalability, and API design.'

alumni_embeddings = model.encode(alumni_sentences)
# print("alumni: ")
# print(alumni_embeddings)

student_embedding = model.encode(student_sentence)
# print("\n\nstudent: ")
# print(student_embedding)



# student_skills_embedding = model.encode(student_skills) 
# alumni_skills_embedding = model.encode(alumni_skills) 
# print(alumni_skills_embedding)

bio_similarities = model.similarity(student_embedding, alumni_embeddings)

def get_mentors(similarities):
    arr = similarities.numpy()[0]
    
    sorted_indices = np.argsort(arr)[::-1]

    top_indices = sorted_indices[:5]
    top_scores = arr[top_indices]

    mentors = np.vstack((top_scores, top_indices)).T

    return mentors

def display_mentors(mentors):
    for mentor, index in mentors:
        index = int(index)
        print(f'\n{mentor}: ', alumni_sentences[index]) 

mentors = get_mentors(bio_similarities)
# display_mentors(mentors) 

# skill_similarities = model.similarity(student_skills_embedding, alumni_skills_embedding)
# print(skill_similarities)

alumni_job_titles = [
    "Senior Backend Engineer",
    "Mobile Development Lead (Android/iOS)",
    "Data Engineering Manager",
    "Cybersecurity Analyst Lead",
    "Full-Stack Engineer",
    "Product Engineer",
    "DevOps Engineer",
    "Backend Developer (Python/Django)", # Example matching the 8th bio
    "Machine Learning Engineer",
    "AR/VR Developer (Unity)",
    "DevSecOps Engineer"
]

normalized_alumni_titles = [title.strip().lower() for title in alumni_job_titles]

alumni_title_embeddings = model.encode(normalized_alumni_titles)

title_similarities = model.similarity(student_embedding, alumni_title_embeddings)
print(title_similarities)  