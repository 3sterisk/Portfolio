import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  imports: [TitleCasePipe, CommonModule, ScrollAnimateDirective],
})
export class SkillsComponent implements OnInit {
  skills: any;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.skills = this.portfolioService.getSkills();
  }

  getSkillCategories() {
    return Object.keys(this.skills || {});
  }
}
