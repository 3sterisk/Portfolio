import { Component, signal } from '@angular/core';
import { FaviconService } from './services/favicon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-portfolio');

  constructor(private faviconService: FaviconService) {
    this.faviconService.init();
  }
}
