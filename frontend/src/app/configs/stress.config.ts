import { SurveyConfig } from '../shared/models/survey-config.model';

export const stressConfig: SurveyConfig = {
  title: 'Оценка уровня стресса',
  sections: [
    {
      title: 'Психологический стресс',
      fields: [
        {
          type: 'star-rating',
          label: 'Общий уровень тревожности',
          name: 'anxiety',
          required: true,
          help: '1 — полностью спокоен, 5 — постоянная тревога'
        },
        {
          type: 'star-rating',
          label: 'Навязчивые мысли о работе',
          name: 'intrusiveThoughts',
          required: true,
          help: 'Насколько трудно перестать думать о рабочих задачах'
        },
        {
          type: 'star-rating',
          label: 'Раздражительность в повседневных ситуациях',
          name: 'irritability',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Чувство эмоционального напряжения',
          name: 'tension',
          required: true
        }
      ]
    },
    {
      title: 'Физические симптомы',
      fields: [
        {
          type: 'range',
          label: 'Общий уровень физического напряжения',
          name: 'physicalStress',
          min: 0,
          max: 10,
          help: '0 — тело полностью расслаблено, 10 — постоянное напряжение'
        },
        {
          type: 'star-rating',
          label: 'Проблемы со сном',
          name: 'sleepIssues',
          required: true,
          help: 'Сложности с засыпанием или частые пробуждения'
        },
        {
          type: 'star-rating',
          label: 'Головные боли или мышечное напряжение',
          name: 'somaticPain',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Общая утомляемость в течение дня',
          name: 'daytimeFatigue',
          required: true
        }
      ]
    },
    {
      title: 'Когнитивная нагрузка',
      fields: [
        {
          type: 'star-rating',
          label: 'Сложность концентрации внимания',
          name: 'concentrationDifficulty',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Чувство перегруженности информацией',
          name: 'informationOverload',
          required: true
        }
      ]
    },
    {
      title: 'Преодоление и восстановление',
      fields: [
        {
          type: 'star-rating',
          label: 'Способность справляться со стрессом',
          name: 'coping',
          required: true,
          help: 'Насколько эффективно вы справляетесь со стрессовыми ситуациями'
        },
        {
          type: 'star-rating',
          label: 'Наличие времени для восстановления',
          name: 'recoveryTime',
          required: true
        },

      ]
    }
  ]
};
