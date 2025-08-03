import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports : [ReactiveFormsModule, CommonModule, ScrollAnimateDirective],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  personalInfo: any;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.personalInfo = this.portfolioService.getPersonalInfo();
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.personalInfo.email);
      this.showNotification('Email copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.personalInfo.email;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Email copied to clipboard!');
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.contactForm.reset();
        this.isSubmitting = false;
        this.showNotification('Message sent successfully! I\'ll get back to you soon.');
        console.log('Form submitted:', this.contactForm.value);
      }, 2000);
    } else {
      this.showNotification('Please fill in all fields correctly', 'error');
    }
  }

  private showNotification(message: string, type: string = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
