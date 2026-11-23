import { api } from '../config/entorno.js';
import { campoJson } from '../datos/correlacion.js';
import { solicitar } from '../http/clienteHttp.js';
import { validarRespuesta } from '../http/validaciones.js';
import { pausaUsuario } from './pausas.js';

export function completarCompra(producto, cantidad, sesion) {
  const cabeceras = { 'Content-Type': 'application/json', Authorization: sesion.token };
  // Se envía el producto encontrado con la cantidad elegida para este recorrido.
  const payload = JSON.stringify({ sessionId: sesion.sessionId, cart: [{ ...producto, quantity: cantidad }] });
  const respuestaCarrito = solicitar('POST', api, '/cart', 'carrito', payload, cabeceras);
  if (!validarRespuesta(respuestaCarrito, 'carrito', 'la API confirma el carrito', campoJson(respuestaCarrito, 'message') === 'Cart updated')) {
    return false;
  }

  pausaUsuario();
  const respuestaCheckout = solicitar('POST', api, '/checkout', 'checkout', payload, cabeceras);
  return validarRespuesta(respuestaCheckout, 'checkout', 'la API confirma la compra simulada y devuelve la orden',
    campoJson(respuestaCheckout, 'message') === 'Checkout completed' && Boolean(campoJson(respuestaCheckout, 'order')));
}
