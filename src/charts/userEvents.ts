import Chart from 'chart.js';

import { Colors } from '@/charts/common';

import { TimedEvent } from '@/core/transform';
import { secToTime } from '@/core/format';

interface ChartDataExt extends Chart.ChartData {
  name?: string;
  value?: string;
}

interface UserEvents {
  [x: string]: TimedEvent[];
}

interface EventColor {
  [key: string]: string;
}

const EVENT_COLOR: EventColor = {
  navigate: Colors.BLUE,
  data: Colors.GREEN,
  ui: Colors.RED,
  clicks: Colors.LIGHT_BLUE,
  scrolls: Colors.ORANGE,
  instruction: Colors.BLUE,
  drawing: Colors.GREEN,
  sphere: Colors.RED,
  cross: Colors.CYAN,
};

export default function userEvents(
  el: HTMLCanvasElement,
  events: UserEvents,
) {
  const datasets: Chart.ChartDataSets[] = [];

  let index = 0;
  for (const key in events ) {
    const data = events[ key ];
    if (!data || data.length === 0) {
      continue;
    }

    datasets.push({
      label: key,
      pointRadius: 7,
      pointHoverRadius: 9,
      showLine: false,
      data: data.map( item => { return {
        x: item.timestamp / 1000,
        y: index + 1,
        name: item.name,
        value: item.value,
      }; }),
      backgroundColor: EVENT_COLOR[ key ],
    });

    index++;
  }

  return new Chart( el, {
    type: 'scatter',
    data: {
      labels: (datasets[0].data as Chart.ChartPoint[]).map( _ => '' ),
      datasets,
    },
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const dataset = data.datasets![ tooltipItem.datasetIndex || 0 ];
            const values = dataset.data as ChartDataExt[];
            const { name, value } = values[ tooltipItem.index || 0 ];
            const nameStr = name ? ` "${name}"` : '';
            const valStr = value !== undefined ? ` = [${value}]` : '';
            return `${dataset.label}:${nameStr}${valStr}, ${secToTime( +tooltipItem.label! )}`;
          },
        },
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            callback: value => secToTime( value ),
          },
        }],
        yAxes: [{
          ticks: {
            min: 0.5,
            max: index + 0.5,
            stepSize: 1,
            callback: value => datasets[ value - 1 ] ? datasets[ value - 1 ].label! : '',
          },
        }],
      },
    },
  });
}
