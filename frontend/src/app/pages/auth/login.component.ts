import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { AuthLayoutComponent } from './auth-layout.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthLayoutComponent
  ],
  template: `
    <app-auth-layout
      title="Войти"
      subtitle="Платформа для обеспечения благополучия сотрудников"
    >
      <label>
        Имя пользователя
        <input [(ngModel)]="username" />
      </label>

      <label>
        Пароль
        <input type="password" [(ngModel)]="password" />
      </label>

      <button (click)="login()">Sign in</button>

      <p class="hint">
        У вас нет аккаунта?
        <a routerLink="/register">Регистрация</a>
      </p>
    </app-auth-layout>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        this.router.navigate([res.role === 'admin' ? '/admin' : '/']);
      },
      error: () => alert('Invalid credentials')
    });
  }
}
