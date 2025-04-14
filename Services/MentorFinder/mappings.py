skill_mapping = {
    # Python & Related
    "python": "python", "python3": "python", "python 3": "python", "python2": "python", "python 2": "python",

    # JavaScript & Variants
    "javascript": "javascript", "js": "javascript", "ecmascript": "javascript",

    # Java & Related
    "java": "java", "jdk": "java", "jre": "java",

    # C-family Languages
    "c++": "c++", "cpp": "c++", "c#": "c#", "c sharp": "c#", "c": "c",

    # Scripting
    "bash": "bash scripting", "bash script": "bash scripting", "shell": "shell scripting", "shell script": "shell scripting",

    # Frontend Frameworks
    "react": "react", "reactjs": "react", "react js": "react", "react.js": "react",
    "angular": "angular", "angularjs": "angular", "angular js": "angular",
    "vue": "vue", "vuejs": "vue", "vue.js": "vue",
    "svelte": "svelte", "jquery": "jquery",

    # Frontend Tech
    "html": "html", "html5": "html", "css": "css", "css3": "css", "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss", "material ui": "material ui", "mui": "material ui", "bootstrap": "bootstrap",

    # Backend & Fullstack
    "node": "node.js", "nodejs": "node.js", "node.js": "node.js",
    "express": "express.js", "expressjs": "express.js", "express.js": "express.js",
    "django": "django", "flask": "flask", "laravel": "laravel",
    "spring": "spring framework", "spring boot": "spring boot", "springboot": "spring boot",
    "ruby on rails": "ruby on rails", "rails": "ruby on rails",
    ".net": ".net framework", ".net core": ".net core", "dotnet core": ".net core",
    "asp.net": "asp.net", "asp.net core": "asp.net core",
    "fullstack": "fullstack development", "full-stack": "fullstack development", "full stack development": "fullstack development",
    "backend": "backend development", "frontend": "frontend development",

    # Databases
    "mysql": "mysql", "postgres": "postgresql", "postgresql": "postgresql", "sql server": "microsoft sql server",
    "mssql": "microsoft sql server", "sqlite": "sqlite", "oracle": "oracle database", "oracle database": "oracle database",
    "mongodb": "mongodb", "mongo": "mongodb", "redis": "redis", "cassandra": "cassandra",
    "neo4j": "neo4j", "elasticsearch": "elasticsearch", "dynamodb": "dynamodb", "firebase": "firebase",

    # Data & ML
    "ml": "machine learning", "machine learning": "machine learning",
    "dl": "deep learning", "deep learning": "deep learning",
    "ai": "artificial intelligence", "artificial intelligence": "artificial intelligence",
    "nlp": "nlp", "natural language processing": "nlp",
    "computer vision": "computer vision", "cv": "computer vision",
    "data science": "data science", "ds": "data science",
    "data analysis": "data analysis", "data analytics": "data analysis",
    "data engineering": "data engineering",

    # Python Libraries
    "pandas": "pandas", "numpy": "numpy", "scikit-learn": "scikit-learn", "sklearn": "scikit-learn",
    "tensorflow": "tensorflow", "keras": "keras", "pytorch": "pytorch",
    "matplotlib": "matplotlib", "seaborn": "seaborn", "xgboost": "xgboost", "lightgbm": "lightgbm",

    # DevOps
    "docker": "docker", "kubernetes": "kubernetes", "k8s": "kubernetes",
    "ci/cd": "ci/cd", "jenkins": "jenkins", "github actions": "github actions", "gitlab ci": "gitlab ci/cd",
    "terraform": "terraform", "ansible": "ansible",
    "monitoring": "monitoring", "prometheus": "prometheus", "grafana": "grafana",
    "devops": "devops",

    # Cloud
    "aws": "aws", "amazon web services": "aws",
    "azure": "microsoft azure", "microsoft azure": "microsoft azure",
    "gcp": "google cloud platform", "google cloud": "google cloud platform",
    "google cloud platform": "google cloud platform",

    # Software Practices
    "oop": "object oriented programming", "object oriented programming": "object oriented programming",
    "fp": "functional programming", "functional programming": "functional programming",
    "api": "api design", "apis": "api design", "api design": "api design",
    "rest": "restful apis", "restful": "restful apis", "restful apis": "restful apis",
    "graphql": "graphql", "microservices": "microservices",
    "system design": "system design", "distributed systems": "distributed systems",

    # Security
    "cybersecurity": "cybersecurity", "cyber security": "cybersecurity",
    "infosec": "information security", "information security": "information security",
    "pentesting": "penetration testing", "penetration testing": "penetration testing",
    "threat modeling": "threat modeling", "network security": "network security",
    "cloud security": "cloud security", "application security": "application security",

    # Tools
    "git": "git", "svn": "svn", "jira": "jira", "excel": "microsoft excel",
    "microsoft excel": "microsoft excel", "jupyter": "jupyter notebooks", "jupyter notebooks": "jupyter notebooks",
    "notion": "notion", "figma": "figma",

    # Analytics & BI
    "tableau": "tableau", "powerbi": "power bi", "power bi": "power bi", "looker": "looker", "superset": "apache superset",

    # Project & Agile
    "agile": "agile methodologies", "scrum": "scrum", "kanban": "kanban", "project management": "project management",
    "product management": "product management",

    # Testing
    "qa": "quality assurance", "quality assurance": "quality assurance",
    "software testing": "software testing", "testing": "software testing",
    "unit testing": "unit testing", "integration testing": "integration testing",
    "jest": "jest", "mocha": "mocha", "cypress": "cypress",

    # Soft Skills (optional)
    "communication": "communication", "leadership": "leadership", "teamwork": "teamwork", "problem solving": "problem solving"
}

