import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

type SectionId =
  | 'inicio'
  | 'sobre'
  | 'experiencia'
  | 'habilidades'
  | 'projetos'
  | 'contatos';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly document = inject(DOCUMENT);

  readonly activeSection = signal<SectionId>('contatos');

  readonly navItems: { id: SectionId; label: string }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiencia', label: 'Experiência' },
    { id: 'habilidades', label: 'Habilidades' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'contatos', label: 'Contato' }
  ];

  navigateTo(sectionId: SectionId): void {
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.activeSection.set('inicio');
      return;
    }

    const target = this.document.getElementById(sectionId);
    if (!target) return;

    const offsetTop =
      target.getBoundingClientRect().top + window.scrollY - 96;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });

    this.activeSection.set(sectionId);
  }

  isActive(sectionId: SectionId): boolean {
    return this.activeSection() === sectionId;
  }
}