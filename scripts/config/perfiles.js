const smoke = {
  executor: 'shared-iterations',
  vus: 1,
  iterations: 2,
  maxDuration: '30s',
};

export const profiles = {
  humo: smoke,
  carga: {
    executor: 'constant-vus',
    vus: 2,
    duration: '36s',
    gracefulStop: '20s',
  },
  pico: {
    executor: 'ramping-vus',
    startVUs: 1,
    stages: [
      { duration: '12s', target: 1 },
      { duration: '2s', target: 3 },
      { duration: '16s', target: 3 },
      { duration: '2s', target: 1 },
      { duration: '12s', target: 1 },
    ],
    gracefulRampDown: '15s',
    gracefulStop: '20s',
  },
  estres: {
    executor: 'ramping-vus',
    startVUs: 2,
    stages: [
      { duration: '2m', target: 10 },
      { duration: '2m', target: 20 },
      { duration: '2m', target: 40 },
      { duration: '2m', target: 40 },
      { duration: '1m', target: 0 },
    ],
    gracefulRampDown: '20s',
    gracefulStop: '20s',
  },
};
