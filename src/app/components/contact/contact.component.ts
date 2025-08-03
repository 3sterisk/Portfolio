import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { ContactService } from '../../services/contact.service';

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
    private portfolioService: PortfolioService,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(2)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.portfolioService.getPersonalInfo().subscribe(data => {
      this.personalInfo = data;
    });
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

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        await this.contactService.submitContactForm(this.contactForm.value);
        this.contactForm.reset();
        this.showNotification('Message sent successfully! I\'ll get back to you soon.');
      } catch (error: any) {
        this.showNotification(error.message || 'Error sending message. Please try again.', 'error');
      } finally {
        this.isSubmitting = false;
      }
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
