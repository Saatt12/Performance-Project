import http from 'k6/http';
import exec from 'k6/execution';
import { Counter } from 'k6/metrics';
import { demo } from '../config/entorno.js';

const requestErrors = new Counter('errores_http');
const isHttp200 = http.expectedStatuses(200);

export function solicitar(metodo, base, ruta, nombre, cuerpo = null, cabeceras = {}) {
  const respuesta = http.request(metodo, base + ruta, cuerpo, {
    headers: cabeceras,
    tags: { name: nombre },
    timeout: '6s',
    responseCallback: isHttp200,
  });
  requestErrors.add(respuesta.status === 200 ? 0 : 1);
  if (demo && (respuesta.status === 429 || respuesta.status === 503)) {
    exec.test.abort(`La demo respondió HTTP ${respuesta.status} en ${nombre}.`);
  }
  return respuesta;
}
