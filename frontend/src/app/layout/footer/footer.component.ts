import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <p>© 2026 Employee Wellbeing Program</p>

      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #ffffff;
      border-top: 1px solid #e2ece9;
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      text-align: center;
      font-size: 1.2rem;
      color: #7a9792;
    }

  `]
})
export class FooterComponent {}
