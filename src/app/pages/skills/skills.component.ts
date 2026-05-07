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
import { LucideAngularModule, LucideIconData, Code, Terminal, Cpu, Zap, Flame, Palette, Database, Ship, BarChart3, LayoutDashboard, Monitor, Server, Cloud, Brain, Smartphone, Sparkles } from 'lucide-angular';

type SkillCategoryId = 'frontend' | 'backend' | 'ai' | 'mobile';

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
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    // { id: 'cloud', name: 'Cloud', icon: Cloud },
    { id: 'ai', name: 'IA', icon: Brain }
  ];

  readonly skillsList: SkillItem[] = [
    {
      name: 'Angular',
      icon: Code,
      level: 65,
      category: 'frontend',
      yearsEx: 0.5,
      usage: 'Desenvolvimento de interfaces e aplicações web',
      status: 'Principal'
    },

    {
      name: 'TypeScript',
      icon: Terminal,
      level: 65,
      category: 'frontend',
      yearsEx: 0.5,
      usage: 'Estruturação, tipagem e manutenção de aplicações',
      status: 'Principal'
    },
    {
      name: 'JavaScript',
      icon: Cpu,
      level: 78,
      category: 'frontend',
      yearsEx: 2,
      usage: 'Interatividade, lógica e funcionalidades web',
      status: 'Consistente'
    },

    {
      name: 'Tailwind CSS',
      icon: Palette,
      level: 90,
      category: 'frontend',
      yearsEx: 2,
      usage: 'Criação de interfaces modernas e responsivas',
      status: 'Destaque'
    },

    {
      name: 'SCSS',
      icon: Palette,
      level: 80,
      category: 'frontend',
      yearsEx: 2,
      usage: 'Estilização avançada e organização de estilos',
      status: 'Consistente'
    },

    {
      name: 'Laravel',
      icon: Cpu,
      level: 35,
      category: 'backend',
      yearsEx: 0.3,
      usage: 'APIs, regras de negócio e integrações',
      status: 'Principal'
    },

    {
      name: 'PHP',
      icon: Terminal,
      level: 75,
      category: 'backend',
      yearsEx: 1,
      usage: 'Desenvolvimento back-end e lógica de sistemas',
      status: 'Consistente'
    },

    {
      name: 'Docker',
      icon: Ship,
      level: 60,
      category: 'backend',
      yearsEx: 1,
      usage: 'Ambientes de desenvolvimento e deploy',
      status: 'Aprendizado'
    },

    {
      name: 'Google AI Studio',
      icon: Sparkles,
      level: 78,
      category: 'ai',
      yearsEx: 1,
      usage: 'Prototipação de interfaces e auxílio criativo',
      status: 'Ativo'
    },

    {
      name: 'Gemini',
      icon: Zap,
      level: 82,
      category: 'ai',
      yearsEx: 2,
      usage: 'Auxílio no desenvolvimento e estruturação de código',
      status: 'Ativo'
    },

    {
      name: 'Stitch',
      icon: Smartphone,
      level: 70,
      category: 'ai',
      yearsEx: 1,
      usage: 'Criação e prototipação de layouts mobile',
      status: 'Explorando'
    },

    {
      name: 'Ionic',
      icon: Smartphone,
      level: 72,
      category: 'mobile',
      yearsEx: 0.5,
      usage: 'Desenvolvimento de aplicações mobile híbridas',
      status: 'Consistente'
    }
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
