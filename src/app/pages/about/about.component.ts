import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  BrainCircuit,
  Cpu,
  Layers,
  LucideAngularModule,
  LucideIconData,
  Settings,
  Sparkles
} from 'lucide-angular';

interface MetadataItem {
  label: string;
  value: string;
}

interface PhaseItem {
  title: string;
  icon: LucideIconData;
  content: string;
  tags: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {



  readonly metadata: MetadataItem[] = [
    { label: 'Foco atual', value: 'Aplicações web completas' },
    { label: 'Stack principal', value: 'Angular, SCSS, TypeScript e Node.js' },
    { label: 'Atuação', value: 'Frontend e Full Stack' },
    { label: 'Disponibilidade', value: 'Projetos pessoais e freelas' }
  ];

  readonly phases: PhaseItem[] = [
    {
      title: 'Base técnica',
      icon: Layers,
      content:
        'Desenvolvo aplicações com código organizado, seguindo boas práticas e princípios de arquitetura, garantindo manutenção simples e evolução consistente do sistema.',
      tags: ['Arquitetura', 'Clean Code', 'Escalabilidade']
    },
    {
      title: 'Interface e experiência',
      icon: Sparkles,
      content:
        'Crio interfaces modernas e responsivas com Angular, focando em usabilidade, organização por componentes e uma experiência clara e eficiente para o usuário.',
      tags: ['Angular', 'UI', 'UX', 'Responsividade']
    },
    {
      title: 'Back-end e integrações',
      icon: BrainCircuit,
      content:
        'Desenvolvo APIs com Laravel e realizo integração entre front-end e back-end, incluindo autenticação, consumo de serviços e organização das regras de negócio.',
      tags: ['Laravel', 'API REST', 'Integração', 'Full Stack']
    }
  ];

  readonly brainCircuit = BrainCircuit;
  readonly cpu = Cpu;
  readonly settings = Settings;
  readonly layers = Layers;
  readonly sparkles = Sparkles;
}
