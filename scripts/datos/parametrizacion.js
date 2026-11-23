import exec from 'k6/execution';
import { SharedArray } from 'k6/data';

export function cargarDatos(leerArchivo) {
  const usuarios = new SharedArray('usuarios de prueba', () => {
    const registros = JSON.parse(leerArchivo(__ENV.USUARIOS_JSON || './data/usuariosDemo.json'));
    if (!Array.isArray(registros) || !registros.length || registros.some((usuario) => !usuario.username || !usuario.password)) {
      throw new Error('El archivo de usuarios requiere al menos un registro con username y password.');
    }
    return registros;
  });

  const recorridos = new SharedArray('datos de catálogo y carrito', () => {
    const registros = JSON.parse(leerArchivo('./data/recorridos.json'));
    if (!Array.isArray(registros) || !registros.length || registros.some((recorrido) =>
      !Number.isInteger(recorrido.page) || recorrido.page < 0 || !recorrido.search ||
      !Number.isInteger(recorrido.quantity) || recorrido.quantity < 1
    )) {
      throw new Error('Los recorridos requieren página, término y cantidad válidos.');
    }
    return registros;
  });

  return function datosDeIteracion() {
    const indice = exec.scenario.iterationInTest;
    return {
      recorrido: recorridos[indice % recorridos.length],
      usuario: usuarios[indice % usuarios.length],
    };
  };
}
