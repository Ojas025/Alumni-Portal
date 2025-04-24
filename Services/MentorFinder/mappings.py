# Skill Mapping: Normalizes variations of skills to a canonical form
skill_mapping = {
    # Python & Related
    "python": "python", "python3": "python", "python 3": "python", "python2": "python", "python 2": "python",
    "ipython": "python", "jupyter": "jupyter notebooks",

    # JavaScript & Variants
    "javascript": "javascript", "js": "javascript", "ecmascript": "javascript", "es6": "javascript",
    "typescript": "typescript", "ts": "typescript",

    # Java & Related
    "java": "java", "jdk": "java", "jre": "java", "java ee": "java",

    # C-family Languages
    "c++": "c++", "cpp": "c++", "c#": "c#", "c sharp": "c#", "c": "c",

    # Rust & Go
    "rust": "rust", "go": "go", "golang": "go",

    # Scripting
    "bash": "bash scripting", "bash script": "bash scripting", "shell": "shell scripting",
    "shell script": "shell scripting", "powershell": "powershell",

    # Frontend Frameworks
    "react": "react", "reactjs": "react", "react js": "react", "react.js": "react",
    "angular": "angular", "angularjs": "angular", "angular js": "angular",
    "vue": "vue", "vuejs": "vue", "vue.js": "vue",
    "svelte": "svelte", "sveltekit": "svelte", "jquery": "jquery",
    "nextjs": "next.js", "next.js": "next.js", "nuxtjs": "nuxt.js", "nuxt.js": "nuxt.js",

    # Frontend Tech
    "html": "html", "html5": "html", "css": "css", "css3": "css", "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss", "material ui": "material ui", "mui": "material ui", "bootstrap": "bootstrap",
    "sass": "sass", "scss": "sass", "less": "less",

    # Backend & Fullstack
    "node": "node.js", "nodejs": "node.js", "node.js": "node.js",
    "express": "express.js", "expressjs": "express.js", "express.js": "express.js",
    "django": "django", "flask": "flask", "fastapi": "fastapi", "laravel": "laravel",
    "spring": "spring framework", "spring boot": "spring boot", "springboot": "spring boot",
    "ruby on rails": "ruby on rails", "rails": "ruby on rails",
    ".net": ".net framework", ".net core": ".net core", "dotnet core": ".net core",
    "asp.net": "asp.net", "asp.net core": "asp.net core",
    "fullstack": "fullstack development", "full-stack": "fullstack development",
    "full stack development": "fullstack development",
    "backend": "backend development", "frontend": "frontend development",

    # Databases
    "mysql": "mysql", "postgres": "postgresql", "postgresql": "postgresql", "sql server": "microsoft sql server",
    "mssql": "microsoft sql server", "sqlite": "sqlite", "oracle": "oracle database",
    "oracle database": "oracle database", "mongodb": "mongodb", "mongo": "mongodb", "redis": "redis",
    "cassandra": "cassandra", "neo4j": "neo4j", "elasticsearch": "elasticsearch", "dynamodb": "dynamodb",
    "firebase": "firebase", "supabase": "supabase",

    # Data & ML
    "ml": "machine learning", "machine learning": "machine learning",
    "dl": "deep learning", "deep learning": "deep learning",
    "ai": "artificial intelligence", "artificial intelligence": "artificial intelligence",
    "nlp": "nlp", "natural language processing": "nlp",
    "computer vision": "computer vision", "cv": "computer vision",
    "data science": "data science", "ds": "data science",
    "data analysis": "data analysis", "data analytics": "data analysis",
    "data engineering": "data engineering", "big data": "big data",

    # Python Libraries
    "pandas": "pandas", "numpy": "numpy", "scikit-learn": "scikit-learn", "sklearn": "scikit-learn",
    "tensorflow": "tensorflow", "keras": "keras", "pytorch": "pytorch",
    "matplotlib": "matplotlib", "seaborn": "seaborn", "plotly": "plotly",
    "xgboost": "xgboost", "lightgbm": "lightgbm", "sqlalchemy": "sqlalchemy", "airflow": "airflow",

    # DevOps
    "docker": "docker", "kubernetes": "kubernetes", "k8s": "kubernetes",
    "ci/cd": "ci/cd", "jenkins": "jenkins", "github actions": "github actions", "gitlab ci": "gitlab ci/cd",
    "terraform": "terraform", "ansible": "ansible", "puppet": "puppet", "chef": "chef",
    "monitoring": "monitoring", "prometheus": "prometheus", "grafana": "grafana",
    "devops": "devops", "mlops": "mlops",

    # Cloud
    "aws": "aws", "amazon web services": "aws",
    "azure": "microsoft azure", "microsoft azure": "microsoft azure",
    "gcp": "google cloud platform", "google cloud": "google cloud platform",
    "google cloud platform": "google cloud platform", "digitalocean": "digitalocean",

    # Software Practices
    "oop": "object oriented programming", "object oriented programming": "object oriented programming",
    "fp": "functional programming", "functional programming": "functional programming",
    "api": "api design", "apis": "api design", "api design": "api design",
    "rest": "restful apis", "restful": "restful apis", "restful apis": "restful apis",
    "graphql": "graphql", "microservices": "microservices",
    "system design": "system design", "distributed systems": "distributed systems",
    "software architecture": "software architecture",

    # Security
    "cybersecurity": "cybersecurity", "cyber security": "cybersecurity",
    "infosec": "information security", "information security": "information security",
    "pentesting": "penetration testing", "penetration testing": "penetration testing",
    "threat modeling": "threat modeling", "network security": "network security",
    "cloud security": "cloud security", "application security": "application security",

    # Tools
    "git": "git", "svn": "svn", "jira": "jira", "excel": "microsoft excel",
    "microsoft excel": "microsoft excel", "jupyter notebooks": "jupyter notebooks",
    "notion": "notion", "figma": "figma", "vscode": "visual studio code",

    # Analytics & BI
    "tableau": "tableau", "powerbi": "power bi", "power bi": "power bi", "looker": "looker",
    "superset": "apache superset", "metabase": "metabase",

    # Project & Agile
    "agile": "agile methodologies", "scrum": "scrum", "kanban": "kanban",
    "project management": "project management", "product management": "product management",

    # Testing
    "qa": "quality assurance", "quality assurance": "quality assurance",
    "software testing": "software testing", "testing": "software testing",
    "unit testing": "unit testing", "integration testing": "integration testing",
    "jest": "jest", "mocha": "mocha", "cypress": "cypress", "playwright": "playwright",

    # Soft Skills
    "communication": "communication", "leadership": "leadership", "teamwork": "teamwork",
    "problem solving": "problem solving", "mentoring": "mentoring", "public speaking": "public speaking",
    "technical writing": "technical writing", "time management": "time management",
    "collaboration": "collaboration", "critical thinking": "critical thinking",

    # Emerging Technologies
    "web3": "web3", "web3.js": "web3.js", "solidity": "solidity", "blockchain": "blockchain",
    "quantum computing": "quantum computing", "edge computing": "edge computing",
    "low-code": "low-code development", "no-code": "no-code development"
}

