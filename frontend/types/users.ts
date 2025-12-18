export type UserRole = 'admin' | 'operador' | 'cliente';

export interface User {
  id: number;
  nombre: string;
  rol: UserRole;
}
