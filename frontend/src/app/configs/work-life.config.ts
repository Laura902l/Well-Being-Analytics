import { SurveyConfig } from '../shared/models/survey-config.model';

export const workLifeConfig: SurveyConfig = {
  title: 'Оценка баланса между работой и личной жизнью',
  sections: [
    {
      title: 'Структура работы',
      fields: [
        {
          type: 'range',
          label: 'Среднее количество рабочих часов в день',
          name: 'workHours',
          min: 0,
          max: 16,
          help: 'Учитывайте реальную продолжительность рабочего дня'
        },
        {
          type: 'star-rating',
          label: 'Удовлетворённость текущей рабочей нагрузкой',
          name: 'workSatisfaction',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Гибкость рабочего графика',
          name: 'scheduleFlexibility',
          required: true,
          help: 'Возможность управлять своим рабочим временем'
        }
      ]
    },
    {
      title: 'Личное время и отдых',
      fields: [
        {
          type: 'star-rating',
          label: 'Наличие времени для себя в будние дни',
          name: 'personalTime',
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
          label: 'Возможность полноценно отдыхать в выходные',
          name: 'weekendRecovery',
          required: true
        }
      ]
    },
    {
      title: 'Границы между работой и личной жизнью',
      fields: [
        {
          type: 'star-rating',
          label: 'Способность отключаться от работы вне рабочего времени',
          name: 'disconnectAbility',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Частота рабочих контактов в нерабочее время',
          name: 'afterHoursWork',
          required: true,
          help: 'Сообщения, звонки или задачи после окончания рабочего дня'
        }
      ]
    },
    {
      title: 'Общее равновесие и благополучие',
      fields: [
        {
          type: 'star-rating',
          label: 'Общий баланс между работой и личной жизнью',
          name: 'balance',
          required: true
        },
        {
          type: 'star-rating',
          label: 'Влияние работы на личное благополучие',
          name: 'workImpact',
          required: true
        },
        {
          type: 'textarea',
          label: 'Что могло бы улучшить ваш баланс между работой и личной жизнью?',
          name: 'improvementSuggestions'
        }
      ]
    }
  ]
};
