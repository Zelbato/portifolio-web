import { Injectable, signal } from '@angular/core';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  posts = signal<Post[]>([
    {
      id: '1',
      title: 'Dominando Angular 21: O Guia Completo',
      excerpt: 'Descubra as novidades mais impactantes do Angular 21 e como elas simplificam o desenvolvimento modernizado.',
      content: 'Angular 21 trouxe mudanças significativas, especialmente na forma como lidamos com sinais e zoneless apps. O uso de provideRouter, signals para reatividade granular e a remoção completa do zone.js torna as aplicações muito mais leves e previsíveis. Neste artigo, exploramos como migrar seus componentes legados para o novo paradigma de classes standalone e inputs baseados em sinais.',
      date: '15 Mai, 2026',
      image: 'https://picsum.photos/seed/angular/800/450',
      category: 'Frameworks'
    },
    {
      id: '2',
      title: 'Por que Tailwind CSS 4 é o futuro',
      excerpt: 'Uma análise profunda das melhorias de performance e sintaxe da nova versão do Tailwind.',
      content: 'Tailwind CSS v4 removeu as dependências de configuração legadas e adotou uma abordagem 100% CSS. Agora, definimos nosso tema diretamente dentro do arquivo CSS usando @theme, o que reduz drasticamente o tempo de build e melhora a integração com ferramentas modernas. A nova engine de detecção de cores e o suporte nativo a variantes complexas elevam a produtividade do desenvolvedor frontend a um novo patamar.',
      date: '10 Mai, 2026',
      image: 'https://picsum.photos/seed/tailwind/800/450',
      category: 'Design'
    },
    {
      id: '3',
      title: 'Integração de IA em Apps Frontend',
      excerpt: 'Como usar o Gemini API para criar experiências interativas e inteligentes diretamente no navegador.',
      content: 'A era da IA chegou ao frontend. Com o @google/genai SDK, podemos construir chatbots sem backend, realizar análise de sentimentos em tempo real e até gerar conteúdo dinâmico baseado no contexto do usuário. O segredo está em saber orquestrar o contexto (systemInstructions) e as permissões de segurança. Neste post, mostramos como integramos o Gemini Flash para um assistente virtual ultra-rápido.',
      date: '05 Mai, 2026',
      image: 'https://picsum.photos/seed/ai/800/450',
      category: 'AI'
    }
  ]);

  selectedPost = signal<Post | null>(null);

  getPost(id: string) {
    return this.posts().find(p => p.id === id);
  }

  selectPost(post: Post | null) {
    this.selectedPost.set(post);
    if (post && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
