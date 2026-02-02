import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MentalHealthStore } from '../../store/mental-health.store';

type SurveyId = 'burnout' | 'stress' | 'work-life';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  store = inject(MentalHealthStore);
  router = inject(Router);

  readonly completed = computed<Record<SurveyId, boolean>>(() => {
    const result: Record<SurveyId, boolean> = {
      burnout: false,
      stress: false,
      'work-life': false
    };

    for (const r of this.store.results()) {
      if (r.surveyId in result) {
        result[r.surveyId as SurveyId] = true;
      }
    }

    return result;
  });

  constructor() {
    this.store.refresh();
  }

  open(id: SurveyId): void {
    this.router.navigate(['/survey', id]);
  }
}

// import { Component, computed, inject, signal, effect } from '@angular/core';
// import { Router } from '@angular/router';
// import { MentalHealthStore } from '../../store/mental-health.store';

// type SurveyId = 'burnout' | 'stress' | 'work-life';

// @Component({
//   selector: 'app-main',
//   standalone: true,
//   templateUrl: './main.component.html',
//   styleUrls: ['./main.component.scss']
// })
// export class MainComponent {

//   store = inject(MentalHealthStore);
//   router = inject(Router);

//   loading = signal(true);

//   readonly completed = computed<Record<SurveyId, boolean>>(() => {
//     const result: Record<SurveyId, boolean> = {
//       burnout: false,
//       stress: false,
//       'work-life': false
//     };

//     for (const r of this.store.results()) {
//       if (r.surveyId in result) {
//         result[r.surveyId as SurveyId] = true;
//       }
//     }

//     return result;
//   });

//   constructor() {
//     this.store.refresh();

//     effect(() => {
//       if (this.store.results()) {
//         this.loading.set(false);
//       }
//     });
//   }

//   open(id: SurveyId): void {
//     this.router.navigate(['/survey', id]);
//   }
// }
