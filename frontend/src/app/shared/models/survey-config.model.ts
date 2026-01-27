export type FieldType = 'star-rating' | 'range' | 'textarea' | 'checkbox';

export interface FieldConfig {
  readonly type: FieldType;
  readonly label: string;
  readonly name: string;
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly help?: string;
}

export interface Section {
  readonly title: string;
  readonly fields: readonly FieldConfig[];
}

export interface SurveyConfig {
  readonly title?: string;
  readonly sections: readonly Section[];
}
