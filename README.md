# Sistema de Gestion de Laboratorios y Resultados

Proyecto de evaluacion - Desarrollo de Aplicaciones Spring Boot
DUOC UC - Desarrollo Fullstack 3

## Descripcion

Sistema de microservicios para la gestion de laboratorios y resultados de analisis clinicos, desarrollado con Spring Boot y Oracle Database.

## Estructura del Proyecto

```
.
├── user-service/          # Microservicio de Usuarios
├── results-service/       # Microservicio de Resultados
└── schema_oracle.sql      # Script de base de datos
```

## Tecnologias

- Java 21
- Spring Boot 3.5.7
- Maven
- Oracle Database (ojdbc11)
- Spring Data JPA
- Spring Web
- Spring Validation

## Requisitos

1. Java 21 instalado
2. Maven 3.8+
3. Oracle Cloud Account con Autonomous Database
4. Git

## Configuracion de Base de Datos

### 1. Crear Autonomous Database en Oracle Cloud

- Acceder a Oracle Cloud Console
- Crear una Autonomous Transaction Processing Database
- Descargar el Wallet Connection

### 2. Configurar el Wallet

Extraer el wallet y copiar los archivos a:
- `user-service/src/main/resources/wallet/`
- `results-service/src/main/resources/wallet/`

### 3. Configurar application-cloud.properties

Editar en ambos servicios `src/main/resources/application-cloud.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@(copiar_connection_string_de_tnsnames.ora)
spring.datasource.username=ADMIN
spring.datasource.password=TU_PASSWORD_ADMIN
```

### 4. Ejecutar el script de schema

- Acceder a SQL Developer Web como ADMIN
- Ejecutar todo el contenido de `schema_oracle.sql`

## Compilación y Ejecución

### User Service (Puerto 8081)

```bash
cd user-service
mvn spring-boot:run "-Dspring-boot.run.profiles=cloud"
```

### Results Service (Puerto 8082)

```bash
cd results-service
mvn spring-boot:run "-Dspring-boot.run.profiles=cloud"
```

Nota: El perfil `cloud` activa la configuracion de `application-cloud.properties`

### Ejecutar JARs compilados

```bash
# User Service
java -jar user-service/target/user-service-0.0.1-SNAPSHOT.jar

# Results Service
java -jar results-service/target/results-service-0.0.1-SNAPSHOT.jar
```

## Endpoints API

### User Service (http://localhost:8081)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/users/auth/login` | Inicio de sesion |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/{id}` | Obtener usuario por ID |
| PUT | `/api/users/{id}` | Actualizar usuario |
| DELETE | `/api/users/{id}` | Eliminar usuario |

#### Ejemplo POST /api/users/auth/login

```json
{
  "email": "admin@laboratorio.cl",
  "password": "admin123"
}
```

Respuesta exitosa:
```json
{
  "id": 1,
  "email": "admin@laboratorio.cl",
  "fullName": "Juan Pérez Administrador",
  "roles": [
    {
      "id": 1,
      "name": "ADMINISTRADOR"
    }
  ],
  "message": "Inicio de sesión exitoso"
}
```

#### Ejemplo POST /api/users

```json
{
  "email": "nuevo@laboratorio.cl",
  "password": "password123",
  "fullName": "Nuevo Usuario Test",
  "roleIds": [1, 3]
}
```

### Results Service (http://localhost:8082)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/results/labs` | Listar todos los laboratorios |
| POST | `/api/results` | Crear resultado |
| GET | `/api/results/{id}` | Obtener resultado por ID |
| GET | `/api/results/by-user/{userId}` | Listar resultados por usuario |
| PUT | `/api/results/{id}` | Actualizar resultado |
| DELETE | `/api/results/{id}` | Eliminar resultado |

#### Ejemplo POST /api/results

```json
{
  "userId": 3,
  "labId": 1,
  "testType": "Hemograma",
  "valueJson": "{\"hemoglobina\": 14.5, \"leucocitos\": 7500}",
  "status": "COMPLETADO",
  "resultDate": "2025-01-30"
}
```

## Pruebas con Postman

1. Importar la colección de endpoints
2. Configurar variables de entorno:
   - `user-service-url`: http://localhost:8081
   - `results-service-url`: http://localhost:8082

### Secuencia de Pruebas

1. Login: POST `/api/users/auth/login` (probar con admin@laboratorio.cl / admin123)
2. Verificar usuarios: GET `/api/users/1`
3. Crear nuevo usuario: POST `/api/users`
4. Listar laboratorios: GET `/api/results/labs`
5. Crear resultado: POST `/api/results`
6. Consultar resultados por usuario: GET `/api/results/by-user/3`
7. Actualizar resultado: PUT `/api/results/1`
8. Eliminar resultado: DELETE `/api/results/5`

## Datos de Prueba Precargados

### Usuarios (con contraseñas para login)

| Email | Password | ID | Roles |
|-------|----------|----|----|
| admin@laboratorio.cl | admin123 | 1 | ADMINISTRADOR |
| doctor@laboratorio.cl | doctor123 | 2 | MEDICO, ADMINISTRADOR |
| paciente@laboratorio.cl | paciente123 | 3 | PACIENTE |
| lab@laboratorio.cl | lab123 | 4 | LABORATORISTA |

Nota: Las contraseñas estan encriptadas con BCrypt en la base de datos.

### Laboratorios

- ID 1: Laboratorio Central Santiago
- ID 2: Laboratorio Clínico Viña del Mar
- ID 3: Laboratorio de Análisis Concepción
- ID 4: Laboratorio Especializado La Serena

### Roles

- ID 1: ADMINISTRADOR
- ID 2: MEDICO
- ID 3: PACIENTE
- ID 4: LABORATORISTA

## Verificacion

### 1. Verificar que los servicios están corriendo

```bash
# User Service
curl http://localhost:8081/api/users/1

# Results Service
curl http://localhost:8082/api/results/labs
```

### 2. Verificar datos en Oracle

```sql
SELECT * FROM USERS;
SELECT * FROM ROLES;
SELECT * FROM LABS;
SELECT * FROM RESULTS;
```

## Troubleshooting

### Error de conexion a BD

- Verificar que Oracle este corriendo
- Verificar credenciales: backend/backend123
- Verificar el SID/Service: XEPDB1

### Puerto en uso

Cambiar puerto en `application.properties`:
```properties
server.port=8083
```

### Error de compilacion

```bash
mvn clean install -U
```

## Autor

Proyecto desarrollado para DUOC UC
Desarrollo de Aplicaciones Fullstack 3