import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentalHealthStore } from '../../store/mental-health.store';
import { TranslateRiskPipe } from '../../shared/pipes/translate-risk.pipe';

@Component({
  standalone: true,
  selector: 'app-results',
  imports: [CommonModule, TranslateRiskPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">

      <header class="header">
        <h1>Ваши результаты</h1>
        <p class="subtitle">
         Обзор личного психического благополучия
        </p>

        <small *ngIf="store.lastUpdated()">
  Обновлено: {{ store.lastUpdated() | date:'short' }}
        </small>
      </header>

      <main *ngIf="!store.loading(); else loading">

        <article
          *ngFor="let item of store.results()"
          class="card"
          [attr.data-risk]="item.risk"
        >
          <h2>{{ item.title }}</h2>
          <div class="metrics">
            <div>
              <span>Средний балл</span>
              <strong>{{ item.average }}</strong>
            </div>

            <div>
              <span>Уровень риска</span>
              <strong class="risk">
                {{ item.risk | translateRisk }}
              </strong>
            </div>
          </div>

          <div class="recommendations">
            <h4>Рекомендации</h4>
            <ul>
              <li *ngFor="let rec of item.recommendations">
                {{ rec }}
              </li>
            </ul>
          </div>

        </article>

        <p *ngIf="!store.results().length" class="empty">
          No completed surveys yet
        </p>

      </main>

      <ng-template #loading>
        <p class="loading">Loading results…</p>
      </ng-template>

    </div>
  `,
  styles: [`
    .page {
      padding: 2.5rem;
      background: #f8faf9;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 0.3rem;
    }

    .card {
      background: white;
      border-radius: 14px;
      padding: 1.6rem;
      margin-bottom: 1.6rem;
      border-left: 6px solid transparent;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }

    .card[data-risk="low"] {
      border-color: #16a34a;
    }

    .card[data-risk="medium"] {
      border-color: #f59e0b;
    }

    .card[data-risk="high"] {
      border-color: #dc2626;
    }

    .metrics {
      display: flex;
      gap: 2.5rem;
      margin: 1rem 0;
      font-size: 0.95rem;
    }

    .metrics span {
      display: block;
      color: #6b7280;
    }

    .risk {
      font-weight: 600;
    }

    .answers {
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .answers h4,
    .recommendations h4 {
      margin: 0 0 0.6rem;
      font-size: 0.9rem;
      color: #374151;
    }

    .answer {
      display: flex;
      justify-content: space-between;
      padding: 0.35rem 0;
      font-size: 0.9rem;
    }

    .answer .question {
      color: #6b7280;
    }

    .answer .value {
      font-weight: 600;
    }

    .recommendations {
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .empty,
    .loading {
      color: #6b7280;
      font-style: italic;
    }
  `]
})
export class ResultsComponent implements OnInit, OnDestroy {

  constructor(public store: MentalHealthStore) { }

  ngOnInit(): void {
    this.store.refresh();
    this.store.startAutoRefresh(15000);
  }

  ngOnDestroy(): void {
    this.store.stopAutoRefresh();
  }
}
