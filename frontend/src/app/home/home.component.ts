// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router, RouterModule } from '@angular/router';
// // import { SurveyApiService } from '../shared/services/survey-api.service';
// // import { AuthService } from '../shared/services/auth.service';

// // @Component({
// //   selector: 'app-home',
// //   standalone: true,
// //   imports: [CommonModule, RouterModule],
// //   templateUrl: './home.component.html',
// //   styleUrls: ['./home.component.scss']
// // })
// // export class HomeComponent implements OnInit {

// //   completed: Record<'burnout' | 'stress' | 'work-life', boolean> = {
// //     burnout: false,
// //     stress: false,
// //     'work-life': false
// //   };

// //   constructor(
// //     private router: Router,
// //     private api: SurveyApiService,
// //     private auth: AuthService
// //   ) {}

// //   ngOnInit(): void {
// //     const userId = this.auth.userId();

// //     if (!userId) {
// //       return;
// //     }

// //     this.api.loadAll(userId).subscribe({
// //       next: surveys => {
// //         surveys.forEach(s => {
// //           this.completed[s.surveyId] = true;
// //         });
// //       },
// //       error: () => {
// //         console.error('Failed to load surveys');
// //       }
// //     });
// //   }

// //   open(id: 'burnout' | 'stress' | 'work-life'): void {
// //     this.router.navigate(['/survey', id]);
// //   }
// // }


// import { Component, OnInit, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { MentalHealthStore } from '../store/mental-health.store';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent implements OnInit {

//   store = inject(MentalHealthStore);
//   router = inject(Router);

//   completed: Record<'burnout' | 'stress' | 'work-life', boolean> = {
//     burnout: false,
//     stress: false,
//     'work-life': false
//   };

//   ngOnInit(): void {
//     this.store.refresh();

//     this.store.results().forEach(r => {
//       this.completed[r.surveyId as 'burnout' | 'stress' | 'work-life'] = true;
//     });
//   }

//   open(id: 'burnout' | 'stress' | 'work-life'): void {
//     this.router.navigate(['/survey', id]);
//   }
// }


import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MentalHealthStore } from '../store/mental-health.store';

type SurveyId = 'burnout' | 'stress' | 'work-life';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

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
