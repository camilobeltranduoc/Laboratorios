# Sistema de Gestión de Laboratorios Clínicos

Proyecto desarrollado para la asignatura Desarrollo Fullstack 3 (DSY2205)
DUOC UC - 2025

## Descripción

Aplicación web para gestionar laboratorios clínicos, usuarios y resultados de exámenes médicos. El sistema permite a los administradores gestionar laboratorios y usuarios, a los médicos consultar resultados de pacientes, y a los pacientes ver sus propios resultados.

## Arquitectura

El proyecto está compuesto por:

- **Frontend**: Angular 20 (puerto 4200)
- **Backend**: 3 microservicios Spring Boot
  - user-service: Gestión de usuarios y autenticación (puerto 8081)
  - labs-service: Gestión de laboratorios (puerto 8083)
  - results-service: Gestión de resultados de exámenes (puerto 8082)
- **Base de datos**: Oracle Cloud Autonomous Database
- **Containerización**: Docker y docker-compose

## Tecnologías utilizadas

**Frontend:**
- Angular 20
- TypeScript
- Bootstrap 5
- RxJS

**Backend:**
- Java 21
- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- Maven

**Base de datos:**
- Oracle Autonomous Database (Cloud)
- Oracle JDBC Driver 23.4

**DevOps:**
- Docker
- Docker Compose
- SonarQube (análisis de código)
- Karma + Jasmine (testing)

## Requisitos previos

Antes de ejecutar el proyecto necesitas tener instalado:

1. Node.js 18+ y npm
2. Java 21
3. Maven 3.8+
4. Docker Desktop
5. Git

## Configuración de la base de datos

### Paso 1: Wallet de Oracle Cloud

El proyecto ya incluye el wallet configurado en cada microservicio dentro de `src/main/resources/wallet/`

Si necesitas usar tu propia base de datos:
1. Descarga el wallet desde Oracle Cloud Console
2. Copia los archivos del wallet a:
   - `user-service/src/main/resources/wallet/`
   - `labs-service/src/main/resources/wallet/`
   - `results-service/src/main/resources/wallet/`

### Paso 2: Script de base de datos

Ejecuta el archivo `schema_oracle.sql` en tu base de datos Oracle para crear las tablas y datos iniciales.

## Instalación y ejecución

### Opción 1: Ejecutar con Docker (Recomendado)

La forma más fácil es usar Docker Compose:

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Esto levanta:
- Frontend en http://localhost:4200
- user-service en http://localhost:8081
- labs-service en http://localhost:8083
- results-service en http://localhost:8082

### Opción 2: Ejecutar manualmente

**Backend:**

```bash
# User Service
cd user-service
mvn spring-boot:run

# Labs Service
cd labs-service
mvn spring-boot:run

# Results Service
cd results-service
mvn spring-boot:run
```

**Frontend:**

```bash
cd laboratorios-front
npm install
ng serve
```

Acceder a http://localhost:4200

## Usuarios de prueba

El sistema viene con usuarios precargados para testing:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@laboratorios.cl | Admin123! | Administrador |
| medico@laboratorios.cl | Medico123! | Médico |
| paciente@laboratorios.cl | Paciente123! | Paciente |
| laboratorista@laboratorios.cl | Laboratorista123! | Laboratorista |

## Funcionalidades por rol

**Administrador:**
- Gestión completa de usuarios (crear, editar, eliminar)
- Gestión de laboratorios
- Gestión de resultados
- Ver estadísticas del sistema

**Médico:**
- Consultar resultados de pacientes
- Ver información de laboratorios

**Paciente:**
- Ver sus propios resultados de exámenes
- Descargar resultados

**Laboratorista:**
- Cargar y actualizar resultados de exámenes
- Gestionar información de laboratorios

## Pruebas unitarias

El proyecto incluye pruebas unitarias con Karma y Jasmine.

