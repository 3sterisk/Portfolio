import { Directive, ElementRef, Renderer2, Input, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
  @Input('appScrollAnimate') animateClass = 'fade-in';
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            const classToAdd = this.animateClass && this.animateClass.trim() ? this.animateClass : 'fade-in';
            this.renderer.removeClass(this.el.nativeElement, 'pre-fade-in');
            console.log('Animating element:', this.el.nativeElement);
            this.renderer.addClass(this.el.nativeElement, classToAdd);
            // this.observer.disconnect();
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, this.animateClass);
            // this.renderer.addClass(this.el.nativeElement, 'pre-fade-in');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    this.observer.observe(this.el.nativeElement);
    console.log('Initialized scroll observer for', this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
