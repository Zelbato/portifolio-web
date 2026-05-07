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
    { label: 'Stack principal', value: 'Angular, SCSS, TypeScript e Laravel' },
    { label: 'Atuação', value: 'Frontend e Full-Stack' },
    { label: 'Disponibilidade', value: 'Projetos pessoais e freelas' }
  ];

  readonly phases: PhaseItem[] = [
    {
      title: 'Base técnica',
      icon: Layers,
      content:
        'Desenvolvo aplicações com foco em organização, boas práticas e estruturação de código, buscando criar sistemas fáceis de manter, evoluir e escalar conforme a necessidade do projeto.',
      tags: ['Arquitetura', 'Clean Code', 'Organização', 'Escalabilidade']
    },
    {
      title: 'Interface e experiência',
      icon: Sparkles,
      content:
        'Crio interfaces modernas, responsivas e bem estruturadas, priorizando usabilidade, componentização e uma experiência clara e intuitiva para o usuário.',
      tags: ['Angular', 'UI', 'UX', 'Responsividade']
    },
    {
      title: 'Back-end e integrações',
      icon: BrainCircuit,
      content:
        'Desenvolvo APIs e integrações entre front-end e back-end, organizando regras de negócio, autenticação e comunicação entre sistemas de forma eficiente e estruturada.',
      tags: ['Laravel', 'API REST', 'Integração', 'Full-Stack']
    }
  ];

  readonly brainCircuit = BrainCircuit;
  readonly cpu = Cpu;
  readonly settings = Settings;
  readonly layers = Layers;
  readonly sparkles = Sparkles;
}
