import { demo } from './scripts/config/entorno.js';
import { profiles } from './scripts/config/perfiles.js';
import { cargarDatos } from './scripts/datos/parametrizacion.js';
import { ejecutarRecorrido } from './scripts/flujos/recorrido.js';

const profile = __ENV.PERFIL || 'humo';
if (!Object.prototype.hasOwnProperty.call(profiles, profile)) {
  throw new Error('PERFIL debe ser humo, carga, pico o estres.');
}
if (profile === 'estres' && (demo || !__ENV.WEB_URL || !__ENV.API_URL)) {
  throw new Error('El perfil estres requiere WEB_URL y API_URL de un entorno propio autorizado.');
}

export const options = {
  scenarios: { [profile]: profiles[profile] },
  tags: {
    perfil: profile,
    objetivo: demo ? 'demo-publica' : 'entorno-propio',
    ...(__ENV.TESTID ? { testid: __ENV.TESTID } : {}),
  },
  systemTags: ['method', 'name', 'status', 'scenario', 'expected_response', 'check', 'group'],
  maxRedirects: 0,
  rps: demo ? 4 : 100,
  summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    recorrido_ok: ['rate>0.99'],
    iterations: ['count>0'],
  },
};

// Las rutas de los JSON se resuelven desde el script de entrada de k6.
const datosDeIteracion = cargarDatos((ruta) => open(ruta));

export default function () {
  ejecutarRecorrido(datosDeIteracion());
}
