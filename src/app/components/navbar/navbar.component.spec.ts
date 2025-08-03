// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { NavbarComponent } from './navbar.component';

// describe('NavbarComponent', () => {
//   let component: NavbarComponent;
//   let fixture: ComponentFixture<NavbarComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [NavbarComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(NavbarComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { Component, ElementRef, ViewChild, ViewChildren, QueryList, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navContainer', { static: true }) navContainer!: ElementRef;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;

  sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];

  activeSection: string = 'home';
  isMobileMenuOpen = false;

  private underline!: HTMLElement;
  private activeIndex = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.underline = this.navContainer.nativeElement.querySelector('.nav-underline');

    // Initialize underline under default activeSection (home)
    setTimeout(() => {
      this.activeIndex = this.sections.indexOf(this.activeSection);
      this.moveUnderlineTo(this.activeIndex, false);
    });
  }

  toggleTheme() {
    // Your existing toggleTheme logic
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

  onNavClick(targetIndex: number) {
    if (targetIndex === this.activeIndex) return;
    this.animateUnderlineTransition(this.activeIndex, targetIndex);
    this.activeIndex = targetIndex;
    this.activeSection = this.sections[targetIndex];
  }

  private moveUnderlineTo(index: number, animate: boolean = true) {
    const linkEl = this.navLinks.toArray()[index].nativeElement;
    const containerRect = this.navContainer.nativeElement.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    if (!animate) {
      this.renderer.setStyle(this.underline, 'transition', 'none');
    } else {
      this.renderer.setStyle(this.underline, 'transition', 'left 0.3s ease, width 0.3s ease');
    }

    this.renderer.setStyle(this.underline, 'left', `${left}px`);
    this.renderer.setStyle(this.underline, 'width', `${width}px`);

    if (!animate) {
      void (this.underline.offsetWidth); // force reflow
      this.renderer.removeStyle(this.underline, 'transition');
    }
  }

  private animateUnderlineTransition(fromIndex: number, toIndex: number) {
    const linkFrom = this.navLinks.toArray()[fromIndex].nativeElement;
    const containerRect = this.navContainer.nativeElement.getBoundingClientRect();

    // Position underline at current link with current width
    const fromRect = linkFrom.getBoundingClientRect();
    const fromLeft = fromRect.left - containerRect.left;

    this.renderer.setStyle(this.underline, 'left', `${fromLeft}px`);
    this.renderer.setStyle(this.underline, 'width', `${fromRect.width}px`);
    this.renderer.setStyle(this.underline, 'transition', 'left 0.3s ease, width 0.3s ease');

    // Shrink width to zero
    setTimeout(() => {
      this.renderer.setStyle(this.underline, 'width', '0px');
    }, 10); // slight delay to start transition

    // After shrink animation complete, move and expand to target link
    setTimeout(() => {
      const toLink = this.navLinks.toArray()[toIndex].nativeElement;
      const toRect = toLink.getBoundingClientRect();
      const toLeft = toRect.left - containerRect.left;

      this.renderer.setStyle(this.underline, 'left', `${toLeft}px`);
      
      // Prepare for expanding width from 0
      this.renderer.setStyle(this.underline, 'width', '0px');
      void (this.underline.offsetWidth); // reflow to reset animation

      // Expand underline to new width
      this.renderer.setStyle(this.underline, 'width', `${toRect.width}px`);
    }, 310); // slightly more than transition duration (300ms)
  }
}

