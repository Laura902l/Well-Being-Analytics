import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="star-container" [class.disabled]="disabled">
      <span *ngFor="let n of [1,2,3,4,5]; let i = index"
            (click)="onStarClick(i + 1)"
            (mouseenter)="hover = i + 1"
            (mouseleave)="hover = 0"
            [class.active]="(hover || value) >= (i + 1)"
            class="star">★</span>
    </div>

    <div *ngIf="required && value === 0 && touched" class="error-message">
      Это поле обязательно
    </div>
  `,
  styles: [`
    .star-container {
      font-size: 2.2rem;
      color: #e0e0e0;
      user-select: none;
    }
    .star {
      cursor: pointer;
      transition: color 0.15s;
    }
    .star.active {
      color: #ffb400;
    }
    .disabled .star {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .error-message {
      color: #e63946;
      font-size: 0.85rem;
      margin-top: 6px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    },

  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => StarRatingComponent),
    multi: true
  }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() required: boolean | undefined = false;

  value = 0;
  hover = 0;
  disabled = false;
  touched = false;

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  onStarClick(rating: number) {
    if (this.disabled) return;
    this.value = rating;
    this.onChange(rating);
    this.onTouched();
    this.touched = true;
  }

  writeValue(obj: number | null | undefined): void {
    this.value = obj ?? 0;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
  if ((this.required ?? false) && this.value === 0) {
    return { required: true };
  }
  return null;
}
}
