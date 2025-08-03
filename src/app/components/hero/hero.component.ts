import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  imports: [ScrollAnimateDirective]
})
export class HeroComponent implements OnInit {
  personalInfo: any;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.portfolioService.getPersonalInfo().subscribe(data => {
      this.personalInfo = data;
    });
  }

  downloadResume() {
    const resumeUrl = '/Portfolio/assets/resume/Kshitij_Singh_Resume.pdf';
    const resumeFileName = 'Kshitij_Singh_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeFileName;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showNotification('Resume download started!');
  }

  private showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--color-success);
    color: var(--color-btn-primary-text);
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    transform: translateX(0);
    transition: transform 0.3s ease;
  `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
