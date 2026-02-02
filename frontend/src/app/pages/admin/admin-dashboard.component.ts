import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentalHealthStore } from '../../store/mental-health.store';

type Risk = 'low' | 'medium' | 'high';
type SurveyId = 'burnout' | 'stress' | 'work-life';

interface UserRow {
  username: string;
  surveys: Partial<Record<SurveyId, {
    average: number;
    risk: Risk;
  }>>;
  maxRisk: Risk;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">

      <header class="header">
        <h1>Панель административной аналитики</h1>
        <small *ngIf="store.lastUpdated()">
          Updated {{ store.lastUpdated() | date:'mediumTime' }}
        </small>
      </header>

      <section class="kpis">
        <div class="kpi">
          <span>Avg Stress</span>
          <strong>{{ store.avgStress() | number:'1.1-1' }}</strong>
        </div>

        <div class="kpi">
          <span>Avg Burnout</span>
          <strong>{{ store.avgBurnout() | number:'1.1-1' }}</strong>
        </div>

        <div class="kpi">
          <span>Avg Work–Life</span>
          <strong>{{ store.avgWorkBalance() | number:'1.1-1' }}</strong>
        </div>

        <div class="kpi danger">
          <span>High Risk Areas</span>
          <strong>{{ store.highRiskCount() }}</strong>
        </div>
      </section>

      <section class="charts-grid">
        <div class="chart-container">
          <h3>Average Scores by Category</h3>
          <div class="bar-chart">
            <div class="bar-item">
              <div class="bar-label">Stress</div>
              <div class="bar-wrapper">
                <div
                  class="bar bar-stress"
                  [style.width.%]="(store.avgStress() / 10) * 100"
                >
                  <span class="bar-value">{{ store.avgStress() | number:'1.1-1' }}</span>
                </div>
              </div>
            </div>

            <div class="bar-item">
              <div class="bar-label">Burnout</div>
              <div class="bar-wrapper">
                <div
                  class="bar bar-burnout"
                  [style.width.%]="(store.avgBurnout() / 10) * 100"
                >
                  <span class="bar-value">{{ store.avgBurnout() | number:'1.1-1' }}</span>
                </div>
              </div>
            </div>

