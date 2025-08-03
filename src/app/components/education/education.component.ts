import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  imports:[CommonModule, ScrollAnimateDirective],
})
export class EducationComponent implements OnInit {
  education: any[] = [];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.education = this.portfolioService.getEducation();
  }
}
