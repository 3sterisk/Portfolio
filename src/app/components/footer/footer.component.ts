import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule],
})
export class FooterComponent implements OnInit {
  personalInfo: any;
  currentYear = new Date().getFullYear();

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.personalInfo = this.portfolioService.getPersonalInfo();
  }

 
}