# Known Skills: Comprehensive list of recognized skills
known_skills = [
    # Web Development
    # Backend
    "node.js", "express.js", "django", "flask", "fastapi", "laravel", "spring boot", "ruby on rails", ".net core",
    "asp.net core", "graphql", "restful apis", "web sockets", "redis", "mongodb", "postgresql", "mysql",
    "elasticsearch", "dynamodb", "firebase", "supabase", "sqlalchemy", "airflow", "rabbitmq", "kafka",

    # Frontend
    "html", "css", "javascript", "typescript", "react", "angular", "vue.js", "svelte", "next.js", "nuxt.js",
    "jquery", "tailwindcss", "bootstrap", "material ui", "sass", "less", "responsive design", "progressive web apps",
    "server-side rendering", "web components", "webgl", "web assembly", "chakra ui", "ant design",

    # Full-stack Frameworks
    "fullstack development", "backend development", "frontend development", "microservices", "serverless",
    "nestjs", "strapi", "contentful", "prisma", "meteor.js", "blitz.js", "remix", "gatsby",

    # UI/UX
    "figma", "sketch", "adobe xd", "invision", "zeplin", "wireframes", "prototypes", "material design",
    "atomic design", "uxpin", "framer", "storybook", "user experience design", "user interface design",

    # Web Servers & Hosting
    "nginx", "apache", "cloudflare", "aws amplify", "netlify", "vercel", "firebase hosting", "heroku", "digitalocean",

    # Version Control
    "git", "github", "gitlab", "bitbucket", "pull requests", "code reviews", "branching strategies",
    "continuous integration", "github actions", "gitlab ci/cd",

    # Mobile Development
    # Cross-platform
    "react native", "flutter", "ionic", "xamarin", "cordova", "expo", "capacitor", "progressive web apps",

    # Android
    "kotlin", "java", "android sdk", "android studio", "jetpack", "retrofit", "room", "rxjava", "dagger", "hilt",
    "coroutines", "material design components", "android architecture components",

    # iOS
    "swift", "objective-c", "xcode", "swiftui", "uikit", "core data", "realm", "core animation", "combine",
    "push notifications", "app store connect", "testflight",

    # Data Science & Machine Learning
    # ML Libraries
    "scikit-learn", "tensorflow", "keras", "pytorch", "xgboost", "lightgbm", "catboost", "fastai", "mlflow",
    "huggingface", "transformers", "tensorflow lite", "pytorch lightning",

    # Data Processing
    "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly", "tableau", "power bi", "metabase",
    "data visualization", "data analysis", "data engineering", "feature engineering", "time series analysis",
    "clustering", "anomaly detection", "big data", "apache spark",

    # NLP
    "nlp", "spacy", "nltk", "gensim", "bert", "transformers", "sentiment analysis", "topic modeling",
    "word embeddings", "named entity recognition",

    # DevOps & Automation
    "docker", "kubernetes", "helm", "terraform", "ansible", "jenkins", "github actions", "gitlab ci/cd",
    "prometheus", "grafana", "cloudformation", "mlops", "continuous deployment", "infrastructure as code",

    # Cloud Platforms
    "aws", "microsoft azure", "google cloud platform", "digitalocean", "aws sagemaker", "azure ml", "gcp ai",
    "aws lambda", "aws s3", "aws ec2", "firebase", "supabase",

    # Cybersecurity
    "cybersecurity", "penetration testing", "ethical hacking", "nmap", "metasploit", "wireshark", "owasp",
    "cloud security", "application security", "network security", "cryptography", "incident response",

    # Blockchain
    "blockchain", "ethereum", "solidity", "webunistd:3.js", "smart contracts", "nft", "decentralized apps", "ipfs",

    # Emerging Technologies
    "quantum computing", "edge computing", "low-code development", "no-code development", "iot", "mqtt",
    "raspberry pi", "arduino", "embedded systems",

    # Soft Skills & Mentorship
    "mentoring", "technical writing", "public speaking", "communication", "leadership", "teamwork",
    "problem solving", "time management", "collaboration", "critical thinking", "open-source contribution",

    # Testing
    "unit testing", "integration testing", "jest", "mocha", "cypress", "playwright", "quality assurance",

    # Project Management
    "agile methodologies", "scrum", "kanban", "project management", "product management"
]

