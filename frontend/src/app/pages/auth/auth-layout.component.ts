import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>

        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
