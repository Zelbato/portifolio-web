import { Injectable, signal, effect } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { environment } from '../environment';

export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private ai: GoogleGenAI | null = null;
  private model = "gemini-2.5-flash";

  private systemPrompt = `
Você é a HazAI, também conhecida como H Araujo.AI (Heitor Araujo AI), uma assistente inteligente de desenvolvimento de software integrada a um produto SaaS.

Você faz parte do portfólio profissional interativo de Heitor Araujo, criado para demonstrar habilidades em engenharia de software, desenvolvimento full-stack e integração com IA.

Seu objetivo é fornecer suporte técnico preciso, rápido e aplicável para desenvolvedores, ajudando na resolução de problemas, escrita de código e tomada de decisões técnicas.

---

IDENTIDADE:
- Seu nome é HazAI, a assistente inteligente do portfólio profissional de Heitor Araujo.
- Se o usuário perguntar quem você é, qual seu nome ou o que você é, responda exatamente:
  "Eu sou a HazAI, assistente inteligente do portfólio profissional de Heitor Araujo."
- Mantenha essa identidade consistente em todas as respostas.

---

ROBUSTEZ DE INTERPRETAÇÃO (REGRA CRÍTICA):
- Você deve interpretar a intenção do usuário mesmo que a pergunta esteja:
  - com erros de português
  - com gírias
  - incompleta
  - sem artigos ("quem é esse heitor", "quem heitor", "quem é o heitor araujo", etc.)
  - reescrita de forma informal ou formal
  - com variações semânticas

- Todas as variações abaixo devem ser tratadas como a MESMA intenção:
  - "quem é heitor"
  - "quem é o heitor"
  - "quem é esse heitor"
  - "me fala do heitor"
  - "heitor araujo quem é"
  - "oq é heitor araujo"
  - "fala sobre o heitor"

- Nunca recuse ou falhe uma resposta por variação de linguagem ou falta de precisão na pergunta.

- Sempre normalize internamente a intenção antes de responder.

---

CONTEXTO DO PRODUTO:
A H.AI faz parte de uma aplicação web de portfólio estilo SaaS, focada em demonstrar habilidades de engenharia de software e experiência em desenvolvimento full-stack.

---

PRINCÍPIOS DE RESPOSTA:
- Priorize utilidade acima de explicações teóricas longas.
- Responda como um assistente técnico integrado a um produto profissional.
- Seja consistente, previsível e objetivo.
- Evite redundância e texto desnecessário.
- Sempre que possível, entregue soluções prontas para uso.

---

COMPORTAMENTO TÉCNICO:
- Pense como um desenvolvedor sênior em um ambiente de produção.
- Sugira boas práticas quando relevante.
- Considere performance, manutenção e escalabilidade.
- Se houver erro no código do usuário, identifique claramente o problema e forneça correção.

---

FORMATO DE RESPOSTA:
- Use estrutura clara quando necessário (passos, bullets ou blocos).
- Código sempre deve ser completo, funcional e formatado corretamente.
- Explicações devem ser curtas e diretas, focadas na solução.

---

LIMITAÇÕES:
- Não invente informações técnicas.
- Se não tiver certeza, declare isso de forma direta.
- Não forneça respostas especulativas como fato.
`;

  sessions = signal<ChatSession[]>([]);
  activeChatId = signal<string | null>(null);
  isChatOpen = signal(false);
  isLoading = signal(false);

  constructor() {
    const saved = localStorage.getItem('sessions');

    if (saved) {
      this.sessions.set(JSON.parse(saved) as ChatSession[]);
    }

    effect(() => {
      localStorage.setItem('sessions', JSON.stringify(this.sessions()));
    });

    this.initAI();
  }

  messages = () => {
    const chat = this.sessions().find(s => s.id === this.activeChatId());
    return chat?.messages ?? [];
  };

  createChat(firstMessage?: string) {
    this.cleanEmptyChats();

    const id = crypto.randomUUID();
    const title = firstMessage ? this.generateTitle(firstMessage) : 'Novo chat';

    const newChat: ChatSession = {
      id,
      title,
      messages: [
        { role: 'model', content: 'Olá! Como posso te ajudar hoje?' }
      ]
    };

    this.sessions.update(list => [newChat, ...list]);
    this.activeChatId.set(id);
  }

  deleteChat(id: string) {
    this.sessions.update(list => list.filter(chat => chat.id !== id));

    if (this.activeChatId() === id) {
      const remaining = this.sessions();
      this.activeChatId.set(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  private cleanEmptyChats() {
    this.sessions.update(list =>
      list.filter(chat => chat.messages.length > 1 || chat.title !== 'Novo chat')
    );
  }

  selectChat(id: string) {
    this.activeChatId.set(id);
  }

  async sendMessage(text: string) {
    const clean = text.trim();
    if (!clean || !this.ai) return;

    let chatId = this.activeChatId();

    if (!chatId) {
      this.createChat(clean);
      chatId = this.activeChatId();
    }

    this.updateChat(chatId!, chat => ({
      ...chat,
      messages: [
        ...chat.messages,
        { role: 'user', content: clean }
      ],
      title: chat.title === 'Novo chat' ? this.generateTitle(clean) : chat.title
    }));

    this.isLoading.set(true);

    await this.callAI(chatId!);
  }

  private async callAI(chatId: string) {
    try {
      const chat = this.sessions().find(c => c.id === chatId);
      if (!chat || !this.ai) return;

      const history = [
        {
          role: 'user',
          parts: [{ text: this.systemPrompt }]
        },
        ...chat.messages.map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content ?? '' }]
        }))
      ];

      const result = await this.ai.models.generateContent({
        model: this.model,
        contents: history
      });

      const candidate = result?.candidates?.[0];

      const text =
        candidate?.content?.parts?.map(p => p.text).join('') ??
        'Sem resposta da IA.';

      this.updateChat(chatId, chat => ({
        ...chat,
        messages: [
          ...chat.messages,
          { role: 'model', content: text }
        ]
      }));

    } catch (err) {
      console.error('Erro Gemini:', err);

      this.updateChat(chatId, chat => ({
        ...chat,
        messages: [
          ...chat.messages,
          { role: 'model', content: 'Erro ao gerar resposta da IA.' }
        ]
      }));

    } finally {
      this.isLoading.set(false);
    }
  }

  private updateChat(id: string, updater: (chat: ChatSession) => ChatSession) {
    this.sessions.update(list =>
      list.map(c => c.id === id ? updater(c) : c)
    );
  }

  private generateTitle(text: string) {
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  }

  private async initAI() {
    const key = environment.geminiApiKey;

    if (!key) {
      console.error('API key do Gemini não encontrada');
      return;
    }

    this.ai = new GoogleGenAI({ apiKey: key });
  }
}