# Skill Expansion: Maps skills to related skills for graph-based matching
skill_expansion = {
    # Web Development
    "web development": [
        "html", "css", "javascript", "typescript", "react", "angular", "vue.js", "svelte", "next.js", "nuxt.js",
        "jquery", "tailwindcss", "bootstrap", "material ui", "sass", "responsive design", "progressive web apps",
        "server-side rendering", "webgl", "web assembly", "graphql", "restful apis", "node.js", "express.js",
        "django", "flask", "fastapi", "laravel", "spring boot", "ruby on rails", "firebase", "supabase",
        "webpack", "npm", "yarn", "vercel", "netlify", "heroku", "digitalocean", "api design", "microservices"
    ],

    # Backend Development
    "backend development": [
        "node.js", "express.js", "django", "flask", "fastapi", "laravel", "spring boot", "ruby on rails", ".net core",
        "graphql", "restful apis", "web sockets", "redis", "mongodb", "postgresql", "mysql", "dynamodb",
        "elasticsearch", "rabbitmq", "kafka", "sqlalchemy", "airflow", "docker", "kubernetes", "serverless",
        "nginx", "apache", "microservices", "api design", "jwt", "oauth", "cloud computing"
    ],

    # Full-stack Development
    "fullstack development": [
        "frontend development", "backend development", "html", "css", "javascript", "react", "node.js",
        "express.js", "mongodb", "postgresql", "graphql", "restful apis", "docker", "kubernetes", "aws",
        "firebase", "supabase", "ci/cd", "github actions", "microservices", "serverless", "system design"
    ],

    # Mobile Development
    "mobile development": [
        "react native", "flutter", "ionic", "xamarin", "kotlin", "java", "swift", "objective-c", "android sdk",
        "swiftui", "uikit", "core data", "firebase", "expo", "capacitor", "push notifications", "app store connect",
        "testflight", "android studio", "xcode", "mobile testing", "cross-platform development"
    ],

    # Data Science
    "data science": [
        "python", "numpy", "pandas", "scikit-learn", "tensorflow", "pytorch", "matplotlib", "seaborn", "plotly",
        "data analysis", "data visualization", "data engineering", "feature engineering", "time series analysis",
        "clustering", "anomaly detection", "sql", "tableau", "power bi", "metabase", "jupyter notebooks",
        "sqlalchemy", "airflow", "big data", "apache spark", "machine learning", "deep learning", "nlp"
    ],

    # Machine Learning
    "machine learning": [
        "scikit-learn", "tensorflow", "keras", "pytorch", "xgboost", "lightgbm", "catboost", "fastai",
        "supervised learning", "unsupervised learning", "deep learning", "neural networks", "nlp",
        "computer vision", "reinforcement learning", "clustering", "classification", "regression",
        "feature engineering", "model deployment", "mlops", "huggingface", "transformers"
    ],

    # Cloud Computing
    "cloud computing": [
        "aws", "microsoft azure", "google cloud platform", "digitalocean", "aws lambda", "aws s3", "aws ec2",
        "firebase", "supabase", "terraform", "cloudformation", "kubernetes", "docker", "serverless",
        "cloud security", "cloud architecture", "aws sagemaker", "azure ml", "gcp ai"
    ],

    # DevOps
    "devops": [
        "docker", "kubernetes", "helm", "terraform", "ansible", "jenkins", "github actions", "gitlab ci/cd",
        "prometheus", "grafana", "continuous integration", "continuous deployment", "infrastructure as code",
        "cloudformation", "mlops", "monitoring", "logging"
    ],

    # Cybersecurity
    "cybersecurity": [
        "penetration testing", "ethical hacking", "nmap", "metasploit", "wireshark", "owasp", "cloud security",
        "application security", "network security", "cryptography", "incident response", "devsecops",
        "vulnerability assessment", "security auditing"
    ],

    # Blockchain
    "blockchain": [
        "ethereum", "solidity", "web3.js", "smart contracts", "nft", "decentralized apps", "ipfs",
        "cryptography", "proof of work", "proof of stake", "blockchain security", "defi"
    ],

    # Software Architecture
    "software architecture": [
        "system design", "distributed systems", "microservices", "api design", "restful apis", "graphql",
        "cloud architecture", "scalability", "fault tolerance", "load balancing"
    ],

    # Technical Mentorship
    "technical mentorship": [
        "mentoring", "technical writing", "public speaking", "communication", "leadership", "teamwork",
        "problem solving", "open-source contribution", "code reviews", "knowledge sharing"
    ],

    # Emerging Technologies
    "quantum computing": [
        "quantum algorithms", "qiskit", "cirq", "quantum circuits", "quantum machine learning"
    ],
    "edge computing": [
        "iot", "mqtt", "raspberry pi", "arduino", "embedded systems", "real-time processing"
    ]
}    

# Known Languages: List of natural languages for matching
known_languages = [
    "english", "spanish", "french", "german", "italian", "portuguese", "dutch", "russian", "mandarin", "cantonese",
    "japanese", "korean", "arabic", "hindi", "bengali", "urdu", "punjabi", "tamil", "telugu", "marathi", "gujarati",
    "malayalam", "kannada", "odia", "assamese", "sinhala", "thai", "vietnamese", "malay", "tagalog", "swahili",
    "hebrew", "persian", "turkish", "polish", "ukrainian", "czech", "slovak", "serbian", "croatian", "bulgarian",
    "romanian", "greek", "swedish", "norwegian", "danish", "finnish", "latvian", "lithuanian", "estonian",
    "afrikaans", "zulu", "xhosa", "hausa", "yoruba", "igbo", "amharic", "somali", "quechua", "inuktitut", "maori"
]