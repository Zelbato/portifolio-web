import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideAngularModule, ArrowRight} from 'lucide-angular';
import { BlogService } from '../../service/blog.service';

@Component({
  selector: 'app-blog-section',
  imports: [LucideAngularModule],
  templateUrl: './blog-section.component.html',
  styleUrl: './blog-section.component.scss'
})
export class BlogSectionComponent {
  blogService = inject(BlogService);

  readonly ArrowRight = ArrowRight;
}
