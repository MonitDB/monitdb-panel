import faker from 'faker'

export const options = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend: { display: false },
  },
}

export const GB_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: function (value) {
          return value + 'GB'
        },
      },
    },
  },
}

export const KB_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: function (value) {
          return value + 'kb'
        },
      },
    },
  },
}

export const MS_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: function (value) {
          return value + 'ms'
        },
      },
    },
  },
}

export const MB_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: function (value) {
          return value + ' MB/s'
        },
      },
    },
  },
}

export const S_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: {
        callback: function (value) {
          return value + ' s/s'
        },
      },
    },
  },
}

export const PERCENTE_OPTIONS = {
  ...options,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      // grid: { display: false },
      ticks: {
        callback: function (value) {
          return value + '%'
        },
      },
    },
  },
}

export const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

export const GB_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      label: 'Dataset 1',
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 40, precision: 10 })
      ),
      borderColor: 'rgb(80, 70, 229)',
      backgroundColor: 'rgba(80, 70, 229, 0.5)',
    },
  ],
}

export const KB_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      label: 'Dataset 1',
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 40, precision: 10 })
      ),
      borderColor: 'rgb(80, 70, 229)',
      backgroundColor: 'rgba(80, 70, 229, 0.5)',
    },
  ],
}

export const MS_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      label: 'Dataset 1',
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 40, precision: 10 })
      ),
      borderColor: 'rgb(80, 70, 229)',
      backgroundColor: 'rgba(80, 70, 229, 0.5)',
    },
  ],
}

export const MB_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: 'rgb(140, 216, 141)',
      backgroundColor: 'rgba(140, 216, 141, 0.5)',
    },
  ],
}

export const S_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: 'rgb(252, 144, 3)',
      backgroundColor: 'rgba(252, 144, 3, 0.5)',
    },
  ],
}

export const PERCENTE_DATA = {
  labels,
  datasets: [
    {
      fill: 'start',
      label: 'Dataset 1',
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 100, precision: 10 })
      ),
      borderColor: 'rgb(80, 70, 229)',
      backgroundColor: 'rgba(80, 70, 229, 0.5)',
    },
  ],
}
