// import { Component, OnInit, NgZone } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { PortfolioService } from '../../services/portfolio.service';
// import { Firestore, collection, getDocs } from '@angular/fire/firestore';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin',
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, FormsModule]
// })
// export class AdminComponent implements OnInit {
//   loginForm: FormGroup;
//   isLoading = false;
//   errorMessage = '';
//   personalInfoJson = '';
//   contactMessages: any[] = [];

//   constructor(
//     private fb: FormBuilder,
//     public authService: AuthService,
//     private portfolioService: PortfolioService,
//     private firestore: Firestore,
//     private ngZone: NgZone
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   ngOnInit() {
//     this.authService.isAdmin().subscribe(isAdmin => {
//       if (isAdmin) {
//         this.loadAdminData();
//       }
//     });
//   }

//   async login() {
//     if (this.loginForm.valid) {
//       this.isLoading = true;
//       this.errorMessage = '';

//       try {
//         await this.authService.signIn(
//           this.loginForm.value.email,
//           this.loginForm.value.password
//         );
//         this.loadAdminData();

//         this.ngZone.run(() => {
//           this.loadAdminData();
//         });
//       } catch (error: any) {
//         this.errorMessage = error.message || 'Login failed';
//       } finally {
//         this.isLoading = false;
//       }
//     }
//   }

//   async logout() {
//     await this.authService.signOut();
//   }

//   private async loadAdminData() {
//     // Load current personal info
//     this.portfolioService.getPersonalInfo().subscribe(data => {
//       this.personalInfoJson = JSON.stringify(data, null, 2);
//     });

//     // Load contact messages
//     await this.loadContactMessages();
//   }

//   private async loadContactMessages() {
//     try {
//       const messagesCollection = collection(this.firestore, 'contact-messages');
//       const snapshot = await getDocs(messagesCollection);

//       this.contactMessages = [];
//       snapshot.forEach(doc => {
//         this.contactMessages.push({ id: doc.id, ...doc.data() });
//       });

//       // Sort by timestamp (newest first)
//       this.contactMessages.sort((a, b) => 
//         b.timestamp?.toMillis() - a.timestamp?.toMillis()
//       );
//     } catch (error) {
//       console.error('Error loading contact messages:', error);
//     }
//   }

//   async updatePersonalInfo() {
//     try {
//       const data = JSON.parse(this.personalInfoJson);
//       await this.portfolioService.updatePersonalInfo(data);
//       this.showNotification('Personal info updated successfully!');
//     } catch (error) {
//       this.showNotification('Error updating personal info', 'error');
//     }
//   }

//   private showNotification(message: string, type: string = 'success') {
//     console.log(`${type}: ${message}`);
//   }
// }

import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Firestore, collection, getDocs, query, orderBy } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AdminComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  personalInfoJson = '';
  contactMessages: any[] = [];
  isAdminUser = false;

  // Add missing properties
  isInitializing = false;
  initMessage = '';
  initMessageClass = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private portfolioService: PortfolioService,
    private firestore: Firestore,
    private ngZone: NgZone, // Add NgZone
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ngOnInit() {
  //   this.authService.isAdmin().subscribe(isAdmin => {
  //     if (isAdmin) {
  //       this.ngZone.run(() => {
  //         this.loadAdminData();
  //       });
  //     }
  //   });
  // }

  ngOnInit() {
    // Subscribe to admin status and update local property
    this.authService.isAdmin().subscribe(isAdmin => {
      console.log('🎯 Admin status changed:', isAdmin);
      this.ngZone.run(() => {
        this.isAdminUser = isAdmin; // Update local property
        this.cdr.detectChanges(); // Force change detection

        if (isAdmin) {
          this.loadAdminData();
        }
      });
    });
  }


  // async login() {
  //   if (this.loginForm.valid) {
  //     this.isLoading = true;
  //     this.errorMessage = '';

  //     try {
  //       await this.authService.signIn(
  //         this.loginForm.value.email,
  //         this.loginForm.value.password
  //       );

  //       // Use NgZone to ensure proper change detection
  //       this.ngZone.run(() => {
  //         this.loadAdminData();
  //       });

  //     } catch (error: any) {
  //       this.ngZone.run(() => {
  //         this.errorMessage = error.message || 'Login failed';
  //       });
  //     } finally {
  //       this.ngZone.run(() => {
  //         this.isLoading = false;
  //       });
  //     }
  //   }
  // }
  async login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        await this.authService.signIn(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        
        console.log('✅ Login successful, checking admin status...');
        
        // Force check admin status after login
        setTimeout(() => {
          this.authService.isAdmin().pipe(take(1)).subscribe(isAdmin => {
            console.log('🔄 Post-login admin check:', isAdmin);
            this.ngZone.run(() => {
              this.isAdminUser = isAdmin;
              this.cdr.detectChanges();
              
              if (isAdmin) {
                this.loadAdminData();
              }
            });
          });
        }, 500);
        
      } catch (error: any) {
        this.ngZone.run(() => {
          this.errorMessage = error.message || 'Login failed';
        });
      } finally {
        this.ngZone.run(() => {
          this.isLoading = false;
        });
      }
    }
  }

  async logout() {
    await this.authService.signOut();
  }

  // Add the missing Firestore initialization method
  async initializeFirestore() {
    this.isInitializing = true;
    this.initMessage = '';

    try {
      await this.portfolioService.initializeFirestoreData();
      this.ngZone.run(() => {
        this.initMessage = 'Firestore initialized successfully!';
        this.initMessageClass = 'success-message';
      });

      setTimeout(() => {
        this.ngZone.run(() => {
          this.loadAdminData();
        });
      }, 1000);

    } catch (error) {
      this.ngZone.run(() => {
        this.initMessage = 'Error initializing Firestore. Check console for details.';
        this.initMessageClass = 'error-message';
      });
      console.error('Firestore initialization error:', error);
    } finally {
      this.ngZone.run(() => {
        this.isInitializing = false;
      });
    }
  }

  //   async initFirestore() {
  //   try {
  //     await this.portfolioService.initializeFirestoreData();
  //     alert('Firestore initialized successfully!');
  //   } catch (error) {
  //     alert('Error initializing Firestore. Check console.');
  //     console.error(error);
  //   }
  // }

  private async loadAdminData() {
    // Load portfolio data
    this.portfolioService.getPersonalInfo().subscribe(data => {
      this.ngZone.run(() => {
        this.personalInfoJson = JSON.stringify(data, null, 2);
      });
    });

    // Load contact messages with NgZone
    await this.loadContactMessages();
  }

  private async loadContactMessages() {
    try {
      // Wrap Firebase calls in NgZone
      await this.ngZone.run(async () => {
        const messagesCollection = collection(this.firestore, 'contact-messages');
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(messagesQuery);

        this.contactMessages = [];
        snapshot.forEach(doc => {
          this.contactMessages.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${this.contactMessages.length} contact messages`);
      });
    } catch (error) {
      console.error('Error loading contact messages:', error);
      this.ngZone.run(() => {
        this.contactMessages = [];
      });
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
    const emoji = type === 'success' ? '✅' : '❌';
    alert(`${emoji} ${message}`);
  }
}

