import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { SurveyConfig } from '../../shared/models/survey-config.model';
import { StorageService, SurveyId } from '../../shared/services/storage.service';
import { SurveyApiService } from '../../shared/services/survey-api.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StarRatingComponent
  ],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <div class="header" *ngIf="config.title">
          <h1>{{ config.title }}</h1>
          <div class="header-underline"></div>
        </div>

        <form [formGroup]="form" (ngSubmit)="handleSubmit()">
          <div *ngFor="let section of config.sections; let i = index" class="section" [style.animation-delay]="i * 0.1 + 's'">
            <div class="section-header">
              <div class="section-number">{{ i + 1 }}</div>
              <h3 class="section-title">{{ section.title }}</h3>
            </div>

            <div class="fields-wrapper">
              <div *ngFor="let field of section.fields" class="field">
                <label class="field-label">
                  {{ field.label }}
                  <span class="required-mark" *ngIf="field.required">*</span>
                </label>
                <small class="field-help" *ngIf="field.help">{{ field.help }}</small>

                <ng-container [ngSwitch]="field.type">

                  <app-star-rating
                    *ngSwitchCase="'star-rating'"
                    [required]="!!field.required"
                    formControlName="{{ field.name }}">
                  </app-star-rating>

                  <div *ngSwitchCase="'range'" class="range-wrapper">
                    <input
                      type="range"
                      formControlName="{{ field.name }}"
                      [min]="field.min ?? 0"
                      [max]="field.max ?? 10"
                      class="range-input">

                    <div class="range-footer">
                      <span class="range-label">{{ field.min ?? 0 }}</span>
                      <div class="range-value">{{ form.get(field.name)?.value }}</div>
                      <span class="range-label">{{ field.max ?? 10 }}</span>
                    </div>
                  </div>

                  <textarea
                    *ngSwitchCase="'textarea'"
                    formControlName="{{ field.name }}"
                    rows="3"
                    class="textarea-input"
                    placeholder="Введите ваш ответ...">
                  </textarea>

                  <div *ngSwitchCase="'checkbox'" class="checkbox-wrapper">
                    <input
                      type="checkbox"
                      formControlName="{{ field.name }}"
                      class="checkbox-input"
                      [id]="field.name">
                    <label [for]="field.name" class="checkbox-label"></label>
                  </div>
                </ng-container>

                <div
                  class="error-message"
                  *ngIf="form.get(field.name)?.touched && form.get(field.name)?.invalid">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 4V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
                  </svg>
                  <span *ngIf="form.get(field.name)?.errors?.['required']">
                    Поле обязательно для заполнения
                  </span>
                  <span *ngIf="form.get(field.name)?.errors?.['min']">
                    Значение меньше допустимого
                  </span>
                  <span *ngIf="form.get(field.name)?.errors?.['max']">
                    Значение больше допустимого
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="actions">
            <button type="button" class="btn btn-secondary" (click)="clearData()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Очистить
            </button>
            <button type="submit" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round"/>
                <polyline points="17 21 17 13 7 13 7 21" stroke-width="2" stroke-linecap="round"/>
                <polyline points="7 3 7 8 15 8" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Сохранить
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8faf9;
      min-height: 100vh;
      padding: 3rem 1rem;
    }

    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem 2.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 1rem 0;
      letter-spacing: -0.5px;
    }

    .header-underline {
      width: 80px;
      height: 4px;
      background: #2a6b5f;
      margin: 0 auto;
      border-radius: 2px;
    }

    .section {
      margin-bottom: 3rem;
      padding: 2rem;
      background: #fafbfc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .section:hover {
      box-shadow: 0 2px 8px rgba(42, 107, 95, 0.08);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .section-number {
      width: 42px;
      height: 42px;
      background: #2a6b5f;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
    }

    .section-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
      letter-spacing: -0.3px;
    }

    .fields-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      font-weight: 600;
      color: #2d3748;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .required-mark {
      color: #e53e3e;
      font-size: 1.1rem;
    }

    .field-help {
      color: #718096;
      font-size: 0.875rem;
      font-style: italic;
      margin-top: -0.25rem;
    }

    textarea.textarea-input {
      width: 100%;
      min-height: 100px;
      padding: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      resize: vertical;
      transition: all 0.3s ease;
      background: white;
    }

    textarea.textarea-input:focus {
      outline: none;
      border-color: #2a6b5f;
      box-shadow: 0 0 0 3px rgba(42, 107, 95, 0.1);
    }

    .range-wrapper {
      padding: 0.5rem 0;
    }

    .range-input {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%);
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .range-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2a6b5f;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(42, 107, 95, 0.3);
    }

    .range-input::-webkit-slider-thumb:hover {
      box-shadow: 0 2px 12px rgba(42, 107, 95, 0.4);
    }

    .range-input::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2a6b5f;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(42, 107, 95, 0.3);
    }

    .range-input::-moz-range-thumb:hover {
      box-shadow: 0 2px 12px rgba(42, 107, 95, 0.4);
    }

    .range-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
      padding: 0 0.25rem;
    }

    .range-label {
      font-size: 0.875rem;
      color: #718096;
      font-weight: 500;
    }

    .range-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2a6b5f;
      min-width: 50px;
      text-align: center;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .checkbox-input {
      width: 24px;
      height: 24px;
      cursor: pointer;
      opacity: 0;
      position: absolute;
    }

    .checkbox-label {
      position: relative;
      width: 24px;
      height: 24px;
      border: 2px solid #cbd5e0;
      border-radius: 6px;
      cursor: pointer;
      background: white;
    }

    .checkbox-input:checked + .checkbox-label {
      background: #2a6b5f;
      border-color: #2a6b5f;
    }

    .checkbox-input:checked + .checkbox-label::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 3px;
      width: 6px;
      height: 12px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-label:hover {
      border-color: #2a6b5f;
      box-shadow: 0 0 0 3px rgba(42, 107, 95, 0.1);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: #fff5f5;
      border-radius: 8px;
      border-left: 3px solid #e53e3e;
    }

    .error-message svg {
      flex-shrink: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #e2e8f0;
    }

    .btn {
      padding: 0.875rem 2rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #2a6b5f;
      color: white;
    }

    .btn-primary:hover {
      background: #236051;
    }

    .btn-secondary {
      background: white;
      color: #2a6b5f;
      border: 2px solid #e2e8f0;
    }

    .btn-secondary:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
    }

    @media (max-width: 640px) {
      :host {
        padding: 1.5rem 0.5rem;
      }

      .container {
        padding: 2rem 1.5rem;
        border-radius: 16px;
      }

      .header h1 {
        font-size: 2rem;
      }

      .section {
        padding: 1.5rem;
      }

      .actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DynamicFormComponent implements OnInit {

  @Input({ required: true }) surveyId!: SurveyId;
  @Input({ required: true }) config!: SurveyConfig;

  form!: FormGroup;
  private username!: string;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private api: SurveyApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const user = this.auth.username();
  const userId = this.auth.userId();

  if (!user || !userId) {
    throw new Error('User not authenticated');
  }

  this.username = user;
  this.form = this.buildForm();

  const draft = this.storage.loadDraft<Record<string, unknown>>(
    this.surveyId,
    this.username
  );

  if (draft) {
    this.form.patchValue(draft);
  } else {
    this.api.loadAll(userId).subscribe(docs => {
      const doc = docs.find(d => d.surveyId === this.surveyId);
      if (doc) {
        this.form.patchValue(doc.data);
      }
    });
  }

  this.form.valueChanges
    .pipe(debounceTime(500))
    .subscribe(value => {
      this.storage.saveDraft(this.surveyId, value, this.username);
    });
}


  private buildForm(): FormGroup {
    const controls: Record<string, any> = {};

    this.config.sections.forEach(section => {
      section.fields.forEach(field => {
        const validators = [];

        if (field.required) validators.push(Validators.required);
        if (field.min !== undefined) validators.push(Validators.min(field.min));
        if (field.max !== undefined) validators.push(Validators.max(field.max));

        controls[field.name] = this.fb.control(
          field.type === 'range' ? field.min ?? 0 : null,
          validators
        );
      });
    });

    return this.fb.group(controls);
  }

handleSubmit(): void {
  this.form.markAllAsTouched();

  if (!this.form.valid) return;

  const userId = this.auth.userId();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  this.api
    .saveSurvey(this.surveyId, this.form.value, userId)
    .subscribe({
      next: () => {
        this.storage.clearDraft(this.surveyId, this.username);
        this.router.navigate(['/results']);
      },
      error: () => {
        alert('Failed to save survey');
      }
    });
}


  clearData(): void {
    this.storage.clearDraft(this.surveyId, this.username);
    this.form.reset();
  }
}
