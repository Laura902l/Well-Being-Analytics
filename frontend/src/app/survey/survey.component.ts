import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { burnoutConfig } from '../configs/burnout.config';
import { stressConfig } from '../configs/stress.config';
import { workLifeConfig } from '../configs/work-life.config';
import { DynamicFormComponent } from '../pages/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <app-dynamic-form
      [surveyId]="surveyId"
      [config]="config">
    </app-dynamic-form>
  `
})
export class SurveyComponent implements OnInit {

  surveyId!: 'burnout' | 'stress' | 'work-life';
  config!: any;

  ngOnInit(): void {
    this.surveyId =
      this.route.snapshot.paramMap.get('id') as
      'burnout' | 'stress' | 'work-life';

    switch (this.surveyId) {
      case 'burnout':
        this.config = burnoutConfig;
        break;
      case 'stress':
        this.config = stressConfig;
        break;
      case 'work-life':
        this.config = workLifeConfig;
        break;
    }
  }

  constructor(private route: ActivatedRoute) {}
}
