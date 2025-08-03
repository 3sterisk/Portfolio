import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AdminComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  personalInfoJson = '';
  contactMessages: any[] = [];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private portfolioService: PortfolioService,
    private firestore: Firestore
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        this.loadAdminData();
      }
    });
  }

  async login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        await this.authService.signIn(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        this.loadAdminData();
      } catch (error: any) {
        this.errorMessage = error.message || 'Login failed';
      } finally {
        this.isLoading = false;
      }
    }
  }

  async logout() {
    await this.authService.signOut();
  }

  private async loadAdminData() {
    // Load current personal info
    this.portfolioService.getPersonalInfo().subscribe(data => {
      this.personalInfoJson = JSON.stringify(data, null, 2);
    });
    
    // Load contact messages
    await this.loadContactMessages();
  }

  private async loadContactMessages() {
    try {
      const messagesCollection = collection(this.firestore, 'contact-messages');
      const snapshot = await getDocs(messagesCollection);
      
      this.contactMessages = [];
      snapshot.forEach(doc => {
        this.contactMessages.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by timestamp (newest first)
      this.contactMessages.sort((a, b) => 
        b.timestamp?.toMillis() - a.timestamp?.toMillis()
      );
    } catch (error) {
      console.error('Error loading contact messages:', error);
    }
  }

  async updatePersonalInfo() {
    try {
      const data = JSON.parse(this.personalInfoJson);
      await this.portfolioService.updatePersonalInfo(data);
      this.showNotification('Personal info updated successfully!');
    } catch (error) {
      this.showNotification('Error updating personal info', 'error');
    }
  }

  private showNotification(message: string, type: string = 'success') {
    console.log(`${type}: ${message}`);
  }
}
