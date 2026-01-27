import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
   <nav class="navbar">
  <div class="nav-inner">
    <div class="brand" routerLink="/">
      <img src="free-icon-health-7922906.png" alt="Logo" />
      <span>Well-Being Analytics</span>
    </div>

    <ul class="nav-links">
      <li>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Опросы
        </a>
      </li>
      <li>
        <a routerLink="/results" routerLinkActive="active">
          Результаты
        </a>
      </li>
    </ul>

    <div class="user" *ngIf="auth.isAuthenticated()">
      <button class="user-trigger" (click)="toggle()">
        <span class="name">{{ auth.username() }}</span>
        <span class="chevron">▾</span>
      </button>

      <div class="dropdown" *ngIf="open">
        <a *ngIf="auth.role() === 'admin'" routerLink="/admin">
Панель администратора
        </a>
        <button class="logout" (click)="logout()">
          Выход
        </button>
      </div>
    </div>

  </div>
</nav>

  `,
  styles: [`
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #111827;
  cursor: pointer;
  text-transform: uppercase;

  img {
    width: 28px;
    height: 28px;
  }
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    text-decoration: none;
    font-size: 1rem;
    color: #4b5563;
    font-weight: 500;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  a:hover {
    color: #111827;
  }

  a.active {
    color: #111827;
    border-color: #111827;
  }
}

.user {
  position: relative;
}

.user-trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.chevron {
  font-size: 1rem;
  opacity: 0.7;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 140%;
  min-width: 190px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  overflow: hidden;
  z-index: 100;

  a,
  button {
    display: block;
    width: 100%;
    padding: 0.7rem 1rem;
    background: none;
    border: none;
    text-align: left;
    font-size: 1rem;
    color: #374151;
    cursor: pointer;
  }

  a:hover,
  button:hover {
    background: #f9fafb;
  }
}

.logout {
  color: #991b1b;
  font-weight: 500;
}

  `]
})
export class NavbarComponent {

  auth = inject(AuthService);
  router = inject(Router);
  open = false;

  toggle() {
    this.open = !this.open;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
