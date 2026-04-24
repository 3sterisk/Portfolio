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
  isSaving = false;
  errorMessage = '';
  isAdminUser = false;
  activeTab = 'personal';

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastHiding = false;
  private toastTimeout: any;

  // Data models
  personalInfo: any = null;
  skills: any = null;
  skillCategories: string[] = ['frontend', 'backend', 'database', 'cloud', 'tools'];
  experience: any[] = [];
  projects: any[] = [];
  education: any[] = [];
  certifications: string[] = [];
  achievements: string[] = [];
  contactMessages: any[] = [];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private portfolioService: PortfolioService,
    private firestore: Firestore,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(isAdmin => {
      this.ngZone.run(() => {
        this.isAdminUser = isAdmin;
        this.cdr.detectChanges();
        if (isAdmin) {
          this.loadAllData();
        }
      });
    });
  }

  // ===== AUTH =====

  async login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        await this.authService.signIn(
          this.loginForm.value.email,
          this.loginForm.value.password
        );

        setTimeout(() => {
          this.authService.isAdmin().pipe(take(1)).subscribe(isAdmin => {
            this.ngZone.run(() => {
              this.isAdminUser = isAdmin;
              this.cdr.detectChanges();
              if (isAdmin) {
                this.loadAllData();
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
    this.isAdminUser = false;
    this.personalInfo = null;
    this.skills = null;
    this.experience = [];
    this.projects = [];
    this.education = [];
    this.certifications = [];
    this.achievements = [];
    this.contactMessages = [];
  }

  // ===== DATA LOADING =====

  private loadAllData() {
    this.portfolioService.getPersonalInfo().subscribe(data => {
      this.ngZone.run(() => {
        this.personalInfo = data ? { ...data } : {};
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getSkills().subscribe(data => {
      this.ngZone.run(() => {
        if (data) {
          this.skills = {};
          this.skillCategories.forEach(cat => {
            this.skills[cat] = data[cat] ? [...data[cat]] : [];
          });
        } else {
          this.skills = { frontend: [], backend: [], database: [], cloud: [], tools: [] };
        }
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getExperience().subscribe(data => {
      this.ngZone.run(() => {
        this.experience = data ? data.map((item: any) => ({
          ...item,
          achievements: item.achievements ? [...item.achievements] : []
        })) : [];
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getProjects().subscribe(data => {
      this.ngZone.run(() => {
        this.projects = data ? data.map((item: any) => ({
          ...item,
          technologies: item.technologies ? [...item.technologies] : [],
          features: item.features ? [...item.features] : []
        })) : [];
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getEducation().subscribe(data => {
      this.ngZone.run(() => {
        this.education = data ? data.map((item: any) => ({
          ...item,
          relevant_coursework: item.relevant_coursework ? [...item.relevant_coursework] : []
        })) : [];
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getCertifications().subscribe(data => {
      this.ngZone.run(() => {
        this.certifications = data ? [...data] : [];
        this.cdr.detectChanges();
      });
    });

    this.portfolioService.getAchievements().subscribe(data => {
      this.ngZone.run(() => {
        this.achievements = data ? [...data] : [];
        this.cdr.detectChanges();
      });
    });

    this.loadContactMessages();
  }

  private async loadContactMessages() {
    try {
      await this.ngZone.run(async () => {
        const messagesCollection = collection(this.firestore, 'contact-messages');
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(messagesQuery);

        this.contactMessages = [];
        snapshot.forEach(doc => {
          this.contactMessages.push({ id: doc.id, ...doc.data() });
        });
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error loading contact messages:', error);
      this.contactMessages = [];
    }
  }

  // ===== SAVE OPERATIONS =====

  async savePersonalInfo() {
    this.isSaving = true;
    try {
      await this.portfolioService.updatePersonalInfo(this.personalInfo);
      this.showToast('Personal info saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save personal info', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveSkills() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateSkills(this.skills);
      this.showToast('Skills saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save skills', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveExperience() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateExperience(this.experience);
      this.showToast('Experience saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save experience', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveProjects() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateProjects(this.projects);
      this.showToast('Projects saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save projects', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveEducation() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateEducation(this.education);
      this.showToast('Education saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save education', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveCertifications() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateCertifications(this.certifications);
      this.showToast('Certifications saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save certifications', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveAchievements() {
    this.isSaving = true;
    try {
      await this.portfolioService.updateAchievements(this.achievements);
      this.showToast('Achievements saved successfully!', 'success');
    } catch (e) {
      this.showToast('Failed to save achievements', 'error');
    } finally {
      this.isSaving = false;
    }
  }

  // ===== SKILLS HELPERS =====

  addSkill(category: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value && this.skills[category]) {
      this.skills[category].push(value);
      input.value = '';
    }
    event.preventDefault();
  }

  addSkillFromInput(category: string, input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && this.skills[category]) {
      this.skills[category].push(value);
      input.value = '';
    }
  }

  removeSkill(category: string, index: number) {
    this.skills[category].splice(index, 1);
  }

  getSkillIcon(category: string): string {
    const icons: Record<string, string> = {
      frontend: 'fa-palette',
      backend: 'fa-server',
      database: 'fa-database',
      cloud: 'fa-cloud',
      tools: 'fa-wrench'
    };
    return icons[category] || 'fa-code';
  }

  // ===== EXPERIENCE HELPERS =====

  addExperience() {
    this.experience.push({
      company: '',
      position: '',
      duration: '',
      location: '',
      achievements: []
    });
  }

  removeExperience(index: number) {
    this.experience.splice(index, 1);
  }

  addAchievement(expIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.experience[expIndex].achievements.push(value);
      input.value = '';
    }
    event.preventDefault();
  }

  addAchievementFromInput(expIndex: number, input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.experience[expIndex].achievements.push(value);
      input.value = '';
    }
  }

  removeAchievement(expIndex: number, achIndex: number) {
    this.experience[expIndex].achievements.splice(achIndex, 1);
  }

  // ===== PROJECT HELPERS =====

  addProject() {
    this.projects.push({
      name: '',
      description: '',
      technologies: [],
      features: [],
      github: '',
      live_demo: '',
      image: ''
    });
  }

  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

  addProjTag(projIndex: number, field: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.projects[projIndex][field].push(value);
      input.value = '';
    }
    event.preventDefault();
  }

  addProjTagFromInput(projIndex: number, field: string, input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.projects[projIndex][field].push(value);
      input.value = '';
    }
  }

  removeProjTag(projIndex: number, field: string, tagIndex: number) {
    this.projects[projIndex][field].splice(tagIndex, 1);
  }

  // ===== EDUCATION HELPERS =====

  addEducation() {
    this.education.push({
      degree: '',
      school: '',
      duration: '',
      gpa: '',
      relevant_coursework: []
    });
  }

  removeEducation(index: number) {
    this.education.splice(index, 1);
  }

  addCoursework(eduIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.education[eduIndex].relevant_coursework.push(value);
      input.value = '';
    }
    event.preventDefault();
  }

  addCourseworkFromInput(eduIndex: number, input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.education[eduIndex].relevant_coursework.push(value);
      input.value = '';
    }
  }

  removeCoursework(eduIndex: number, courseIndex: number) {
    this.education[eduIndex].relevant_coursework.splice(courseIndex, 1);
  }

  // ===== GENERIC LIST HELPERS (Certifications / Achievements) =====

  addToList(list: string[], event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      list.push(value);
      input.value = '';
    }
    event.preventDefault();
  }

  addToListFromInput(list: string[], input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      list.push(value);
      input.value = '';
    }
  }

  // ===== TOAST =====

  private showToast(message: string, type: 'success' | 'error') {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage = message;
    this.toastType = type;
    this.toastHiding = false;

    this.toastTimeout = setTimeout(() => {
      this.toastHiding = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.toastMessage = '';
        this.toastHiding = false;
        this.cdr.detectChanges();
      }, 300);
    }, 3000);
  }
}