known_skills = [
    # Web Development
    # Frontend
    "html", "css", "javascript", "typescript", "react", "angular", "vue.js", "svelte", "jquery", "ajax", "json", "web components",
    "dom manipulation", "canvas", "webgl", "web assembly", "pwa", "responsive design", "progressive web apps", "server-side rendering",
    "tailwind css", "bootstrap", "bulma", "foundation", "materialize", "semantic ui", "chakra ui", "ant design", "scss", "sass",
    
    # Backend
    "node.js", "express", "koa", "hapi", "django", "flask", "rails", "laravel", "spring", "spring boot", "django rest framework",
    "graphql", "rest apis", "graphql apis", "web sockets", "firebase", "redis", "mongodb", "postgresql", "mysql", "mongodb atlas",
    "elasticsearch", "apollo server", "socket.io", "redis pubsub", "auth0", "jwt", "passport.js", "oauth", "bcrypt", "json web tokens",
    
    # Full-stack Frameworks
    "next.js", "nuxt.js", "gatsby", "remix", "angular universal", "meteor.js", "next.js", "serverless", "nestjs", "flask", "spring boot",
    "ember.js", "feather.js", "blitz.js", "strapi", "contentful", "sanity", "prisma", "moleculer", "hapi.js", "vert.x", "nuxt.js", "graphql code generator",
    
    # UI/UX Libraries & Tools
    "figma", "sketch", "adobe xd", "invision", "zeplin", "mockups", "wireframes", "material design", "atomic design", "uxpin", "framer",
    "principle", "marvel app", "storybook", "react-storybook", "figma design systems", "react-bootstrap", "chakra UI", "tailwind CSS",
    
    # Web Servers & Hosting
    "nginx", "apache", "lighttpd", "iis", "cloudflare", "aws amplify", "netlify", "vercel", "firebase hosting", "heroku", "docker", "caddy", "gitlab ci",
    
    # Version Control
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial", "bitbucket pipelines", "git flow", "git rebase", "git merge", "commitizen", "git hooks",
    "source control", "continuous integration", "git submodules", "code reviews", "branching strategies", "pull requests", "merge conflicts",

    # Mobile Development
    # Cross-platform
    "react native", "flutter", "ionic", "xamarin", "cordova", "phonegap", "kapacitor", "framework7", "sencha touch", "native script",
    "quasar", "expo", "capacitor", "progressive web apps (pwa)", "electron",
    
    # Android Development
    "kotlin", "java", "android sdk", "android studio", "gradle", "jetpack", "retrofit", "room", "firebase", "rxjava", "dagger", "hilt", "coroutines", "kotlin flow",
    "material design components", "android architecture components", "activity", "fragment", "views", "constraint layout", "lifecycle aware components",
    
    # iOS Development
    "swift", "objective-c", "xcode", "cocoa", "cocoa touch", "swiftui", "ui kit", "reactivecocoa", "firebase for iOS", "core data", "realm", "core animation", "core graphics",
    "core motion", "avfoundation", "combine", "push notifications", "local notifications", "app store", "xamarin", "swift package manager", "unit testing in ios",
    
    # Mobile App Deployment
    "app store connect", "google play console", "app distribution", "beta testing", "crashlytics", "testflight", "firebase app distribution", "app releases", "apk", "ipa",
    
    # Tools & Libraries
    "android jetpack", "firebase", "graphql", "graphql subscriptions", "redux", "mobx", "realm database", "sqflite", "sqlite", "camera", "image picker",
    "react navigation", "react hooks", "redux-thunk", "redux-saga", "socket.io", "graphql apollo", "graphql query", "firebase firestore", "firebase analytics",
    "aws amplify",

    # Data Science & Machine Learning
    # Machine Learning Libraries
    "scikit-learn", "tensorflow", "keras", "pytorch", "xgboost", "lightgbm", "catboost", "fastai", "h2o.ai", "dask", "hyperopt", "mlflow", 
    "pmdarima", "tensorflow lite", "pytorch lightning", "autoencoders", "deep learning", "reinforcement learning", "gpt-3", "bert", "vgg", "resnet",
    
    # Data Processing & Analysis
    "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly", "altair", "bokeh", "ggplot", "tableau", "power bi", "openCV", "image processing",
    "data cleaning", "data wrangling", "data visualization", "data exploration", "EDA", "statistical modeling", "hypothesis testing", "regression analysis",
    "multivariate analysis", "time series forecasting", "data imputation", "feature engineering", "feature selection", "clustering", "dimensionality reduction",
    "principal component analysis", "k-means clustering", "dbscan", "pca", "tsne", "factor analysis", "association rule learning", "anomaly detection",
    
    # Natural Language Processing
    "nlp", "spacy", "nltk", "gensim", "bert", "transformers", "tokenization", "lemmatization", "stemming", "text mining", "text classification", "sentiment analysis",
    "topic modeling", "word2vec", "glove", "word embeddings", "named entity recognition", "language models", "question answering", "summarization", "machine translation",
    
    # Model Deployment & Monitoring
    "docker", "kubernetes", "flask", "fastapi", "api gateway", "rest apis", "deployment pipelines", "ci/cd", "mlops", "mlflow", "tensorflow serving", "seldon",
    "prometheus", "grafana", "model monitoring", "model versioning", "model registry", "cloud ai", "model serving", "kubeflow", "scikit-learn pipelines",
    
    # Cloud Platforms
    "aws sagemaker", "gcp ai", "google cloud ml", "azure ml", "databricks", "ml studio", "bigquery", "snowflake", "redshift", "data lakes", "hadoop", "spark",
    
    # Algorithms & Concepts
    "supervised learning", "unsupervised learning", "classification", "regression", "clustering", "neural networks", "decision trees", "svm", "k-nearest neighbors",
    "random forests", "bayesian networks", "gradient boosting", "adaboost", "recurrent neural networks", "convolutional neural networks", "gan", "autoencoders",
    "markov chains", "reinforcement learning", "q-learning", "policy gradient", "genetic algorithms", "simulated annealing",

    # DevOps & Automation
    # Containerization & Orchestration
    "docker", "kubernetes", "helm", "docker compose", "openshift", "rancher", "podman", "containerd", "terraform", "ansible", "puppet", 
    "chef", "saltstack", "vagrant", "consul", "etcd", "vault", "cloudformation", "cicd", "jenkins", "gitlab ci", "circleci", "travis ci",
    "buildkite", "appveyor", "argo", "spinnaker", "flux", "kubeless", "openstack", "nomad", "digital ocean", "docker swarm", "ecs", "eks",
    
    # Monitoring & Logging
    "prometheus", "grafana", "elasticsearch", "logstash", "kibana", "splunk", "zabbix", "new relic", "datadog", "nagios", "appdynamics", "cloudwatch",
    "azure monitor", "stackdriver", "semaphore", "turing", "alertmanager", "grafana loki", "opentelemetry", "telegraf", "opsgenie", "pagerduty",
    
    # Cloud Providers
    "aws", "azure", "google cloud", "gcp", "aws lambda", "aws s3", "aws ec2", "azure devops", "azure pipelines", "aws rds", "aws cloudfront",
    "digital ocean", "cloudflare", "heroku", "netlify", "firebase", "openstack", "oracle cloud", "alibaba cloud", "rackspace", "k8s", "serverless",
    
    # Version Control & Automation
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial", "ci/cd", "webhooks", "automation", "configuration management", "ci pipeline",
    "cloudformation", "terraform", "jenkins pipeline", "circleci pipelines", "gitlab pipelines", "build automation", "maven", "gradle", "ant",
    "artifact repositories", "nexus", "artifactory", "pipeline as code", "infrastructure as code",
    
    # Security & Compliance
    "devsecops", "tls", "ssl", "oauth", "openid", "kubernetes security", "cloud security", "identity access management", "compliance", "pci dss",
    "cis benchmarks", "security scanning", "pen testing", "vulnerability management", "ci security", "siem", "firewall", "vpn", "secret management",
    "iam", "zero trust", "oauth2", "saml", "api security", "ssl/tls certificates", "keycloak", "okta",
    
    # Cybersecurity
    # Penetration Testing
    "ethical hacking", "nmap", "kali linux", "metasploit", "burp suite", "owasp", "penetration testing", "sql injection", "xss", "csrf", "osint", 
    "dns spoofing", "snort", "nikto", "john the ripper", "hydra", "hashcat", "fuzzing", "ncat", "aircrack-ng", "wireshark", "paros proxy", "w3af",
    
    # Incident Response & Forensics
    "incident response", "digital forensics", "malware analysis", "pcap analysis", "wireshark", "sysinternals", "ftk imager", "autopsy", 
    "splunk", "elasticsearch", "logstash", "kibana", "forensic analysis", "memory analysis", "packet analysis", "tcpdump", "the harvester", "crowdstrike",
    
    # Encryption & Cryptography
    "aes", "rsa encryption", "public key cryptography", "sha256", "sha3", "md5", "hmac", "pkcs", "tls", "ssl", "public key infrastructure", 
    "digital signatures", "diffie hellman", "aes-256", "elliptic curve cryptography", "cryptanalysis", "hashing algorithms", "block ciphers",
    
    # Security Frameworks
    "cis controls", "nist", "iso 27001", "pci dss", "gdpr", "hipaa", "soc 2", "owasp top 10", "cisa", "mitre att&ck", "cwe", "cvss",
    
    # Security Tools
    "nessus", "openvas", "qualys", "burp suite", "kali linux", "aircrack-ng", "snort", "wireshark", "suricata", "metasploit", "ossec", 
    "bro", "zeek", "fail2ban", "clamav", "snort", "rkhunter", "openvas", "mimikatz", "msfvenom", "cobalt strike", "crimson strike",
    
    # Game Development
    "unity", "unreal engine", "godot", "game physics", "game design", "2d game development", "3d game development", "game mechanics", "C#", "C++",
    "blueprints", "game AI", "game optimization", "networked multiplayer", "game art", "game sound", "animation", "lighting effects", "shader programming",
    "game scripting", "particle effects", "game monetization", "VR/AR in gaming",
    
    # AR/VR Development
    "augmented reality", "virtual reality", "oculus", "htc vive", "unity AR/VR", "augmented reality apps", "hololens", "arcore", "arkit", "360 video",
    "motion tracking", "stereoscopic 3d", "unity XR", "spatial computing", "immersive experiences", "interactive simulations", "gesture recognition", "haptic feedback",
    
    # Blockchain Development
    "blockchain", "ethereum", "solidity", "smart contracts", "nft", "decentralized apps (dapps)", "web3", "cryptography", "ipfs", "bitcoin",
    "consensus algorithms", "proof of work", "proof of stake", "dao", "erc-20", "erc-721", "blockchain architecture", "chainlink", "polygon", "binance smart chain",
    
    # Internet of Things (IoT)
    "iot", "mqtt", "raspberry pi", "arduino", "zigbee", "iot security", "iot protocols", "sensor networks", "iot cloud integration", "edge computing",
    "iot platforms", "embedded systems", "iot analytics", "iot connectivity", "wearable devices", "smart home automation", "bluetooth low energy (BLE)"
]

