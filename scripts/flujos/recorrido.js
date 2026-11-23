import { group } from 'k6';
import { Rate } from 'k6/metrics';
import { autenticarUsuario } from './autenticacion.js';
import { buscarProducto } from './catalogo.js';
import { completarCompra } from './compra.js';
import { pausaUsuario } from './pausas.js';

const exitoRecorrido = new Rate('recorrido_ok');

export function ejecutarRecorrido({ recorrido, usuario }) {
  let recorridoCompletado = false;
  try {
    const producto = group('catálogo y búsqueda', () => buscarProducto(recorrido));
    if (!producto) return;

    pausaUsuario();
    const sesion = group('autenticación', () => autenticarUsuario(usuario));
    if (!sesion) return;

    pausaUsuario();
    recorridoCompletado = group('carrito y compra simulada', () =>
      completarCompra(producto, recorrido.quantity, sesion));
  } finally {
    exitoRecorrido.add(recorridoCompletado);
    pausaUsuario();
  }
}
