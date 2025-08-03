import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface PortfolioData {
  personal_info: any,
  skills: any;
  experience: any[];
  projects: any[];
  education: any[];
  certifications: string[];
  achievements: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioData$ = new BehaviorSubject<PortfolioData | null>(null);

  constructor(private firestore: Firestore) {
    this.loadPortfolioData();
  }

  async initializeFirestoreData(): Promise<void> {
    try {
      console.log('Starting Firestore initialization...');
      
      const fallbackData = this.getFallbackData();
      
      // Initialize each collection
      await this.updatePersonalInfo(fallbackData.personal_info);
      console.log('Personal info initialized');
      
      await this.updateSkills(fallbackData.skills);
      console.log('Skills initialized');
      
      await this.updateExperience(fallbackData.experience);
      console.log('Experience initialized');
      
      await this.updateProjects(fallbackData.projects);
      console.log('Projects initialized');
      
      await this.updateEducation(fallbackData.education);
      console.log('Education initialized');
      
      await this.updateCertifications(fallbackData.certifications);
      console.log('Certifications initialized');
      
      await this.updateAchievements(fallbackData.achievements);
      console.log('Achievements initialized');
      
      console.log('Firestore initialization complete!');
    } catch (error) {
      console.error('Error initializing Firestore:', error);
      throw error;
    }
  }


  private async loadPortfolioData() {
    try {
      const portfolioCollection = collection(this.firestore, 'portfolio');
      const snapshot = await getDocs(portfolioCollection);

      const data: any = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data();
      });

      this.portfolioData$.next(data as PortfolioData);
    }
    catch (error) {
      console.error('Error loading portfolio data:', error);
      this.loadFallbackData();
    }
  }


  private loadFallbackData() {
    const fallbackData = this.getFallbackData();
    this.portfolioData$.next(fallbackData);
  }

  private getFallbackData(): PortfolioData {
    return {
      personal_info: {
        name: "Kshitij Singh",
        title: "Associate Software Engineer",
        tagline: "Building scalable solutions with .NET and cloud technologies",
        email: "sisodia.kshitijsingh@gmail.com",
        phone: "+91 9971411395",
        location: "Hyderabad, Telangana",
        website: "",
        linkedin: "https://linkedin.com/in/kshitijsingh9971/",
        github: "https://github.com/3sterisk",
        about: "Software engineer with experience in full-stack development using .NET technologies, Angular, and cloud platforms. Skilled in building scalable solutions with both SQL and NoSQL databases, API development, and Azure cloud services. Strong background in automation, data analytics, and cross-functional collaboration."
      },
      skills: {
        frontend: [
          "Angular",
          "ReactJS",
          "JavaScript",
          "React Native",
          "Lightning Web Components"
        ],
        backend: [
          "C#",
          "ASP .NET Core",
          "ASP .NET MVC",
          "Entity Framework",
          "APEX",
          "Java Servlets",
          "Python"
        ],
        database: [
          "Azure Cosmos DB",
          "SQL Server",
          "MySQL",
          "Redis",
          "PL/SQL"
        ],
        cloud: [
          "Azure",
          "Azure DevOps",
          "Azure Data Factory",
          "Azure Synapse Analytics",
          "Azure CLI",
          "Docker"
        ],
        tools: [
          "Git",
          "Visual Studio",
          "VS Code",
          "SSMS",
          "Linux",
          "Apache Server",
          "GitHub Copilot"
        ]
      },
      experience: [
        {
          company: "Accenture",
          position: "Associate Software Engineer",
          duration: "Feb 2024 - Present",
          location: "Hyderabad, Telangana",
          achievements: [
            "Developed features for both frontend and backend using .NET technologies with Angular and C#",
            "Built and integrated APIs leveraging Azure Data Factory and Azure Synapse Analytics for data pipelines",
            "Utilized Azure DevOps for CI/CD pipelines and automated deployment processes",
            "Developed APIs and managed caching using Redis to optimize performance and reduce latency",
            "Collaborated with cross-functional teams maintaining consistent data flow across multiple services"
          ]
        },
        {
          company: "Salesforce",
          position: "Intern",
          duration: "April 2022 - June 2022",
          location: "Remote",
          achievements: [
            "Created organizational setups and automated processes for effective workflow",
            "Demonstrated expertise in Lightning Web Components and APEX development",
            "Streamlined processes and optimized code to enhance system performance",
            "Developed and implemented security protocols for data protection and compliance"
          ]
        },
        {
          company: "Highradius",
          position: "Intern",
          duration: "Jan 2022 - April 2022",
          location: "Remote",
          achievements: [
            "Developed a B2B fintech solution with seamless frontend-backend integration",
            "Created a custom prediction model for accurate forecasting based on cleaned data",
            "Utilized ReactJS, Java servlets, Apache server, and MySQL for full-stack development",
            "Conducted data cleaning to ensure high-quality data for analysis"
          ]
        }
      ],
      projects: [
        {
          name: "React Native Mobile App",
          description: "Cutting-edge mobile app revolutionizing student access to academic help with intuitive interfaces for service requests",
          technologies: [
            "React Native",
            "Redux",
            "REST APIs"
          ],
          features: [
            "Student assistance request interface",
            "Service provider platform",
            "Redux state management",
            "Real-time updates via RESTful APIs",
            "Cross-platform compatibility (Android & iOS)"
          ],
          github: "https://github.com/3sterisk/react-native-app",
          live_demo: "",
          image: "/images/react-native-project.jpg"
        },
        {
          name: "AI-Enabled Snake Game Agent",
          description: "AI-driven Snake game using reinforcement learning with RNN for strategic decision-making and memory incorporation",
          technologies: [
            "Python",
            "Pygame",
            "Machine Learning",
            "RNN",
            "Reinforcement Learning"
          ],
          features: [
            "Reinforcement learning optimization",
            "RNN-based decision memory",
            "Strategic gameplay planning",
            "Iterative improvement system"
          ],
          github: "https://github.com/3sterisk/ai-snake-game",
          live_demo: "",
          image: "/images/ai-snake-project.jpg"
        }
      ],
      education: [
        {
          degree: "Bachelor of Engineering",
          school: "Chandigarh University",
          duration: "June 2019 - May 2023",
          gpa: "",
          relevant_coursework: [
            "Software Engineering",
            "Data Structures",
            "Algorithms",
            "Database Management",
            "Web Development"
          ]
        }
      ],
      certifications: [
        "Azure Cloud Services",
        ".NET Development",
        "Salesforce Development"
      ],
      achievements: [
        "Full-stack developer with expertise in .NET technologies",
        "Experience with both SQL and NoSQL database systems",
        "Proficient in cloud technologies and DevOps practices",
        "Strong background in API development and data analytics"
      ]
    };
  }
  


  // async methods for database updation

  async updatePersonalInfo(data: any): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'personal_info');
    await setDoc(docRef, data);
    this.loadPortfolioData();
  }

  async updateSkills(data: any): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'skills');
    await setDoc(docRef, data);
    this.loadPortfolioData();
  }

  async updateExperience(data: any[]): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'experience');
    await setDoc(docRef, data); 
    this.loadPortfolioData();
  }

  async updateProjects(data: any[]): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'projects');
    await setDoc(docRef, data); 
    this.loadPortfolioData();
  }

  async updateEducation(data: any[]): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'education');
    await setDoc(docRef, data);
    this.loadPortfolioData();
  }

  async updateCertifications(data: string[]): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'certifications');
    await setDoc(docRef, data); 
    this.loadPortfolioData();
  }

  async updateAchievements(data: string[]): Promise<void> {
    const docRef = doc(this.firestore, 'portfolio', 'achievements');
    await setDoc(docRef, data); 
    this.loadPortfolioData();
  }


  // async public read

  getPersonalInfo(): Observable<any> {
    return this.portfolioData$.pipe(
      map(data => data?.personal_info || null)
    );
  }

  getSkills(): Observable<any> {
    return this.portfolioData$.pipe(
      map(data => data?.skills || null)
    );
  }

  getExperience(): Observable<any[]> {
    return this.portfolioData$.pipe(
      map(data => data?.experience || [])
    );
  }

  getProjects(): Observable<any[]> {
    return this.portfolioData$.pipe(
      map(data => data?.projects || [])
    );
  }

  getEducation(): Observable<any[]> {
    return this.portfolioData$.pipe(
      map(data => data?.education || [])
    );
  }

  getCertifications(): Observable<string[]> {
    return this.portfolioData$.pipe(
      map(data => data?.certifications || [])
    );
  }

  getAchievements(): Observable<string[]> {
    return this.portfolioData$.pipe(
      map(data => data?.achievements || [])
    );
  }

  getPortfolioData(): Observable<PortfolioData | null> {
    return this.portfolioData$.asObservable();
  }

}
