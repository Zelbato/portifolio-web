import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  effect
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../service/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import hljs from 'highlight.js';
import {
  LucideAngularModule,
  SendHorizontal,
  X,
  Menu,
  SquarePen,
  MessageSquare,
  Settings,
  Trash2,
  MoreVertical
} from 'lucide-angular';

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const language = lang || '';
  const highlighted =
    language && hljs.getLanguage(language)
      ? hljs.highlight(text, { language }).value
      : hljs.highlightAuto(text).value;

  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

marked.use({ renderer });
marked.setOptions({
  gfm: true,
  breaks: true
});

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBoxComponent {

  chatService = inject(ChatService);
  sanitizer = inject(DomSanitizer);

  userInput = signal('');
  isSidebarCollapsed = signal(false);
  openedChatMenuId = signal<string | null>(null);
  chatToDeleteId = signal<string | null>(null);

  readonly SendHorizontal = SendHorizontal;
  readonly X = X;
  readonly Menu = Menu;
  readonly squarePen = SquarePen;
  readonly MessageSquare = MessageSquare;
  readonly Settings = Settings;
  readonly Trash2 = Trash2;
  readonly MoreVertical = MoreVertical;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private lastHeight = 0;

  constructor() {
    effect(() => {
      this.chatService.messages();
      this.smartScroll();
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
    if (this.isSidebarCollapsed()) {
      this.openedChatMenuId.set(null);
    }
  }

  toggleOptions(chatId: string) {
    this.openedChatMenuId.set(this.openedChatMenuId() === chatId ? null : chatId);
  }

  askDeletePermission(id: string) {
    this.chatToDeleteId.set(id);
    this.openedChatMenuId.set(null); 
  }

  confirmDelete() {
    const id = this.chatToDeleteId();
    if (id) {
      this.chatService.deleteChat(id);
      this.chatToDeleteId.set(null);
    }
  }

  parseMarkdown(text: string) {
    const raw = marked.parse(text) as string;

    const highlighted = raw.replace(
      /<pre><code class="language-(.+?)">([\s\S]*?)<\/code><\/pre>/g,
      (_: string, lang: string, code: string) => {
        const valid = hljs.highlight(code, {
          language: lang
        }).value;

        return `<pre><code class="hljs">${valid}</code></pre>`;
      }
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.chatService.isLoading()) return;

    this.userInput.set('');
    this.chatService.sendMessage(text);
  }

  private smartScroll() {
    requestAnimationFrame(() => {
      const el = this.scrollContainer?.nativeElement;
      if (!el) return;

      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 120;

      const changed = el.scrollHeight !== this.lastHeight;
      this.lastHeight = el.scrollHeight;

      if (isNearBottom || changed) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}