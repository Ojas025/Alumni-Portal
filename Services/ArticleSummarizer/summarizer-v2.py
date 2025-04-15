from transformers import pipeline, AutoTokenizer
import time
import torch

print("GPU: ", torch.cuda.is_available())

start_time = time.time()

model = "facebook/bart-large-cnn"
# model = "t5-base"
tokenizer = AutoTokenizer.from_pretrained(model)
summarizer = pipeline('summarization', model=model, tokenizer=tokenizer, num_beams=4)

def get_chunk_from_text(text, chunk_size=700, overlap=100):
    tokens = tokenizer.encode(text, truncation=False)
    token_count = len(tokens)
    start = 0 

    chunk_vector = []
    while start < token_count:
        end = min(start + chunk_size, token_count)

        chunk = tokens[start:end]
        chunk = tokenizer.decode(chunk, skip_special_tokens=True) 

        if chunk.strip():
            chunk_vector.append(chunk)

        start += chunk_size - overlap

    return chunk_vector  

def generate_summary(text, base_min_length=120, base_max_length=512):
    try:       
        if (not text or text.isspace()):
            return { 'error': 'Input text is empty' } 
        
        tokens = tokenizer.encode(text, truncation=False)
        token_count = len(tokens)

        if token_count <= 1024:
            summary = summarizer(text, min_length=base_min_length, max_length=base_max_length, do_sample=False)
            return { 'summary': summary[0]['summary_text'] }
        else:
            chunk_vector = get_chunk_from_text(text, 700, 100)

            if (not chunk_vector):
                return { 'error': 'Error creating chunks' } 

            summary_vector = []

            min_len = max(int(base_min_length / len(chunk_vector)), 30)
            max_len = max(int(base_max_length / len(chunk_vector)), 100)

            if min_len > max_len:
                min_len = max_len // 2

            for chunk in chunk_vector:
                chunk_summary = summarizer(chunk, max_length=min_len, min_length=max_len, do_sample=False)
                summary_vector.append(chunk_summary[0]['summary_text'])

            return { 'summary': ' '.join(summary_vector) } 

    except Exception as e:
        return f"Error summarizing the text: {str(e)}" 



article = '''
The Transformative Power and Future of Artificial Intelligence

In recent years, the landscape of technology has undergone significant transformations, primarily driven by advancements in artificial intelligence (AI) and machine learning. These innovations have not only changed the way we interact with devices but also revolutionized entire industries, from healthcare to finance. At the core, artificial intelligence refers to the simulation of human intelligence processes by machines, particularly computer systems. These processes include learning, reasoning, and self-correction. AI has found widespread applications in areas such as expert systems, natural language processing, speech recognition, and machine vision.

A vital subset of AI is machine learning, which focuses on the development of computer programs capable of learning from data. Rather than being explicitly programmed for every task, these systems identify patterns in data and use this knowledge to make improved decisions over time. The learning process can stem from examples, experience, or direct instruction, making it a dynamic and adaptive tool in the modern digital ecosystem.

One of the most impactful arenas for AI application is healthcare. AI-driven tools are increasingly supporting medical professionals by predicting patient diagnoses, recommending personalized treatment plans, and identifying hidden patterns within clinical data—some of which may be imperceptible to the human eye. These capabilities are helping to enhance accuracy, efficiency, and outcomes in medical practice.

In the financial world, AI algorithms are revolutionizing how transactions are processed and risks are assessed. From detecting fraud to evaluating creditworthiness and providing tailored banking services, AI technologies are streamlining operations and boosting user experiences. Additionally, automated trading systems, powered by real-time data analysis, now execute trades at speeds and with precision beyond human capabilities.

Despite these tremendous advancements, the integration of AI into society comes with pressing ethical concerns. Topics such as data privacy, algorithmic bias, and the displacement of human jobs have sparked widespread debate. The need for transparency and accountability in how AI systems are developed and deployed is becoming increasingly urgent. As such, creating governance frameworks that ensure responsible innovation is essential.

Education is another sector experiencing the positive ripple effects of AI. Intelligent tutoring systems are leveraging machine learning to deliver personalized learning experiences tailored to each student’s unique pace, strengths, and learning styles. This customization holds the promise of closing educational gaps and enhancing learning outcomes across diverse populations.

As AI technology continues to evolve, it becomes crucial to foster collaboration between technologists, ethicists, educators, and regulators. Only through joint efforts can we create robust standards that guide ethical AI development and equitable access. This collaborative spirit will be instrumental in aligning powerful technological advancements with societal values.

The future of artificial intelligence is bright, full of potential for innovation and transformation. However, this journey demands a careful balance between rapid progress and responsible use. Ensuring that AI evolves in harmony with human values will be key to building a future that is inclusive, ethical, and sustainable for all.'''

