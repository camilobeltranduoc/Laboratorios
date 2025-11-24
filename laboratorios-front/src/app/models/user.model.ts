export interface User {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  rol: 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE' | 'LABORATORISTA';
}
