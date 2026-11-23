import { api, web } from '../config/entorno.js';
import { extraerProducto, campoJson } from '../datos/correlacion.js';
import { solicitar } from '../http/clienteHttp.js';
import { validarRespuesta } from '../http/validaciones.js';
import { pausaUsuario } from './pausas.js';

export function buscarProducto(recorrido) {
  const portada = solicitar('GET', web, '/', 'portada');
  if (!validarRespuesta(portada, 'portada', 'HTML contiene el título de la tienda',
    typeof portada.body === 'string' && portada.body.includes('<title>Gatling E-commerce</title>'))) {
    return undefined;
  }

  const catalogo = solicitar('GET', api, `/products?page=${recorrido.page}`, 'catalogo');
  const productos = campoJson(catalogo, 'products');
  if (!validarRespuesta(catalogo, 'catálogo', 'el catálogo contiene productos',
    Array.isArray(productos) && productos.length > 0)) {
    return undefined;
  }

  pausaUsuario();
  const busqueda = solicitar('GET', api, `/products?search=${encodeURIComponent(recorrido.search)}`, 'busqueda');
  const producto = extraerProducto(busqueda, recorrido.search);
  return validarRespuesta(busqueda, 'búsqueda', 'hay un producto válido que coincide con el término', Boolean(producto))
    ? producto : undefined;
}
