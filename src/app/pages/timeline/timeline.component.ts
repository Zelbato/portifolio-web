import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { LucideAngularModule, Code, Server, Network, Briefcase } from 'lucide-angular';

interface JourneyItem {
  year: string;
  title: string;
  icon: string;
  description: string;
  tag: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private animationFrameId: number | null = null;

  @ViewChild('timelineSection') timelineSection!: ElementRef<HTMLElement>;

  readonly progress = signal(0);
  readonly activeIndex = signal(0);

  readonly briefcase = Briefcase;

  readonly journey: JourneyItem[] = [
    {
      year: 'Atual',
      title: 'Desenvolvedor Web - Geminis Soluções',
      icon: 'briefcase',
      description:
        'Atuação no desenvolvimento de aplicações web utilizando Angular, Laravel e Ionic, incluindo criação de interfaces, consumo de APIs REST e manutenção de sistemas.',
      tag: 'Experiência profissional'
    },
    {
      year: '2025',
      title: 'Analista de Suporte Júnior - HD Soluções e Tecnologia',
      icon: 'briefcase',
      description:
        'Suporte técnico a usuários e sistemas, atuando na resolução de problemas, manutenção de ambientes e apoio em infraestrutura.',
      tag: 'Experiência profissional'
    },
    {
      year: '2025',
      title: 'Analista de Suporte - Unifunec',
      icon: 'briefcase',
      description:
        'Atuação com redes e infraestrutura, realizando suporte técnico, manutenção de equipamentos e garantia do funcionamento dos sistemas.',
      tag: 'Experiência profissional'
    },
    {
      year: '2023 - 2024',
      title: 'Freelancer em desenvolvimento web e design',
      icon: 'briefcase',
      description:
        'Atuação como freelancer no desenvolvimento de sites e interfaces, além de criação de peças de design gráfico, atendendo demandas reais e trabalhando diretamente com clientes.',
      tag: 'Experiência independente'
    }
  ];

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateProgress();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  scheduleProgressUpdate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.updateProgress();
      this.animationFrameId = null;
    });
  }

  setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  private updateProgress(): void {
    const section = this.timelineSection?.nativeElement;
    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const total = rect.height;
    const start = rect.top - viewHeight / 2;

    let value = 0;
    if (start < 0) {
      value = (Math.abs(start) / total) * 100;
    }

    this.progress.set(Math.min(Math.max(value, 0), 100));
  }
}
