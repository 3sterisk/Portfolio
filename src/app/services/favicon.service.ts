import { Injectable, OnDestroy } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaviconService implements OnDestroy {
  private subscription: Subscription | null = null;

  constructor(private portfolioService: PortfolioService) {}

  /**
   * Subscribes to portfolio personal info and generates a
   * dynamic favicon from the user's initials whenever the name changes.
   */
  init(): void {
    this.subscription = this.portfolioService.getPersonalInfo()
      .pipe(filter(info => !!info?.name))
      .subscribe(info => {
        const initials = this.getInitials(info.name);
        this.setFavicon(initials);
      });
  }

  /**
   * Extracts up to 2 initials from a full name.
   * "Kshitij Singh" → "KS", "John" → "J"
   */
  private getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  /**
   * Draws the initials onto a canvas and sets the result as the page favicon.
   * Uses the project's teal brand color (#21808D) as background.
   */
  private setFavicon(initials: string): void {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background — rounded square with brand teal gradient
    const radius = 14;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#21808D');   // teal-500
    gradient.addColorStop(1, '#1D7480');   // teal-600
    ctx.fillStyle = gradient;
    ctx.fill();

    // Text — white initials
    const fontSize = initials.length > 1 ? 26 : 32;
    ctx.font = `600 ${fontSize}px "Inter", "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2 + 1);

    // Apply as favicon
    const dataUrl = canvas.toDataURL('image/png');
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = dataUrl;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