            <div class="bar-item">
              <div class="bar-label">Work–Life</div>
              <div class="bar-wrapper">
                <div
                  class="bar bar-worklife"
                  [style.width.%]="(store.avgWorkBalance() / 10) * 100"
                >
                  <span class="bar-value">{{ store.avgWorkBalance() | number:'1.1-1' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h3>Risk Distribution</h3>
          <div class="risk-chart">
            <div class="chart-area">
              <svg viewBox="0 0 300 180" class="line-chart">
                <line x1="40" y1="20" x2="40" y2="140" stroke="#e5e7eb" stroke-width="2"/>
                <line x1="40" y1="140" x2="280" y2="140" stroke="#e5e7eb" stroke-width="2"/>

                <rect
                  x="70"
                  [attr.y]="140 - (riskDistribution()[0].count / maxRiskCount() * 120)"
                  width="50"
                  [attr.height]="riskDistribution()[0].count / maxRiskCount() * 120"
                  fill="#16a34a"
                  rx="4"
                />
                <rect
                  x="140"
                  [attr.y]="140 - (riskDistribution()[1].count / maxRiskCount() * 120)"
                  width="50"
                  [attr.height]="riskDistribution()[1].count / maxRiskCount() * 120"
                  fill="#f59e0b"
                  rx="4"
                />
                <rect
                  x="210"
                  [attr.y]="140 - (riskDistribution()[2].count / maxRiskCount() * 120)"
                  width="50"
                  [attr.height]="riskDistribution()[2].count / maxRiskCount() * 120"
                  fill="#dc2626"
                  rx="4"
                />

                <text x="95" [attr.y]="140 - (riskDistribution()[0].count / maxRiskCount() * 120) - 8" text-anchor="middle" class="bar-value">{{ riskDistribution()[0].count }}</text>
                <text x="165" [attr.y]="140 - (riskDistribution()[1].count / maxRiskCount() * 120) - 8" text-anchor="middle" class="bar-value">{{ riskDistribution()[1].count }}</text>
                <text x="235" [attr.y]="140 - (riskDistribution()[2].count / maxRiskCount() * 120) - 8" text-anchor="middle" class="bar-value">{{ riskDistribution()[2].count }}</text>

                <text x="95" y="160" text-anchor="middle" class="axis-label">Low</text>
                <text x="165" y="160" text-anchor="middle" class="axis-label">Medium</text>
                <text x="235" y="160" text-anchor="middle" class="axis-label">High</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section class="filters">
        <input
          type="text"
          placeholder="Search by username"
          (input)="onSearch($any($event.target).value)"
        />

        <select (change)="riskFilter.set($any($event.target).value)">
          <option value="all">All risks</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </section>

      <section class="table">
        <h3>Индивидуальные результаты</h3>

        <table *ngIf="userTable().length">
          <thead>
            <tr>
              <th>User</th>
              <th>Burnout</th>
              <th>Stress</th>
              <th>Work–Life</th>
              <th>Overall risk</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let u of userTable()">
              <td class="username">{{ u.username }}</td>

              <td>
                <ng-container *ngIf="u.surveys.burnout; else empty">
                  <span class="pill" [class]="u.surveys.burnout.risk">
                    {{ u.surveys.burnout.average }}
                  </span>
                </ng-container>
              </td>

              <td>
                <ng-container *ngIf="u.surveys.stress; else empty">
                  <span class="pill" [class]="u.surveys.stress.risk">
                    {{ u.surveys.stress.average }}
                  </span>
                </ng-container>
              </td>

              <td>
                <ng-container *ngIf="u.surveys['work-life']; else empty">
                  <span class="pill" [class]="u.surveys['work-life'].risk">
                    {{ u.surveys['work-life'].average }}
                  </span>
                </ng-container>
              </td>

              <td>
                <span class="pill" [class]="u.maxRisk">
                  {{ u.maxRisk }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <p *ngIf="!userTable().length" class="empty">
          No data found
        </p>

        <ng-template #empty>
          <span class="muted">—</span>
        </ng-template>
      </section>

      <p *ngIf="store.loading()" class="loading">Loading…</p>
      <p *ngIf="store.error()" class="error">{{ store.error() }}</p>

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

    /* KPI */
    .kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .kpi {
      background: white;
      padding: 1.3rem;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .kpi strong {
      font-size: 1.9rem;
    }

    .kpi.danger strong {
      color: #dc2626;
    }

    /* CHARTS */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-container {
      background: white;
      border-radius: 14px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .chart-container h3 {
      margin: 0 0 4.5rem 0;
      font-size: 1.1rem;
    }

    /* BAR CHART */
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .bar-item {
      display: grid;
      grid-template-columns: 100px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .bar-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #374151;
    }

    .bar-wrapper {
      background: #f3f4f6;
      border-radius: 8px;
      height: 32px;
      position: relative;
      overflow: hidden;
    }

    .bar {
      height: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.6rem;
      transition: width 0.5s ease;
      min-width: 45px;
    }

    .bar-value {
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .bar-stress { background: linear-gradient(90deg, #3b82f6, #2563eb); }
    .bar-burnout { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .bar-worklife { background: linear-gradient(90deg, #10b981, #059669); }

    /* RISK DISTRIBUTION CHART */
    .risk-chart {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chart-area {
      width: 100%;
      max-width: 400px;
    }

    .line-chart {
      width: 100%;
      height: auto;
    }

    .line-chart rect {
      transition: height 0.6s ease, y 0.6s ease;
    }

    .bar-value {
      font-size: 14px;
      font-weight: 700;
      fill: #1f2937;
    }

    .axis-label {
      font-size: 12px;
      fill: #6b7280;
      font-weight: 500;
    }

    /* FILTERS */
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filters input,
    .filters select {
      padding: 0.55rem 0.7rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      font-size: 0.9rem;
    }

    /* TABLE */
    .table {
      background: white;
      border-radius: 14px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    th, td {
      padding: 0.7rem;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      vertical-align: middle;
    }

    th {
      font-size: 0.85rem;
      color: #6b7280;
    }

    .username {
      font-weight: 600;
    }

    .pill {
      padding: 0.3rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      color: white;
      font-weight: 600;
    }

    .pill.low { background: #16a34a; }
    .pill.medium { background: #f59e0b; }
    .pill.high { background: #dc2626; }

    .muted {
      color: #9ca3af;
    }

    .loading,
    .empty {
      margin-top: 1rem;
      color: #6b7280;
      font-style: italic;
    }

    .error {
      margin-top: 1rem;
      color: #dc2626;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }

      .pie-chart-wrapper {
        flex-direction: column;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  store = inject(MentalHealthStore);

  search = signal('');
  riskFilter = signal<'all' | Risk>('all');

  private searchTimer?: number;

  userTable = computed<UserRow[]>(() => {
    const q = this.search().toLowerCase();
    const risk = this.riskFilter();

    const map = new Map<string, UserRow>();

    for (const r of this.store.results()) {

      if (
        q &&
        !r.username.toLowerCase().includes(q) &&
        !r.title.toLowerCase().includes(q)
      ) continue;

      if (risk !== 'all' && r.risk !== risk) continue;

      if (!map.has(r.username)) {
        map.set(r.username, {
          username: r.username,
          surveys: {},
          maxRisk: 'low'
        });
      }

      const row = map.get(r.username)!;

      row.surveys[r.surveyId as SurveyId] = {
        average: r.average,
        risk: r.risk
      };

      if (
        r.risk === 'high' ||
        (r.risk === 'medium' && row.maxRisk === 'low')
      ) {
        row.maxRisk = r.risk;
      }
    }

    return Array.from(map.values());
  });

  totalUsers = computed(() => this.userTable().length);

  riskDistribution = computed(() => {
    const users = this.userTable();
    const dist = { low: 0, medium: 0, high: 0 };

    users.forEach(u => dist[u.maxRisk]++);

    const total = users.length || 1;

    return [
      {
        label: 'Low',
        count: dist.low,
        percentage: Math.round((dist.low / total) * 100),
        color: '#16a34a'
      },
      {
        label: 'Medium',
        count: dist.medium,
        percentage: Math.round((dist.medium / total) * 100),
        color: '#f59e0b'
      },
      {
        label: 'High',
        count: dist.high,
        percentage: Math.round((dist.high / total) * 100),
        color: '#dc2626'
      }
    ];
  });

  maxRiskCount = computed(() => {
    const counts = this.riskDistribution().map(d => d.count);
    return Math.max(...counts, 1);
  });

  ngOnInit(): void {
    this.store.refresh();
    this.store.startAutoRefresh(3000);
  }

  ngOnDestroy(): void {
    this.store.stopAutoRefresh();
  }

  onSearch(value: string) {
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.search.set(value);
    }, 300);
  }
}
