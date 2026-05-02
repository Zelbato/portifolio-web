import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

type SectionId = 'inicio' | 'sobre' | 'experiencia' | 'habilidades' | 'projetos';

interface NavItem {
  id: SectionId;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);

  readonly menu = Menu;
  readonly X = X;
  readonly menuOpen = signal(false);
  readonly activeSection = signal<SectionId>('inicio');
  readonly isScrolled = signal(false);

  readonly navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'habilidades', label: 'Habilidades' },
    { id: 'projetos', label: 'Projetos' },
  ];

  constructor() {
    queueMicrotask(() => this.updateActiveSection());
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.menuOpen()) {
      this.menuOpen.set(false);
    }

    this.updateActiveSection();
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  isActive(sectionId: SectionId): boolean {
    return this.activeSection() === sectionId;
  }

  navigateTo(sectionId: SectionId): void {
    this.closeMenu();

    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.activeSection.set('inicio');
      return;
    }

    const target = this.document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    this.activeSection.set(sectionId);
  }

  private updateActiveSection(): void {
    this.isScrolled.set(window.scrollY > 24);

    const sectionThreshold = 160;
    let currentSection: SectionId = 'inicio';

    for (const item of this.navItems) {
      if (item.id === 'inicio') {
        continue;
      }

      const section = this.document.getElementById(item.id);
      if (section && section.getBoundingClientRect().top <= sectionThreshold) {
        currentSection = item.id;
      }
    }

    this.activeSection.set(currentSection);
  }

  scrollToFooter(): void {
  this.closeMenu();

  const footer = this.document.querySelector('app-footer');
  footer?.scrollIntoView({ behavior: 'smooth' });
}
}
