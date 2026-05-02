import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal
} from '@angular/core';
import { LucideAngularModule, LucideIconData, Code, Terminal, Cpu, Zap, Flame, Palette, Database, Ship, BarChart3, LayoutDashboard, Monitor, Server, Cloud, Brain } from 'lucide-angular';

type SkillCategoryId = 'frontend' | 'backend' | 'cloud' | 'ai';

interface SkillCategory {
  id: 'all' | SkillCategoryId;
  name: string;
  icon: LucideIconData;
}

interface SkillItem {
  name: string;
  icon: LucideIconData;
  level: number;
  category: SkillCategoryId;
  yearsEx: number;
  usage: string;
  status: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;

  @ViewChildren('skillCard') skillCards!: QueryList<ElementRef<HTMLElement>>;

  readonly currentCategory = signal<'all' | SkillCategoryId>('all');
  readonly selectedSkillName = signal('Angular');
  readonly visibleSkills = signal<Record<string, boolean>>({});

  readonly categories: SkillCategory[] = [
    { id: 'all', name: 'Todas', icon: LayoutDashboard },
    { id: 'frontend', name: 'Frontend', icon: Monitor },
    { id: 'backend', name: 'Backend', icon: Server },
    { id: 'cloud', name: 'Cloud', icon: Cloud },
    { id: 'ai', name: 'IA', icon: Brain }
  ];

  readonly skillsList: SkillItem[] = [
    { name: 'Angular', icon: Code, level: 96, category: 'frontend', yearsEx: 5, usage: 'Interfaces e aplicações completas', status: 'Principal' },
    { name: 'TypeScript', icon: Terminal, level: 94, category: 'frontend', yearsEx: 6, usage: 'Tipagem, estrutura e manutenção', status: 'Principal' },
    { name: 'Node.js', icon: Cpu, level: 88, category: 'backend', yearsEx: 4, usage: 'APIs, regras de negócio e serviços', status: 'Forte' },
    { name: 'Gemini AI', icon: Zap, level: 85, category: 'ai', yearsEx: 1, usage: 'Automação e recursos inteligentes', status: 'Ativo' },
    { name: 'Firebase', icon: Flame, level: 92, category: 'cloud', yearsEx: 4, usage: 'Autenticação, banco e hospedagem', status: 'Forte' },
    { name: 'Tailwind CSS', icon: Palette, level: 98, category: 'frontend', yearsEx: 4, usage: 'Criação rápida de interfaces', status: 'Especialidade' },
    { name: 'PostgreSQL', icon: Database, level: 82, category: 'cloud', yearsEx: 3, usage: 'Modelagem e persistência de dados', status: 'Consistente' },
    { name: 'Docker', icon: Ship, level: 75, category: 'backend', yearsEx: 2, usage: 'Ambientes e deploy', status: 'Evolução' },
    { name: 'Python', icon: BarChart3, level: 80, category: 'ai', yearsEx: 3, usage: 'Scripts, dados e automações', status: 'Consistente' }
  ];

  readonly filteredSkills = computed(() => {
    const category = this.currentCategory();
    if (category === 'all') {
      return this.skillsList;
    }

    return this.skillsList.filter((skill) => skill.category === category);
  });

  readonly selectedSkill = computed(() => {
    const current = this.filteredSkills().find((skill) => skill.name === this.selectedSkillName());
    return current ?? this.filteredSkills()[0] ?? null;
  });

  readonly stats = computed(() => {
    const skills = this.filteredSkills();
    const average = skills.length
      ? Math.round(skills.reduce((total, skill) => total + skill.level, 0) / skills.length)
      : 0;

    return {
      total: skills.length,
      average
    };
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  ngAfterViewInit(): void {
    this.setupObserver();
    this.skillCards.changes.subscribe(() => this.setupObserver());
  }

  selectCategory(categoryId: 'all' | SkillCategoryId): void {
    this.currentCategory.set(categoryId);

    const firstSkill = this.filteredSkills()[0];
    if (firstSkill) {
      this.selectedSkillName.set(firstSkill.name);
    }

    queueMicrotask(() => this.setupObserver());
  }

  selectSkill(skill: SkillItem): void {
    this.selectedSkillName.set(skill.name);
  }

  isSkillVisible(skillName: string): boolean {
    return Boolean(this.visibleSkills()[skillName]);
  }

  getSkillCount(categoryId: 'all' | SkillCategoryId): number {
    if (categoryId === 'all') {
      return this.skillsList.length;
    }

    return this.skillsList.filter((skill) => skill.category === categoryId).length;
  }

  private setupObserver(): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        const nextState = { ...this.visibleSkills() };

        entries.forEach((entry) => {
          const skillName = entry.target.getAttribute('data-skill-name');
          if (!skillName) {
            return;
          }

          nextState[skillName] = entry.isIntersecting;
        });

        this.visibleSkills.set(nextState);
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.skillCards.forEach((card) => {
      this.observer?.observe(card.nativeElement);
    });
  }
}