long_text = """
The evolution of technology has been one of the most transformative forces in human history. From the earliest tools made of stone and wood to the modern marvels of quantum computing and artificial intelligence, each stage of technological development has reshaped the way humans live, work, and think. In ancient times, the invention of the wheel, the plow, and the written word laid the foundations for organized societies, agriculture, and historical record-keeping. As civilizations grew, so did their innovations. The Roman aqueducts, Chinese papermaking, and Arab advancements in mathematics and astronomy all played crucial roles in shaping global development.

Fast forward to the 18th and 19th centuries, the Industrial Revolution marked a significant turning point. Machines began replacing manual labor, leading to mass production, urbanization, and the rise of the modern workforce. Electricity, the telephone, and the internal combustion engine revolutionized communication, mobility, and industry. This era not only changed how goods were produced but also triggered cultural shifts, labor movements, and redefined social classes.

The 20th century introduced a new wave of technological transformation. The invention of the airplane and the automobile made the world smaller, while the discovery of penicillin and vaccines extended human life expectancy. The space race, driven by Cold War competition, resulted in monumental achievements like landing a man on the moon and the creation of satellite technology, which today powers GPS, weather forecasting, and global communications.

Perhaps the most influential development of the 20th century was the rise of computers. Originally massive, room-sized machines used for military and academic purposes, computers became personal, portable, and omnipresent within just a few decades. The internet, born from academic research and military necessity, blossomed into the global information highway. Email, websites, and later, social media, transformed how people communicate, access information, and perceive the world.

Artificial intelligence, once a theoretical concept, is now embedded in everyday life. From recommendation systems on streaming platforms to facial recognition software and autonomous vehicles, AI has permeated every industry. In healthcare, AI aids in diagnostics and drug discovery. In finance, it analyzes market trends and detects fraud. In education, adaptive learning platforms personalize lessons to individual student needs. Yet, with this power comes responsibility. Ethical concerns surrounding AI—such as bias, job displacement, and data privacy—continue to spark debates among technologists, ethicists, and policymakers.

While technology has brought undeniable progress, it has also introduced complex challenges. The rise of social media, for example, has redefined human interaction but also contributed to mental health issues, misinformation, and political polarization. The convenience of e-commerce has revolutionized shopping but has also disrupted traditional retail and raised concerns about environmental sustainability due to increased packaging and delivery emissions.

Moreover, the digital divide remains a pressing issue. While some populations enjoy gigabit internet and smart homes, others lack access to basic digital infrastructure. Bridging this gap is crucial to ensure that technological progress benefits all of humanity, not just the privileged few. Efforts are underway to expand internet access to rural and underserved communities through low-orbit satellites, community mesh networks, and government programs.

Looking ahead, emerging technologies like quantum computing, biotechnology, and space colonization promise to once again reshape the human experience. Quantum computers could solve problems deemed intractable by classical computers, revolutionizing fields like cryptography, materials science, and pharmaceuticals. Biotechnology may lead to personalized medicine, lab-grown organs, and solutions to food scarcity. Meanwhile, private companies and international space agencies alike are eyeing the moon, Mars, and beyond as the next frontier for exploration and perhaps even habitation.

Climate technology is another area gaining momentum. As the world grapples with the effects of climate change, innovation is focusing on carbon capture, renewable energy storage, and sustainable agriculture. Smart grids, electric vehicles, and energy-efficient buildings are just the beginning. The fusion of environmental science and engineering offers hope for mitigating the worst effects of global warming.

However, the rapid pace of innovation also raises philosophical questions. What does it mean to be human in an age of machines that can learn, create, and perhaps even feel? How do we preserve individuality, creativity, and compassion in a world increasingly driven by algorithms and automation? These are not questions with easy answers, but they are essential to consider as we navigate the future.

In conclusion, technology has been both a tool and a force—a tool to solve problems and enhance life, and a force that reshapes societies in profound and often unpredictable ways. Its story is one of triumphs and tensions, of promise and peril. As we move forward, the challenge will be not just to innovate, but to do so thoughtfully, inclusively, and ethically. After all, the future is not something that just happens—it is something we create.
"""


tokens = tokenizer.encode(article, truncation=False)
print("\ntokens: ", tokens)
token_count = len(tokens)

min_length = int(token_count * 0.15)
max_length = int(token_count * 0.35) 

min_length = max(min_length, 30)
max_length = min(max_length, 512)

print(f"\nSummary using: {model}:")
summary = generate_summary(long_text, min_length, max_length)

end_time = time.time()    

print(summary)
print('\nTime Taken: ', end_time - start_time)
print('-'*100)

     