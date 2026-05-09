import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { LucideAngularModule, ArrowLeft, ArrowRight, X, ExternalLink, Github } from 'lucide-angular';

type ProjectCategoryId = 'frontend' | 'backend' | 'fullstack';

interface Project {
  id: number;
  title: string;
  category: ProjectCategoryId;
  description: string;
  fullDescription: string;
  image: string;
  techs: string[];
  year: string;
  status: string;
  scope: string;
  role: string;
  highlights: string[];
  link?: string;
  network?: string;
  client?: string;
}

interface ProjectCategory {
  id: 'all' | ProjectCategoryId;
  label: string;
  count: number;
}

interface ProjectMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryLabels: Record<'all' | ProjectCategoryId, string> = {
    all: 'Todos',
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Full Stack'
  };

  readonly arrowLeft = ArrowLeft;
  readonly arrowRight = ArrowRight;
  readonly X = X;
  readonly ExternalLink = ExternalLink;
  readonly Github = Github;

  readonly projects: Project[] = [
    {
      id: 1,
      title: 'Teste Vocacional',
      category: 'fullstack',
      description: 'Sistema para aplicar testes vocacionais, calcular o perfil do usuario e exibir o resultado final.',
      fullDescription:
        'Projeto completo com tela de perguntas, calculo de resultado, armazenamento das respostas e area de consulta. A ideia e mostrar tanto a parte visual quanto a integracao entre front-end e back-end.',
      image: 'assets/img/teste-vocacional.png',
      techs: ['Html', 'Css', 'Javascript', 'PHP', 'MySQL'],
      year: '2024',
      status: 'Projeto academico',
      scope: 'Sistema web',
      role: 'Frontend e backend',
      network: 'https://github.com/Zelbato/Teste-Vocacional',
      highlights: [
        'Formulario com perguntas dinamicas e retorno de perfil ao final',
        'Integracao entre interface, regras de calculo e persistencia de dados',
        'Estrutura pronta para cadastro de usuarios e historico de resultados'
      ],
      client: 'Projeto de TCC'
    },
    {
      id: 2,
      title: 'Sistema de Sorveteria',
      category: 'fullstack',
      description: 'Sistema de gerenciamento com cadastro de produtos, pedidos e controle basico de atendimento.',
      fullDescription:
        'Projeto pensado para organizar o funcionamento de uma sorveteria em uma interface simples, com cadastro de sabores, controle de pedidos e integracao com uma base de dados para consulta e atualizacao.',
      image: 'assets/img/Sorveteria.png',
      techs: ['Angular', 'TypeScript', 'Laravel', 'MySQL'],
      year: '2026',
      status: 'Projeto para Empresa',
      scope: 'Sistema de gestao',
      role: 'Frontend e backend',
      network: 'https://github.com/Zelbato/pedy',
      highlights: [
        'Cadastro de produtos, categorias e pedidos em uma unica area',
        'Fluxo simples para atendimento e consulta de informacoes',
        'Base pronta para evoluir relatorios e controle de estoque'
      ],
      client: 'Projeto para Empresa'
    },
    {
      id: 3,
      title: 'Quiz de Programação',
      category: 'frontend',
      description: 'Aplicação interativa de perguntas e respostas voltada para lógica, programação e conhecimentos em desenvolvimento web.',
      fullDescription:
        'Projeto desenvolvido para testar conhecimentos de programação através de perguntas dinâmicas, pontuação em tempo real e feedback visual ao usuário. O sistema foi pensado para proporcionar uma experiência moderna, responsiva e intuitiva tanto em desktop quanto em dispositivos móveis.',
      image: 'assets/img/quiz-programação.png',
      techs: ['HTML', 'CSS', 'JavaScript'],
      year: '2023',
      status: 'Projeto pessoal',
      scope: 'Aplicação web',
      role: 'Frontend',
      link: 'https://quizdeprogramacao.netlify.app/',
      network: 'https://github.com/Zelbato/Quiz-Programacao',
      highlights: [
        'Sistema de perguntas e respostas com pontuação automática',
        'Interface responsiva e interativa focada em experiência do usuário',
        'Estrutura componentizada utilizando Angular e boas práticas de organização'
      ],
      client: 'Projeto pessoal'
    },
    {
      id: 4,
      title: 'Clone do Facebook',
      category: 'frontend',
      description: 'Interface inspirada no Facebook com feed de notícias, barra lateral de navegação e área de contatos.',
      fullDescription:
        'Projeto focado na recriação da interface clássica do Facebook, explorando componentes complexos como o sistema de postagens (feed), stories, menus laterais fixos e barra de chat lateral.',
      image: 'assets/img/clone-facebook.png',
      techs: ['HTML', 'Tailwindcss', 'JavaScript'],
      year: '2024',
      status: 'Clone de interface',
      scope: 'Interface web',
      role: 'Frontend',
      network: 'https://github.com/Zelbato/Clone-Facebook-Tailwindcss',
      highlights: [
        'Feed central dinâmico com componentes de postagem, reações e comentários',
        'Navegação lateral organizada por grupos, amigos e atalhos',
        'Header responsivo com busca, notificações e menu de perfil'
      ],
      client: 'Projeto pessoal'
    }
  ];

  readonly activeCategory = signal<'all' | ProjectCategoryId>('all');
  readonly activeProjectId = signal<number | null>(this.projects[0]?.id ?? null);
  readonly dialogProjectId = signal<number | null>(null);

  readonly filteredProjects = computed(() => {
    const category = this.activeCategory();
    if (category === 'all') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === category);
  });

  readonly activeProject = computed(() => {
    const currentId = this.activeProjectId();
    const currentProject = this.filteredProjects().find((project) => project.id === currentId);

    return currentProject ?? this.filteredProjects()[0] ?? null;
  });

  readonly dialogProject = computed(() => {
    const currentId = this.dialogProjectId();

    if (currentId === null) {
      return null;
    }

    return this.filteredProjects().find((project) => project.id === currentId) ?? null;
  });

  readonly categories = computed<ProjectCategory[]>(() => {
    const categoryMap = new Map<ProjectCategoryId, number>();

    this.projects.forEach((project) => {
      categoryMap.set(project.category, (categoryMap.get(project.category) ?? 0) + 1);
    });

    return [
      { id: 'all', label: this.categoryLabels.all, count: this.projects.length },
      {
        id: 'frontend',
        label: this.categoryLabels.frontend,
        count: categoryMap.get('frontend') ?? 0
      },
      {
        id: 'backend',
        label: this.categoryLabels.backend,
        count: categoryMap.get('backend') ?? 0
      },
      {
        id: 'fullstack',
        label: this.categoryLabels.fullstack,
        count: categoryMap.get('fullstack') ?? 0
      }
    ];
  });

  readonly overviewMetrics = computed<ProjectMetric[]>(() => {
    const visibleProjects = this.filteredProjects();
    const techCount = new Set(visibleProjects.flatMap((project) => project.techs)).size;
    const latestYear = visibleProjects.reduce(
      (highest, project) => Math.max(highest, Number(project.year)),
      0
    );

    return [
      {
        label: 'Projetos',
        value: this.formatCount(visibleProjects.length)
      },
      {
        label: 'Tecnologias',
        value: this.formatCount(techCount)
      },
      {
        label: 'Ano mais recente',
        value: latestYear ? String(latestYear) : '--'
      }
    ];
  });

  readonly activeProjectCounter = computed(() => {
    const visibleProjects = this.filteredProjects();
    const currentProject = this.activeProject();

    if (!currentProject || !visibleProjects.length) {
      return '00 / 00';
    }

    const currentIndex = visibleProjects.findIndex((project) => project.id === currentProject.id) + 1;
    return `${this.formatCount(currentIndex)} / ${this.formatCount(visibleProjects.length)}`;
  });

  readonly activeFilterLabel = computed(() => {
    const currentFilter = this.activeCategory();
    return this.categoryLabels[currentFilter];
  });

  readonly hasProjectNavigation = computed(() => this.filteredProjects().length > 1);

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.dialogProjectId() !== null ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      this.document.body.style.overflow = '';
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (this.dialogProjectId() === null) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeDialog();
    }

    if (event.key === 'ArrowLeft') {
      this.showProject(-1);
    }

    if (event.key === 'ArrowRight') {
      this.showProject(1);
    }
  }

  selectCategory(categoryId: 'all' | ProjectCategoryId): void {
    this.activeCategory.set(categoryId);

    const firstProject = this.filteredProjects()[0] ?? null;
    this.activeProjectId.set(firstProject?.id ?? null);

    if (this.dialogProjectId() !== null) {
      this.dialogProjectId.set(firstProject?.id ?? null);
    }
  }

  setActiveProject(project: Project): void {
    this.activeProjectId.set(project.id);
  }

  openProject(project?: Project | null): void {
    const currentProject = project ?? this.activeProject();

    if (!currentProject) {
      return;
    }

    this.activeProjectId.set(currentProject.id);
    this.dialogProjectId.set(currentProject.id);
  }

  closeDialog(): void {
    this.dialogProjectId.set(null);
  }

  showProject(offset: number): void {
    const visibleProjects = this.filteredProjects();
    const currentProject = this.dialogProject() ?? this.activeProject();

    if (!currentProject || !visibleProjects.length) {
      return;
    }

    const currentIndex = visibleProjects.findIndex((project) => project.id === currentProject.id);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextProject =
      visibleProjects[(safeIndex + offset + visibleProjects.length) % visibleProjects.length];

    this.activeProjectId.set(nextProject.id);

    if (this.dialogProjectId() !== null) {
      this.dialogProjectId.set(nextProject.id);
    }
  }

  hasPublicLink(project: Project): boolean {
    return Boolean(project.link);
  }

  getCategoryLabel(categoryId: ProjectCategoryId): string {
    return this.categoryLabels[categoryId];
  }

  private formatCount(value: number): string {
    return String(value).padStart(2, '0');
  }
}
