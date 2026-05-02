import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Terminal, Brain } from 'lucide-angular';
import { ChatService } from '../../service/chat.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CtaComponent {

  readonly terminal = Terminal;
  readonly brain = Brain;

  constructor(
    private chatService: ChatService
  ) { }

openChat() {
  this.chatService.isChatOpen.set(true);
}
}
