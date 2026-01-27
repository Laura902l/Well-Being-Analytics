import { SurveyConfig } from '../shared/models/survey-config.model';

export const burnoutConfig: SurveyConfig = {
  title: 'Оценка выгорания',
  sections: [
    {
      title: 'Эмоциональное состояние',
      fields: [
        {
          type: 'star-rating',
          label: 'Общий уровень усталости',
          name: 'fatigue',
          required: true,
          help: '1 — чувствую себя отдохнувшим, 5 — крайнее истощение'
        },
        {
          type: 'star-rating',
          label: 'Эмоциональное истощение',
          name: 'emotionalExhaustion',
          required: true,
          help: 'Насколько часто вы чувствуете эмоциональную опустошённость'
        },
        {
          type: 'star-rating',
          label: 'Раздражительность и вспыльчивость',
          name: 'irritability',
          required: true,
          help: 'Насколько легко вы раздражаетесь в рабочей обстановке'
        },
        {
          type: 'star-rating',
          label: 'Чувство тревоги без явной причины',
          name: 'anxiety',
          required: true
        }
      ]
    },
    {
      title: 'Рабочая нагрузка и давление',
      fields: [
        {
          type: 'range',
          label: 'Интенсивность рабочей нагрузки',
          name: 'workload',
          min: 0,
          max: 10,
          help: '0 — минимальная нагрузка, 10 — чрезмерная нагрузка'
        },
        {
          type: 'star-rating',
          label: 'Давление дедлайнов',
          name: 'deadlines',
          required: true,
          help: 'Насколько часто вы ощущаете постоянную спешку'
        },
        {
          type: 'star-rating',
          label: 'Чувство нехватки времени',
          name: 'timePressure',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Невозможность восстановиться между задачами',
          name: 'recoveryIssues',
          required: true
        }
      ]
    },
    {
      title: 'Когнитивное состояние и мотивация',
      fields: [
        {
          type: 'star-rating',
          label: 'Мотивация выполнять рабочие задачи',
          name: 'motivation',
          required: true,
          help: 'Насколько вам хочется вовлекаться в работу'
        },
        {
          type: 'star-rating',
          label: 'Концентрация и ясность мышления',
          name: 'concentration',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Чувство профессиональной эффективности',
          name: 'professionalEfficacy',
          required: true,
          help: 'Ощущение, что ваша работа приносит результат'
        }
      ]
    },
    {
      title: 'Баланс между работой и личной жизнью',
      fields: [
        {
          type: 'star-rating',
          label: 'Баланс между работой и личной жизнью',
          name: 'workLifeBalance',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Качество отдыха и восстановления',
          name: 'restQuality',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Возможность отключаться от работы вне рабочего времени',
          name: 'disconnectAbility',
          required: true
        }
      ]
    },
    {
      title: 'Саморефлексия',
      fields: [
        {
          type: 'textarea',
          label: 'Что в работе сейчас даётся вам сложнее всего?',
          name: 'mainDifficulties'
        },
        {
          type: 'textarea',
          label: 'Что помогло бы вам чувствовать себя лучше на работе?',
          name: 'improvementSuggestions'
        }
      ]
    }
  ]
};
