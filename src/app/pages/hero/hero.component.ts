import {
  Component, OnInit, OnDestroy, signal, computed,
  PLATFORM_ID, Inject, NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, LogIn } from 'lucide-angular';
import { RouterLink } from "@angular/router";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

interface BootLog {
  id: number;
  time: string;
  text: string;
  status: 'ok' | 'pending';
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly login = LogIn;

  isBrowser: boolean;
  particles: Particle[] = [];

  mouseX = signal(0);
  mouseY = signal(0);

  bootLogs = signal<BootLog[]>([]);
  isBooting = signal(true);
  currentTypingLine = signal('');
  currentTimestamp = signal('');

  private bootSequence = [
    { text: 'Inicializando ambiente de desenvolvimento...', status: 'ok' as const },
    { text: 'Carregando interface (Angular)...', status: 'ok' as const },
    { text: 'Conectando API (Laravel)...', status: 'ok' as const },
    { text: 'Sincronizando dados via REST...', status: 'ok' as const },
    { text: 'Aplicando boas práticas de arquitetura...', status: 'ok' as const },
    { text: 'Sistema pronto para uso.', status: 'ok' as const },
  ];

  private typingInterval: ReturnType<typeof setInterval> | null = null;
  private timestampInterval: ReturnType<typeof setInterval> | null = null;
  private bootTimeout: ReturnType<typeof setTimeout>[] = [];

  codeColumns: any[] = [];

  private snippets = [
    '// Angular + Laravel Fullstack',
    'this.http.post("/api/auth/login")',
    'Route::middleware("auth:sanctum")->group(...)',
    'Observable<User[]>',
    'async/await + REST API',
    'SOLID principles applied',
    'Clean Architecture',
    'component-based UI',
    'responsive layout',
    'scalable system design'
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.generateParticles();
    this.generateRain();
    this.startTimestamp();
    this.runBootSequence();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.timestampInterval) clearInterval(this.timestampInterval);
    this.bootTimeout.forEach(t => clearTimeout(t));
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  enterContacts() {
    const number = '17988096975';
    const msg = `Olá.
Vim pelo seu portfólio e tenho interesse no desenvolvimento de um sistema sob medida.
Gostaria de solicitar um orçamento e obter informações sobre o processo, prazos e valores.
Aguardo retorno.`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  generateRain() {
    const totalColumns = 15;
    for (let i = 0; i < totalColumns; i++) {
      this.codeColumns.push({
        left: (i * (100 / totalColumns)) + (Math.random() * 2) + '%',
        duration: (10 + Math.random() * 15) + 's',
        delay: '-' + (Math.random() * 20) + 's',
        lines: Array.from({ length: 12 + Math.floor(Math.random() * 8) }, () =>
          this.snippets[Math.floor(Math.random() * this.snippets.length)]
        )
      });
    }
  }

  private generateParticles(): void {
    this.particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 10 + 8,
    }));
  }

  private startTimestamp(): void {
    const update = () => {
      const now = new Date();
      this.currentTimestamp.set(
        now.toTimeString().split(' ')[0]
      );
    };
    update();
    this.timestampInterval = setInterval(update, 3000);
  }

  private runBootSequence(): void {
    let logId = 0;

    this.bootSequence.forEach((entry, i) => {
      const t = setTimeout(() => {
        this.ngZone.run(() => {
          this.startTyping(entry.text, () => {
            this.bootLogs.update(logs => [
              ...logs,
              {
                id: logId++,
                time: this.currentTimestamp(),
                text: entry.text,
                status: entry.status,
              },
            ]);
            this.currentTypingLine.set('');

            if (i === this.bootSequence.length - 1) {
              this.isBooting.set(false);
            }
          });
        });
      }, i * 1200);

      this.bootTimeout.push(t);
    });
  }

  private startTyping(text: string, onDone: () => void): void {
    if (this.typingInterval) clearInterval(this.typingInterval);

    let i = 0;
    this.currentTypingLine.set('');

    this.typingInterval = setInterval(() => {
      i++;
      this.currentTypingLine.set(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(this.typingInterval!);
        this.typingInterval = null;
        setTimeout(onDone, 300);
      }
    }, 30);
  }
}