```bash
cd laboratorios-front

# Ejecutar tests
ng test

# Ejecutar tests con coverage
ng test --code-coverage --no-watch

# Ver reporte de cobertura
# Abrir: laboratorios-front/coverage/laboratorios-front/index.html
```

Cobertura actual: **100%** (127 statements, 20 branches, 46 functions, 109 lines)

Total de tests: **101**

## Análisis de código con SonarQube

Para analizar la calidad del código:

```bash
# Levantar SonarQube
docker-compose -f docker-compose.sonarqube.yml up -d

# Esperar a que inicie (aprox 1 minuto)
# Acceder a http://localhost:9000
# Login: admin / admin (te pedirá cambiar la contraseña)

# Ejecutar análisis
cd laboratorios-front
../sonar-scanner/bin/sonar-scanner.bat -Dsonar.projectKey=laboratorios-front -Dsonar.sources=src/app -Dsonar.host.url=http://localhost:9000 -Dsonar.token=TU_TOKEN
```

## Endpoints API

### User Service (http://localhost:8081)

```
POST   /api/users/auth/login      - Login
POST   /api/users/auth/register   - Registro
GET    /api/users                 - Listar usuarios
GET    /api/users/{id}            - Obtener usuario
PUT    /api/users/{id}            - Actualizar usuario
DELETE /api/users/{id}            - Eliminar usuario
```

### Labs Service (http://localhost:8083)

```
GET    /api/labs                  - Listar laboratorios
GET    /api/labs/{id}             - Obtener laboratorio
POST   /api/labs                  - Crear laboratorio
PUT    /api/labs/{id}             - Actualizar laboratorio
DELETE /api/labs/{id}             - Eliminar laboratorio
```

### Results Service (http://localhost:8082)

```
GET    /api/results                    - Listar resultados
GET    /api/results/{id}               - Obtener resultado
GET    /api/results/patient/{id}       - Resultados por paciente
POST   /api/results                    - Crear resultado
PUT    /api/results/{id}               - Actualizar resultado
DELETE /api/results/{id}               - Eliminar resultado
```

## Colección Postman

El archivo `Postman_Collection.json` contiene todos los endpoints configurados para pruebas.

Importar en Postman y configurar las variables:
- `base_url_users`: http://localhost:8081
- `base_url_labs`: http://localhost:8083
- `base_url_results`: http://localhost:8082

## Estructura del proyecto

```
.
├── laboratorios-front/          # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Componentes de la aplicación
│   │   │   ├── services/        # Servicios (auth, user, lab, result)
│   │   │   ├── guards/          # Guards de autenticación y roles
│   │   │   └── models/          # Modelos de datos
│   │   └── ...
│   ├── karma.conf.js            # Configuración de tests
│   └── sonar-project.properties # Configuración SonarQube
│
├── user-service/                # Microservicio de usuarios
│   ├── src/main/
│   │   ├── java/.../
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   └── dto/
│   │   └── resources/
│   │       ├── wallet/          # Wallet Oracle
│   │       └── application.properties
│   └── Dockerfile
│
├── labs-service/                # Microservicio de laboratorios
│   └── (estructura similar a user-service)
│
├── results-service/             # Microservicio de resultados
│   └── (estructura similar a user-service)
│
├── docker-compose.yml           # Orquestación de servicios
├── docker-compose.sonarqube.yml # SonarQube en Docker
├── schema_oracle.sql            # Script de base de datos
├── Postman_Collection.json      # Colección de Postman
└── README.md                    # Este archivo
```

## Problemas comunes

**Puerto ocupado:**
Si algún puerto está en uso, modificar en docker-compose.yml o en application.properties

**Error de conexión a BD:**
Verificar que el wallet esté en la carpeta correcta y que las credenciales sean válidas

**Tests fallan:**
Limpiar caché de npm: `npm cache clean --force` y reinstalar: `npm install`

**Docker no inicia:**
Verificar que Docker Desktop esté corriendo

## Autor

Camilo Beltrán
DUOC UC - 2025
Desarrollo Fullstack 3 (DSY2205)
