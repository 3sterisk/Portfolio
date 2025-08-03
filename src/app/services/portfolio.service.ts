import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  // private portfolioData = {
  //   // Copy content from your portfolio_data.json here
  //   "personal_info": {
  //   "name": "Alex Johnson",
  //   "title": "Software Engineer",
  //   "tagline": "Building scalable solutions with modern technologies",
  //   "email": "alex.johnson@email.com",
  //   "phone": "+1 (555) 123-4567",
  //   "location": "San Francisco, CA",
  //   "website": "https://alexjohnson.dev",
  //   "linkedin": "https://linkedin.com/in/alexjohnson",
  //   "github": "https://github.com/alexjohnson",
  //   "about": "Passionate full-stack developer with 3+ years of experience building responsive web applications and REST APIs. Specialized in React, Node.js, and cloud technologies. Strong problem-solving skills with a focus on clean, maintainable code and user-centered design."
  // },
  // "skills": {
  //   "frontend": [
  //     "React",
  //     "TypeScript",
  //     "JavaScript",
  //     "HTML5",
  //     "CSS3",
  //     "Tailwind CSS",
  //     "Next.js"
  //   ],
  //   "backend": [
  //     "Node.js",
  //     "Python",
  //     "Express.js",
  //     "Django",
  //     "REST APIs",
  //     "GraphQL"
  //   ],
  //   "database": [
  //     "PostgreSQL",
  //     "MongoDB",
  //     "Redis",
  //     "MySQL"
  //   ],
  //   "cloud": [
  //     "AWS",
  //     "Docker",
  //     "Kubernetes",
  //     "CI/CD",
  //     "Vercel",
  //     "Heroku"
  //   ],
  //   "tools": [
  //     "Git",
  //     "VS Code",
  //     "Postman",
  //     "Figma",
  //     "Jira",
  //     "Linux"
  //   ]
  // },
  // "experience": [
  //   {
  //     "company": "TechCorp Solutions",
  //     "position": "Software Engineer",
  //     "duration": "Jan 2022 - Present",
  //     "location": "San Francisco, CA",
  //     "achievements": [
  //       "Developed 5+ full-stack web applications using React and Node.js, serving 10,000+ users",
  //       "Improved application performance by 40% through code optimization and database tuning",
  //       "Led migration of legacy systems to cloud infrastructure, reducing server costs by 30%",
  //       "Collaborated with cross-functional teams to deliver features ahead of schedule"
  //     ]
  //   },
  //   {
  //     "company": "StartupXYZ",
  //     "position": "Junior Developer",
  //     "duration": "Jun 2021 - Dec 2021",
  //     "location": "Remote",
  //     "achievements": [
  //       "Built responsive web components using React and TypeScript",
  //       "Implemented automated testing reducing bugs by 25%",
  //       "Participated in agile development process and code reviews"
  //     ]
  //   }
  // ],
  // "projects": [
  //   {
  //     "name": "ECommerce Platform",
  //     "description": "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard",
  //     "technologies": [
  //       "React",
  //       "Node.js",
  //       "PostgreSQL",
  //       "Stripe",
  //       "AWS"
  //     ],
  //     "features": [
  //       "User authentication and authorization",
  //       "Real-time inventory tracking",
  //       "Payment processing with Stripe",
  //       "Responsive design for mobile and desktop"
  //     ],
  //     "github": "https://github.com/alexjohnson/ecommerce-platform",
  //     "live_demo": "https://ecommerce-demo.alexjohnson.dev",
  //     "image": "/images/ecommerce-project.jpg"
  //   },
  //   {
  //     "name": "Task Management App",
  //     "description": "Collaborative project management tool with real-time updates and team communication features",
  //     "technologies": [
  //       "React",
  //       "Express.js",
  //       "Socket.io",
  //       "MongoDB",
  //       "Docker"
  //     ],
  //     "features": [
  //       "Real-time collaboration",
  //       "Drag-and-drop task boards",
  //       "Team messaging system",
  //       "Progress tracking and analytics"
  //     ],
  //     "github": "https://github.com/alexjohnson/task-manager",
  //     "live_demo": "https://taskmanager.alexjohnson.dev",
  //     "image": "/images/taskmanager-project.jpg"
  //   },
  //   {
  //     "name": "Weather Dashboard",
  //     "description": "Modern weather application with location-based forecasts and interactive maps",
  //     "technologies": [
  //       "React",
  //       "TypeScript",
  //       "OpenWeather API",
  //       "Chart.js",
  //       "Tailwind CSS"
  //     ],
  //     "features": [
  //       "Location-based weather data",
  //       "7-day forecast with charts",
  //       "Interactive weather maps",
  //       "Dark/light mode toggle"
  //     ],
  //     "github": "https://github.com/alexjohnson/weather-dashboard",
  //     "live_demo": "https://weather.alexjohnson.dev",
  //     "image": "/images/weather-project.jpg"
  //   }
  // ],
  // "education": [
  //   {
  //     "degree": "Bachelor of Science in Computer Science",
  //     "school": "University of California, Berkeley",
  //     "duration": "2018 - 2021",
  //     "gpa": "3.8/4.0",
  //     "relevant_coursework": [
  //       "Data Structures",
  //       "Algorithms",
  //       "Database Systems",
  //       "Software Engineering",
  //       "Web Development"
  //     ]
  //   }
  // ],
  // "certifications": [
  //   "AWS Certified Solutions Architect",
  //   "React Developer Certification",
  //   "Google Cloud Platform Fundamentals"
  // ],
  // "achievements": [
  //   "Hackathon Winner - TechCrunch Disrupt 2023",
  //   "Dean's List - Fall 2020, Spring 2021",
  //   "Open Source Contributor - 50+ contributions to React ecosystem"
  // ]
  // };
  private portfolioData = {
  "personal_info": {
    "name": "Kshitij Singh",
    "title": "Associate Software Engineer",
    "tagline": "Building scalable solutions with .NET and cloud technologies",
    "email": "sisodia.kshitijsingh@gmail.com",
    "phone": "+91 9971411395",
    "location": "Hyderabad, Telangana",
    "website": "",
    "linkedin": "https://linkedin.com/in/kshitijsingh9971/",
    "github": "https://github.com/3sterisk",
    "about": "Software engineer with experience in full-stack development using .NET technologies, Angular, and cloud platforms. Skilled in building scalable solutions with both SQL and NoSQL databases, API development, and Azure cloud services. Strong background in automation, data analytics, and cross-functional collaboration."
  },
  "skills": {
    "frontend": [
      "Angular",
      "ReactJS",
      "JavaScript",
      "React Native",
      "Lightning Web Components"
    ],
    "backend": [
      "C#",
      "ASP .NET Core",
      "ASP .NET MVC",
      "Entity Framework",
      "APEX",
      "Java Servlets",
      "Python"
    ],
    "database": [
      "Azure Cosmos DB",
      "SQL Server",
      "MySQL",
      "Redis",
      "PL/SQL"
    ],
    "cloud": [
      "Azure",
      "Azure DevOps",
      "Azure Data Factory",
      "Azure Synapse Analytics",
      "Azure CLI",
      "Docker"
    ],
    "tools": [
      "Git",
      "Visual Studio",
      "VS Code",
      "SSMS",
      "Linux",
      "Apache Server",
      "GitHub Copilot"
    ]
  },
  "experience": [
    {
      "company": "Accenture",
      "position": "Associate Software Engineer",
      "duration": "Feb 2024 - Present",
      "location": "Hyderabad, Telangana",
      "achievements": [
        "Developed features for both frontend and backend using .NET technologies with Angular and C#",
        "Built and integrated APIs leveraging Azure Data Factory and Azure Synapse Analytics for data pipelines",
        "Utilized Azure DevOps for CI/CD pipelines and automated deployment processes",
        "Developed APIs and managed caching using Redis to optimize performance and reduce latency",
        "Collaborated with cross-functional teams maintaining consistent data flow across multiple services"
      ]
    },
    {
      "company": "Salesforce",
      "position": "Intern",
      "duration": "April 2022 - June 2022",
      "location": "Remote",
      "achievements": [
        "Created organizational setups and automated processes for effective workflow",
        "Demonstrated expertise in Lightning Web Components and APEX development",
        "Streamlined processes and optimized code to enhance system performance",
        "Developed and implemented security protocols for data protection and compliance"
      ]
    },
    {
      "company": "Highradius",
      "position": "Intern",
      "duration": "Jan 2022 - April 2022",
      "location": "Remote",
      "achievements": [
        "Developed a B2B fintech solution with seamless frontend-backend integration",
        "Created a custom prediction model for accurate forecasting based on cleaned data",
        "Utilized ReactJS, Java servlets, Apache server, and MySQL for full-stack development",
        "Conducted data cleaning to ensure high-quality data for analysis"
      ]
    }
  ],
  "projects": [
    {
      "name": "React Native Mobile App",
      "description": "Cutting-edge mobile app revolutionizing student access to academic help with intuitive interfaces for service requests",
      "technologies": [
        "React Native",
        "Redux",
        "REST APIs"
      ],
      "features": [
        "Student assistance request interface",
        "Service provider platform",
        "Redux state management",
        "Real-time updates via RESTful APIs",
        "Cross-platform compatibility (Android & iOS)"
      ],
      "github": "https://github.com/3sterisk/react-native-app",
      "live_demo": "",
      "image": "/images/react-native-project.jpg"
    },
    {
      "name": "AI-Enabled Snake Game Agent",
      "description": "AI-driven Snake game using reinforcement learning with RNN for strategic decision-making and memory incorporation",
      "technologies": [
        "Python",
        "Pygame",
        "Machine Learning",
        "RNN",
        "Reinforcement Learning"
      ],
      "features": [
        "Reinforcement learning optimization",
        "RNN-based decision memory",
        "Strategic gameplay planning",
        "Iterative improvement system"
      ],
      "github": "https://github.com/3sterisk/ai-snake-game",
      "live_demo": "",
      "image": "/images/ai-snake-project.jpg"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Engineering",
      "school": "Chandigarh University",
      "duration": "June 2019 - May 2023",
      "gpa": "",
      "relevant_coursework": [
        "Software Engineering",
        "Data Structures",
        "Algorithms",
        "Database Management",
        "Web Development"
      ]
    }
  ],
  "certifications": [
    "Azure Cloud Services",
    ".NET Development",
    "Salesforce Development"
  ],
  "achievements": [
    "Full-stack developer with expertise in .NET technologies",
    "Experience with both SQL and NoSQL database systems",
    "Proficient in cloud technologies and DevOps practices",
    "Strong background in API development and data analytics"
  ]
};

  getPersonalInfo() {
    return this.portfolioData.personal_info;
  }

  getSkills() {
    return this.portfolioData.skills;
  }

  getExperience() {
    return this.portfolioData.experience;
  }

  getProjects() {
    return this.portfolioData.projects;
  }

  getEducation() {
    return this.portfolioData.education;
  }

}
