import { Injectable } from '@angular/core';

export type SurveyId = 'burnout' | 'stress' | 'work-life';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly DRAFT_KEY = 'wellbeing-surveys-draft';

  private read(): Record<string, any> {
    const raw = localStorage.getItem(this.DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private write(data: Record<string, any>): void {
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(data));
  }

  saveDraft(id: SurveyId, data: unknown, username: string): void {
    const drafts = this.read();

    if (!drafts[username]) {
      drafts[username] = {};
    }

    drafts[username][id] = {
      data,
      updatedAt: new Date().toISOString()
    };

    this.write(drafts);
  }

  loadDraft<T>(id: SurveyId, username: string): T | null {
    return this.read()[username]?.[id]?.data ?? null;
  }

  clearDraft(id: SurveyId, username: string): void {
    const drafts = this.read();
    delete drafts[username]?.[id];
    this.write(drafts);
  }
}
