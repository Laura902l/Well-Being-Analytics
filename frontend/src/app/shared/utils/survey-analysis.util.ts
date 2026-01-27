// shared/utils/survey-analysis.util.ts
export type RiskLevel = 'low' | 'medium' | 'high';

export function calculateAverage(values: number[]): number {
  return Math.round(
    values.reduce((a, b) => a + b, 0) / values.length
  );
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 2) return 'low';
  if (score <= 3.5) return 'medium';
  return 'high';
}

export function getRecommendations(type: string, level: RiskLevel): string[] {
  const base = {
    low: [
      'Текущее состояние выглядит стабильным.',
      'Рекомендуется сохранять существующий режим.'
    ],
    medium: [
      'Обратите внимание на признаки перегрузки.',
      'Рекомендуется планировать регулярный отдых.'
    ],
    high: [
      'Высокий уровень риска.',
      'Рекомендуется обсудить нагрузку с руководителем.',
      'Рассмотрите консультацию со специалистом.'
    ]
  };

  if (type === 'burnout' && level === 'high') {
    return [
      ...base.high,
      'Снизьте количество задач с жёсткими дедлайнами.',
      'Включите восстановительные паузы в рабочий день.'
    ];
  }

  if (type === 'stress' && level === 'high') {
    return [
      ...base.high,
      'Практики дыхания и восстановления сна могут помочь.',
      'Ограничьте информационную перегрузку.'
    ];
  }

  if (type === 'work-life' && level === 'high') {
    return [
      ...base.high,
      'Рассмотрите гибкий график.',
      'Установите чёткие границы рабочего времени.'
    ];
  }

  return base[level];
}
