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
import { Subscription } from 'rxjs';

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

  private subscriptions = new Subscription();

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {

    this.subscriptions.add(

      this.portfolioService.getPersonalInfo().subscribe(data => {
        this.personalInfo = data;
      })
    );

    this.subscriptions.add(
      this.portfolioService.getExperience().subscribe(data => {
        this.experience = data;
      })
    );

    this.subscriptions.add(
      this.portfolioService.getSkills().subscribe(data => {
        this.skills = data;
      })
    );

    this.subscriptions.add(
      this.portfolioService.getProjects().subscribe(data => {
        this.projects = data;
      })
    );


  }


  getProfessionalExperience(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    const jobs = this.experience.filter((exp: any) =>
      !exp.position.toLowerCase().includes('intern')
    );

    if (jobs.length === 0) {
      return '0';
    }

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

  getCompaniesCount(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    const actualJobs = this.experience.filter((exp: any) =>
      !exp.position.toLowerCase().includes('intern')
    );

    return `${actualJobs.length}`;
  }

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

  getProjectsCount(): string {
    if (!this.projects || this.projects.length === 0) {
      return '0';
    }
    return `${this.projects.length}+`;
  }


  private parseDate(dateStr: string): Date {
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

  getInternshipsCount(): string {
    if (!this.experience || this.experience.length === 0) {
      return '0';
    }

    const internships = this.experience.filter((exp: any) =>
      exp.position.toLowerCase().includes('intern')
    );

    return `${internships.length}`;
  }
  getSkillCategoriesCount(): string {
    if (!this.skills) {
      return '0';
    }
    return `${Object.keys(this.skills).length}`;
  }
}
