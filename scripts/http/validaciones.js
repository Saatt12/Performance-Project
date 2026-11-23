import { check } from 'k6';

export function validarRespuesta(respuesta, paso, regla, contenidoValido) {
  check(respuesta, { [`${paso} dura menos de 1000 ms`]: (r) => r.timings.duration < 1000 });
  return check(respuesta, {
    [`${paso} devuelve HTTP 200`]: (r) => r.status === 200,
    [regla]: () => contenidoValido,
  });
}
