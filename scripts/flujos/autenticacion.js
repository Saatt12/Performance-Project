import { api } from '../config/entorno.js';
import { extraerIdentificador } from '../datos/correlacion.js';
import { solicitar } from '../http/clienteHttp.js';
import { validarRespuesta } from '../http/validaciones.js';

export function autenticarUsuario(usuario) {
  const respuestaSesion = solicitar('GET', api, '/session', 'sesion');
  const sessionId = extraerIdentificador(respuestaSesion, 'sessionId');
  if (!validarRespuesta(respuestaSesion, 'sesión', 'la API entrega un identificador de sesión', Boolean(sessionId))) {
    return undefined;
  }

  const respuestaLogin = solicitar('POST', api, '/login', 'login', {
    username: usuario.username,
    password: usuario.password,
  });
  // El login entrega el token. La sesión del carrito se obtiene en /session.
  const token = extraerIdentificador(respuestaLogin, 'accessToken');
  return validarRespuesta(respuestaLogin, 'login', 'login entrega un token de acceso', Boolean(token))
    ? { token, sessionId } : undefined;
}
