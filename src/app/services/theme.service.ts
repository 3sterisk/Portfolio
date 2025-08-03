import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(true);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme === 'dark');
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode.value;
    this.setTheme(newTheme);
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.next(isDark);
    document.documentElement.setAttribute(
      'data-color-scheme', 
      isDark ? 'dark' : 'light'
    );
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
