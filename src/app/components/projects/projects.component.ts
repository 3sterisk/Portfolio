import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  imports: [CommonModule, ScrollAnimateDirective]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.getProjects().subscribe(data=> {
      this.projects = data;
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
