export function campoJson(response, campo) {
  try {
    return response.json(campo);
  } catch {
    return undefined;
  }
}

export function extraerIdentificador(response, campo) {
  const valor = campoJson(response, campo);
  return typeof valor === 'string' && valor.trim().length > 0 ? valor : undefined;
}

export function extraerProducto(response, termino) {
  const productos = campoJson(response, 'products');
  return Array.isArray(productos) && productos.find((producto) =>
    producto && Number.isInteger(producto.id) && Number.isFinite(producto.price) &&
    typeof producto.name === 'string' && producto.name.toLowerCase().includes(termino.toLowerCase())
  );
}
