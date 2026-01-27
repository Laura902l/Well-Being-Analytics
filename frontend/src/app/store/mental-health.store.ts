import { Injectable, signal, computed } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SurveyApiService, SurveyDoc } from '../shared/services/survey-api.service';
import {
  calculateAverage,
  getRiskLevel,
  getRecommendations,
  RiskLevel
} from '../shared/utils/survey-analysis.util';
import { AuthService } from '../shared/services/auth.service';

export interface ResultView {
  userId: string;
  username: string;
  surveyId: string;
  title: string;
  average: number;
  risk: RiskLevel;
  recommendations: string[];
  answers: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class MentalHealthStore {

  private _surveys = signal<SurveyDoc[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _updatedAt = signal<Date | null>(null);

  private refreshSub?: Subscription;

  constructor(
    private api: SurveyApiService,
    private auth: AuthService
  ) {}

  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly lastUpdated = computed(() => this._updatedAt());


  readonly results = computed<ResultView[]>(() =>
    this._surveys().map(doc => {
      const values = Object.values(doc.data)
        .map(v => Number(v))
        .filter(v => !isNaN(v));

      const average = values.length
        ? calculateAverage(values)
        : 0;

      const risk = getRiskLevel(average);

      return {
              userId: doc.userId,
      username: doc.username ?? 'Unknown user',

        surveyId: doc.surveyId,
        title: this.getTitle(doc.surveyId),
        average,
        risk,
        recommendations: getRecommendations(doc.surveyId, risk),
        answers: doc.data
      };
    })
  );


  readonly avgStress = computed(() => {
    const values = this.getAveragesBySurvey('stress');
    return values.length ? calculateAverage(values) : 0;
  });

  readonly avgBurnout = computed(() => {
    const values = this.getAveragesBySurvey('burnout');
    return values.length ? calculateAverage(values) : 0;
  });

  readonly avgWorkBalance = computed(() => {
    const values = this.getAveragesBySurvey('work-life');
    return values.length ? calculateAverage(values) : 0;
  });

  readonly highRiskCount = computed(() =>
    this.results().filter(r => r.risk === 'high').length
  );

  refresh(): void {
    this._loading.set(true);

    if (this.auth.role() === 'admin') {
      this.api.loadAllForAdmin().subscribe({
        next: docs => this.setData(docs),
        error: () => this.fail()
      });
      return;
    }

    const userId = this.auth.userId();
    if (!userId) {
      this.fail();
      return;
    }

    this.api.loadAll(userId).subscribe({
      next: docs => this.setData(docs),
      error: () => this.fail()
    });
  }

  startAutoRefresh(intervalMs = 15000): void {
    if (this.refreshSub) return;

    this.refreshSub = interval(intervalMs).subscribe(() => {
      this.refresh();
    });
  }

  stopAutoRefresh(): void {
    this.refreshSub?.unsubscribe();
    this.refreshSub = undefined;
  }

  private setData(docs: SurveyDoc[]): void {
    this._surveys.set(docs);
    this._updatedAt.set(new Date());
    this._loading.set(false);
    this._error.set(null);
  }

  private fail(): void {
    this._loading.set(false);
    this._error.set('Failed to load data');
  }

  private getAveragesBySurvey(id: string): number[] {
    return this.results()
      .filter(r => r.surveyId === id)
      .map(r => r.average);
  }

  private getTitle(id: string): string {
    switch (id) {
      case 'burnout': return 'Burnout';
      case 'stress': return 'Stress';
      case 'work-life': return 'Work–Life Balance';
      default: return id;
    }
  }
}

