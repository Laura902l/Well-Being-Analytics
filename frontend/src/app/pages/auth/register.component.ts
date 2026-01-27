import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service';
import { AuthLayoutComponent } from './auth-layout.component';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthLayoutComponent
  ],
  template: `
    <app-auth-layout
      title="Регистрация"
      subtitle="Создайте аккаунт для доступа к платформе благополучия"
    >

      <form #form="ngForm" (ngSubmit)="register(form)" novalidate>

        <!-- FULL NAME -->
        <label>
          Полное имя
          <input
            name="fullName"
            [(ngModel)]="fullName"
            required
            minlength="3"
            #fullNameCtrl="ngModel"
          />
        </label>

        <div class="validation"
          *ngIf="fullNameCtrl.invalid && (fullNameCtrl.touched || form.submitted)">
          <div *ngIf="fullNameCtrl.errors?.['required']">
            Полное имя обязательно
          </div>
          <div *ngIf="fullNameCtrl.errors?.['minlength']">
            Минимум 3 символа
          </div>
        </div>

        <!-- USERNAME -->
        <label>
          Имя пользователя
          <input
            name="username"
            [(ngModel)]="username"
            (ngModelChange)="usernameChanges.next($event)"
            required
            minlength="3"
            #usernameCtrl="ngModel"
          />
        </label>

        <div class="validation"
          *ngIf="
            (usernameCtrl.invalid && (usernameCtrl.touched || form.submitted))
            || usernameExists
          ">
          <div *ngIf="usernameCtrl.errors?.['required']">
            Имя пользователя обязательно
          </div>
          <div *ngIf="usernameCtrl.errors?.['minlength']">
            Минимум 3 символа
          </div>
          <div *ngIf="usernameExists">
            Пользователь с таким именем уже существует
          </div>
        </div>

        <!-- PASSWORD -->
        <label>
          Пароль
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            required
            minlength="6"
            #passwordCtrl="ngModel"
          />
        </label>

        <div class="validation"
          *ngIf="passwordCtrl.invalid && (passwordCtrl.touched || form.submitted)">
          <div *ngIf="passwordCtrl.errors?.['required']">
            Пароль обязателен
          </div>
          <div *ngIf="passwordCtrl.errors?.['minlength']">
            Минимум 6 символов
          </div>
        </div>

        <button
          type="submit"
          [disabled]="loading || usernameExists">
          Создать аккаунт
        </button>

        <p class="hint">
          Уже есть аккаунт?
          <a routerLink="/login">Войти</a>
        </p>

      </form>

    </app-auth-layout>
  `,
  styles: [`
    .validation {
      margin: -0.5rem 0 0.9rem;
      font-size: 0.85rem;
      color: #dc2626;
    }

    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {

  fullName = '';
  username = '';
  password = '';

  loading = false;
  usernameExists = false;

  usernameChanges = new Subject<string>();
  private subs = new Subscription();

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.usernameChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(username =>
          username.length >= 3
            ? this.auth.checkUsernameExists(username)
            : of(false)
        )
      ).subscribe(exists => {
        this.usernameExists = exists;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  register(form: NgForm): void {
    if (form.invalid || this.usernameExists) return;

    this.loading = true;

    this.auth.register(this.username, this.fullName, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: err => {
          this.loading = false;

          const msg = err?.error?.message?.toLowerCase() || '';
          if (msg.includes('username')) {
            this.usernameExists = true;
          }
        }
      });
  }
}
