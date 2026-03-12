export const config = {
    developer: {
        name: "Lokvignesh",
        fullName: "Lokvignesh B",
        title: "AI Engineer | Machine Learning Engineer | NLP Engineer",
        titleLine2: "Open to Relocate / Remote",
        description:
            "Fresher AI Engineer with hands-on experience building end-to-end machine learning and NLP projects. Strong practical knowledge of RAG pipelines, LLM integration, vector databases, and FastAPI backend development.",
    },
    social: {
        github: "lokVignesh14",
        email: "lokvignesh1b@gmail.com",
        phone: "+91 99944 60329",
        location: "Coimbatore, Tamil Nadu, India",
    },
    about: {
        title: "About Me",
        description:
            "I am an AI Engineer focused on building intelligent systems that combine machine learning, large language models, and real-world enterprise applications. My work centers around designing scalable AI architectures that integrate data pipelines, APIs, and intelligent automation. I have developed several production-style AI systems including a multi-agent ERP intelligence platform, an AI-powered hotel dynamic pricing engine, and machine learning recommendation systems. These projects combine technologies such as FastAPI, vector search, retrieval-augmented generation (RAG), and deep learning frameworks to create intelligent decision-support systems. My interests lie particularly in multi-agent AI architectures where specialized agents collaborate to understand user intent, query enterprise databases, and generate meaningful responses. I enjoy designing AI systems that move beyond experimental models and operate as real-world applications.",
    },
    experiences: [
        {
            position: "Operations Analyst",
            company: "NTT Data (Healthcare)",
            period: "2021 – 2025",
            location: "Healthcare",
            description:
                "Processed and validated large-scale healthcare datasets using Python, applying automated checks to ensure data accuracy and compliance across high-volume pipelines. Built Python scripts for data preprocessing, transformation, and workflow automation. Performed rule-based anomaly detection and data quality analysis. Collaborated with data and engineering teams to improve pipeline reliability.",
            responsibilities: [
                "Processed and validated large-scale healthcare datasets using Python",
                "Built scripts for preprocessing, transformation, and workflow automation",
                "Rule-based anomaly detection and data quality analysis",
                "Improved pipeline reliability with data and engineering teams",
            ],
            technologies: ["Python", "Data Pipelines", "Data Quality", "Healthcare Data"],
        },
        {
            position: "Postgraduate Program",
            company: "Imarticus Learning — Data Science & AI",
            period: "2024",
            location: "India",
            description:
                "Postgraduate Program in Data Science & Artificial Intelligence. Machine Learning, NLP, Deep Learning, AI Systems.",
            responsibilities: [
                "Machine Learning & Deep Learning",
                "NLP and AI Systems",
            ],
            technologies: ["ML", "NLP", "Deep Learning", "AI Systems"],
        },
        {
            position: "B.Sc. Chemistry",
            company: "Sri Ramakrishna Arts & Science College, Coimbatore",
            period: "2021",
            location: "Coimbatore",
            description: "Bachelor of Science in Chemistry — foundational analytical and scientific background.",
            responsibilities: [],
            technologies: ["Chemistry", "Analytics"],
        },
    ],
    certifications: [
        "Postgraduate Program in Data Science & Artificial Intelligence — Imarticus Learning (2024)",
        "Add additional certifications — e.g. DeepLearning.AI, Coursera ML, Google AI, AWS ML Specialty",
    ],
    projects: [
        {
            id: 1,
            title: "AI Hotel Dynamic Pricing Engine",
            category: "AI / ML / FastAPI",
            technologies:
                "FastAPI, PostgreSQL, Python, Redis, SerpAPI, Docker",
            image: "/images/AI%20Hotel%20Dynamic%20Pricing%20Engine.png",
            description:
                "AI-powered pricing system that dynamically adjusts hotel room prices using occupancy signals, competitor market data, and demand-driven pricing logic with real-time REST APIs. High throughput with sub-200ms P99 latency; 12 API endpoints.",
        },
        {
            id: 2,
            title: "Intelligent ERP AI Search Engine",
            category: "LLM / RAG / Agents",
            technologies:
                "FastAPI, LangChain, FAISS, Transformers, PostgreSQL, Docker",
            image: "/images/Futuristic%20ERP%20AI%20search%20engine%20dashboard.png",
            description:
                "Agentic AI system enabling natural-language interaction with ERP modules using multi-agent reasoning, vector search, and structured query generation. 800+ NL queries/day, 40+ ERP modules indexed, 3 AI agents.",
        },
        {
            id: 3,
            title: "Movie Recommendation Engine",
            category: "Deep Learning + SVD",
            technologies:
                "PyTorch, Scikit-learn, MLflow, PostgreSQL, FastAPI",
            image: "/images/Hybrid%20movie%20recommendation%20system%20infographic.png",
            description:
                "Hybrid recommendation engine combining collaborative filtering, SVD matrix factorization, and neural embedding models for personalized movie recommendations. 100k+ ratings dataset, 95%+ prediction coverage, REST API inference.",
        },
    ],
    contact: {
        email: "lokvignesh1b@gmail.com",
        github: "https://github.com/lokVignesh14",
        linkedin: "https://linkedin.com/in/lok-vignesh14",
        // Optional — leave empty string to hide in Contact section
        twitter: "",
        facebook: "",
        instagram: "",
    },
    skills: {
        develop: {
            title: "AI & ML ENGINEER",
            description: "RAG, LLMs, NLP & production APIs",
            details:
                "Building RAG pipelines, LLM integration, vector search (FAISS), and FastAPI backends. Experience with LangChain, Transformers, and deploying REST APIs with PostgreSQL and Docker.",
            tools: [
                "Python",
                "FastAPI",
                "LangChain",
                "PyTorch",
                "FAISS",
                "RAG",
                "Transformers",
                "PostgreSQL",
                "Docker",
            ],
        },
        design: {
            title: "DATA & BACKEND",
            description: "Pipelines, SQL & scalable services",
            details:
                "Data preprocessing, feature engineering, and workflow automation. REST API design, Pydantic models, async APIs, caching, and observability with Prometheus/Grafana.",
            tools: [
                "SQL",
                "Pandas",
                "NumPy",
                "Pydantic",
                "Redis",
                "MLflow",
                "Scikit-learn",
                "XGBoost",
                "Git",
            ],
        },
    },
};
