import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { HeroComponent } from './pages/hero/hero.component';
import { AboutComponent } from './pages/about/about.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsComponent } from "./pages/project/project.component";
import { BlogSectionComponent } from './pages/blog-section/blog-section.component';
import { CtaComponent } from './pages/cta/cta.component';
import { ChatBoxComponent } from './pages/cta/chat-box/chat-box.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    TimelineComponent,
    SkillsComponent,
    ProjectsComponent,
    BlogSectionComponent,
    CtaComponent,
    ChatBoxComponent,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portifolio-web';
}
