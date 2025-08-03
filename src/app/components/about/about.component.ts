// import { Component, OnInit } from '@angular/core';
// import { PortfolioService } from '../../services/portfolio.service';
// import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

// @Component({
//   selector: 'app-about',
//   templateUrl: './about.component.html',
//   styleUrls: ['./about.component.css'],
//   imports : [ScrollAnimateDirective]
// })
// export class AboutComponent implements OnInit {
//   personalInfo: any;

//   constructor(private portfolioService: PortfolioService) {}

//   ngOnInit() {
//     this.personalInfo = this.portfolioService.getPersonalInfo();
//   }
// }


import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [ScrollAnimateDirective]
})
export class AboutComponent implements OnInit {
  personalInfo: any;
  experience: any[] = [];
  skills: any;
  projects: any[] = [];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.personalInfo = this.portfolioService.getPersonalInfo();
    this.experience = this.portfolioService.getExperience();
    this.skills = this.portfolioService.getSkills();
    this.projects = this.portfolioService.getProjects();
  }

  // Calculate years of professional experience (excluding internships)
  getProfessionalExperience(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    // Filter only actual jobs (non-internships)
    const jobs = this.experience.filter((exp: any) => 
      !exp.position.toLowerCase().includes('intern')
    );

    if (jobs.length === 0) {
      return '0';
    }

    // Calculate from earliest job start date
    const jobStartDates = jobs.map(exp => {
      const duration = exp.duration;
      const startPart = duration.split(' - ')[0];
      return this.parseDate(startPart);
    });

    const earliestJobDate = new Date(Math.min(...jobStartDates.map(date => date.getTime())));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - earliestJobDate.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return `${diffYears}+`;
  }

  // Smart method to count only actual jobs (exclude internships)
  getCompaniesCount(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    // Filter out internships - check if position contains "intern" (case insensitive)
    const actualJobs = this.experience.filter((exp: any) => 
      !exp.position.toLowerCase().includes('intern')
    );

    return `${actualJobs.length}`;
  }

  // Count total technologies from all skill categories
  getTechnologiesCount(): string {
    if (!this.skills) {
      return '0';
    }

    let totalCount = 0;
    Object.keys(this.skills).forEach(category => {
      totalCount += this.skills[category].length;
    });

    return `${totalCount}+`;
  }

  // Count projects built
  getProjectsCount(): string {
    if (!this.projects || this.projects.length === 0) {
      return '0';
    }
    return `${this.projects.length}+`;
  }

  // Helper function to parse date strings
  private parseDate(dateStr: string): Date {
    // Handle formats like "Feb 2024", "April 2022", etc.
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'January': 0, 'Feb': 1, 'February': 1,
      'Mar': 2, 'March': 2, 'April': 3, 'Apr': 3,
      'May': 4, 'Jun': 5, 'June': 5, 'Jul': 6, 'July': 6,
      'Aug': 7, 'August': 7, 'Sep': 8, 'September': 8,
      'Oct': 9, 'October': 9, 'Nov': 10, 'November': 10,
      'Dec': 11, 'December': 11
    };

    const parts = dateStr.trim().split(' ');
    const month = monthMap[parts[0]] || 0;
    const year = parseInt(parts[1]) || new Date().getFullYear();
    
    return new Date(year, month, 1);
  }

  // Alternative methods you can use instead (optional)
  
  // Get total years of experience including internships
  getTotalYearsExperience(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    const startDates = this.experience.map(exp => {
      const duration = exp.duration;
      const startPart = duration.split(' - ')[0];
      return this.parseDate(startPart);
    });

    const earliestDate = new Date(Math.min(...startDates.map(date => date.getTime())));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - earliestDate.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return `${diffYears}+`;
  }

  // Get internships count separately
  getInternshipsCount(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    const internships = this.experience.filter((exp: any) => 
      exp.position.toLowerCase().includes('intern')
    );
    
    return `${internships.length}`;
  }

  // Get skill categories count
  getSkillCategoriesCount(): string {
    if (!this.skills) {
      return '0';
    }
    return `${Object.keys(this.skills).length}`;
  }
}
