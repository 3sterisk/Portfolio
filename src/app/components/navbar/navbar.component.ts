import { Component, OnInit, HostListener } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  activeSection = 'home';
  personalInfo: any;

  constructor(
    private themeService: ThemeService,
    private portfolioService: PortfolioService 
  ) {}


  ngOnInit() {
     this.portfolioService.getPersonalInfo().subscribe(data=> {
      this.personalInfo = data;
    });
  }

  getLogoInitials(): string {
    if (!this.personalInfo?.name) {
      return 'AJ'; 
    }
    
    const name = this.personalInfo.name.trim();
    const nameParts = name.split(/\s+/); 
    
    const validParts = nameParts.filter((part: string) => part.length > 0);
    
    if (validParts.length >= 2) {
      return validParts[0].charAt(0).toUpperCase() + validParts[validParts.length - 1].charAt(0).toUpperCase();
    } else if (validParts.length === 1) {

      const singleName = validParts[0];
      if (singleName.length >= 2) {
        return singleName.charAt(0).toUpperCase() + singleName.charAt(1).toUpperCase();
      } else {
        return singleName.charAt(0).toUpperCase() + singleName.charAt(0).toUpperCase();
      }
    }
    
    return 'AJ'; 
  }


  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 70;
      const targetPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    this.activeSection = sectionId;
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset + 100;
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionHeight = element.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.activeSection = section;
          break;
        }
      }
    }
  }
}
