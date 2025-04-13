# What is Normalization?
#  Normalization is the process of cleaning and standardizing your data fields so that variations representing the same underlying concept are treated consistently.

from nltk import sent_tokenize, wordpunct_tokenize
from normalization.skills import skills

corpus = '''
    I'm currently diving into backend development using Node.js and Express, focusing on how to design scalable REST APIs. In parallel, I've been exploring PostgreSQL for relational data modeling and query optimization.
    Lately, containerization with Docker has caught my interest, especially how it simplifies development environments.
    I'm also brushing up on system design fundamentals to better understand load balancing and horizontal scaling.
    Looking ahead, I'm excited to learn more about cloud deployment using AWS, particularly EC2 and S3.
'''

sentences = sent_tokenize(corpus)
print(sentences)
print("\n")

for sentence in sentences:
    print(wordpunct_tokenize(sentence))