skill_expansion = {
    # Web Development
    "web development": ["html", "css", "javascript", "typescript", "react", "angular", "vue.js", "svelte", "jquery", 
                        "ajax", "json", "web components", "dom manipulation", "canvas", "webgl", "web assembly", 
                        "pwa", "responsive design", "progressive web apps", "server-side rendering", "tailwind css", 
                        "bootstrap", "bulma", "foundation", "materialize", "semantic ui", "chakra ui", "ant design", 
                        "scss", "sass", "css3", "html5", "gatsby", "next.js", "nuxt.js", "solid.js", "sveltekit", "stencil.js", 
                        "webpack", "babel", "grunt", "gulp", "npm", "yarn", "parcel", "webpack bundling", "parcel bundler", "serverless framework"],
    
    # Backend Development
    "backend development": ["node.js", "express", "koa", "hapi", "django", "flask", "rails", "laravel", "spring", 
                            "spring boot", "django rest framework", "graphql", "rest apis", "graphql apis", "web sockets", 
                            "redis", "mongodb", "postgresql", "mysql", "mongodb atlas", "elasticsearch", "socket.io", "auth0", 
                            "jwt", "passport.js", "oauth", "bcrypt", "json web tokens", "microservices", "rabbitmq", "kafka", 
                            "celery", "nginx", "apache", "api gateways", "docker", "kubernetes", "virtualization", "serverless"],
    
    # Full-stack Development
    "full stack development": ["frontend", "backend", "database", "api", "react", "angular", "vue.js", "node.js", 
                               "express", "mongoDB", "postgresql", "graphql", "redis", "rest api", "graphql api", 
                               "docker", "kubernetes", "ci/cd", "aws", "firebase", "jenkins", "azure", "google cloud", "serverless", 
                               "microservices", "cloudformation", "cloudwatch", "terraform", "gitlab", "circleci", "vps", "load balancing"],
    
    # Mobile Development
    "mobile development": ["react native", "flutter", "ionic", "xamarin", "kotlin", "java", "android sdk", "android studio", 
                           "swift", "objective-c", "xcode", "firebase", "rxjava", "room", "retrofit", "firebase analytics", 
                           "firebase firestore", "react navigation", "flutter framework", "capacitor", "expo", "apk", "ipa", 
                           "app store connect", "google play console", "app releases", "testflight", "crashlytics", "swiftui", 
                           "android jetpack", "android studio", "ios", "flutter plugins", "flutter ui", "kotlin coroutines", 
                           "push notifications", "app testing", "app debugging", "app deployment", "flutter hooks"],
    
    # Game Development
    "game development": ["unity", "unreal engine", "c#", "c++", "game design", "3d modeling", "game mechanics", 
                         "game physics", "game testing", "augmented reality", "virtual reality", "opengl", "directx", 
                         "shader programming", "game engines", "vr development", "ar development", "blender", "pbr", 
                         "game art", "game sound", "animation", "gamification", "game ai", "networked multiplayer", 
                         "game scripting", "game optimization", "level design", "lighting design", "sound effects", "motion capture", 
                         "game narrative", "game user interface", "visual effects", "mobile game development", "pc game development", 
                         "web-based games", "interactive media", "game publishing", "cross-platform game development", "virtual economy", 
                         "multiplayer game logic", "game server architecture", "game monetization", "game analytics"],
    
    # AR/VR Development
    "ar/vr": ["augmented reality", "virtual reality", "unity", "unreal engine", "vr development", "ar development", "oculus", 
              "htc vive", "google cardboard", "vr simulation", "vr games", "vr apps", "ar apps", "motion tracking", "3d modeling", 
              "game engines", "immersive experience", "webvr", "headsets", "marker-based ar", "markerless ar", "mixed reality", 
              "vr storytelling", "interactive design", "haptic feedback", "vr environments", "telepresence", "sensor integration", 
              "oculus rift", "vive cosmos", "augmented reality glasses", "holoLens", "augmented reality SDKs", "motion controllers", 
              "ARKit", "ARCore", "virtual worlds", "object tracking", "real-time rendering", "eye tracking", "location-based AR"],
    
    # Data Science
    "data science": ["python", "numpy", "pandas", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "keras", "xgboost", 
                     "lightgbm", "catboost", "data wrangling", "data cleaning", "data visualization", "data analysis", 
                     "statistical analysis", "hypothesis testing", "regression analysis", "multivariate analysis", 
                     "time series forecasting", "anomaly detection", "clustering", "dimensionality reduction", 
                     "pandas dataframe", "sql", "tableau", "powerbi", "jupyter", "google colab", "openCV", "image processing", 
                     "deep learning", "neural networks", "computer vision", "machine learning pipelines", "data modeling", 
                     "data engineering", "feature engineering", "data labeling", "model tuning", "ensemble learning", 
                     "data augmentation", "hyperparameter tuning", "data imputation", "model explainability", "model validation"],
    
    # Machine Learning
    "machine learning": ["scikit-learn", "tensorflow", "keras", "pytorch", "xgboost", "lightgbm", "catboost", "fastai", 
                         "reinforcement learning", "supervised learning", "unsupervised learning", "deep learning", 
                         "neural networks", "cnn", "rnn", "lstm", "transfer learning", "autoencoders", "generative models", 
                         "nlp", "bert", "gpt-3", "time series", "clustering", "classification", "regression", "svm", 
                         "decision trees", "random forests", "gradient boosting", "pca", "k-means", "dbscan", "anomaly detection", 
                         "feature selection", "k-fold cross validation", "model deployment", "model optimization", "batch processing", 
                         "reinforcement learning algorithms", "model evaluation", "natural language understanding", "speech recognition"],
    
    # Cloud Computing
    "cloud computing": ["aws", "azure", "gcp", "docker", "kubernetes", "cloud services", "serverless", "aws s3", "aws ec2", 
                        "aws lambda", "google cloud storage", "google cloud functions", "firebase", "cloudformation", 
                        "terraform", "azure devops", "azure pipelines", "cloudwatch", "google cloud firestore", "gcp ai", 
                        "aws rds", "aws cloudfront", "digital ocean", "heroku", "netlify", "openstack", "rackspace", "oracle cloud", 
                        "cloud security", "cloud architecture", "cloud migration", "cloud networking", "cloud database", 
                        "cloud management", "docker swarms", "microservices architecture", "distributed systems", "multi-cloud"],
    
    # DevOps
    "devops": ["docker", "kubernetes", "jenkins", "ci/cd", "helm", "terraform", "ansible", "puppet", "chef", "gitlab ci", 
               "circleci", "travis ci", "appveyor", "bitbucket pipelines", "git", "github", "bitbucket", "ci pipelines", 
               "gitlab pipelines", "deployment automation", "jenkins pipelines", "monitoring", "logging", "prometheus", 
               "grafana", "cloudformation", "vagrant", "openshift", "rancher", "elastic search", "aws ecs", "aws eks", "digital ocean"],
    
    # Cybersecurity
    "cybersecurity": ["ethical hacking", "penetration testing", "firewall", "vpn", "nmap", "metasploit", "kali linux", "snort", 
                      "wireshark", "sql injection", "xss", "csrf", "osint", "reverse engineering", "ransomware", "malware analysis", 
                      "incident response", "digital forensics", "cloud security", "devsecops", "siem", "tls", "ssl", "vpn", 
                      "cryptography", "rsa encryption", "aes", "public key infrastructure", "penetration testing tools", "hashing algorithms"],
    
    # Blockchain & Cryptocurrency
    "blockchain": ["bitcoin", "ethereum", "smart contracts", "solidity", "cryptocurrency", "decentralized finance", "dapps", 
                   "ethereum blockchain", "ipfs", "cryptographic hashing", "distributed ledgers", "blockchain development", 
                   "blockchain protocols", "web3", "nft", "decentralized applications", "blockchain security", "dao", 
                   "proof of work", "proof of stake", "mining", "cryptography", "ledger technologies", "blockchain explorer", 
                   "ethereum 2.0", "cross-chain interoperability", "smart contract auditing", "consensus algorithms", "defi protocols"],
    
    # UI/UX Design
    "ui/ux design": ["figma", "sketch", "adobe xd", "invision", "user research", "wireframes", "prototypes", "interaction design", 
                     "user flows", "visual design", "usability testing", "personas", "design thinking", "user interface", "material design", 
                     "atomic design", "a/b testing", "heuristic evaluation", "user experience", "ui design", "responsive design", 
                     "usability", "uxpin", "zeplin", "framer", "mockups", "storyboarding", "user testing", "user journey", "style guides", 
                     "responsive layouts", "high-fidelity design", "motion design"],
    
    # Artificial Intelligence
    "artificial intelligence": ["ai", "machine learning", "deep learning", "nlp", "computer vision", "reinforcement learning", 
                                "generative models", "predictive analytics", "decision trees", "neural networks", "tensorFlow", 
                                "pytorch", "convolutional neural networks", "reinforcement learning", "semantic web", "chatbots", 
                                "recommendation systems", "robotics", "speech recognition", "autonomous vehicles", "robotic vision", 
                                "emotion AI", "speech-to-text", "natural language understanding", "chatbot development", "ai ethics"],
}

known_languages = [
    "english", "spanish", "french", "german", "italian", "portuguese", "dutch", "russian", "chinese", "japanese", 
    "hindi", "bengali", "arabic", "thai", "korean", "greek", "swedish", "polish", "czech", "turkish", 
    "romanian", "ukrainian", "persian", "vietnamese", "filipino", "malay", "sundanese", "tagalog", "afrikaans", 
    "swahili", "hebrew", "bengali", "persian", "urdu", "finnish", "norwegian", "danish", "swahili", "turkmen", 
    "kurdish", "armenian", "pashto", "serbian", "bulgarian", "slovak", "croatian", "slovenian", "georgian", "mongolian", 
    "swedish", "latvian", "lithuanian", "estonian", "icelandic", "malagasy", "zulu", "klingon", "quichua", "maori", 
    "hausa", "yiddish", "cantonese", "tamil", "marathi", "punjabi", "telugu", "gujarati", "malayalam", "kannada", 
    "odia", "assamese", "sinhala", "bhojpuri", "haryanvi", "chhattisgarhi", "gujarati", "tamil", "telugu"
]
