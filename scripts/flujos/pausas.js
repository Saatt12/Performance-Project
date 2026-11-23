import { sleep } from 'k6';

export function pausaUsuario() {
  sleep(0.8 + Math.random() * 0.7);
}
