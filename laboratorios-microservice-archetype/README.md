# Arquetipo Maven para Microservicios - Sistema de Gestión de Laboratorios

Este arquetipo Maven proporciona una plantilla estándar para crear microservicios Spring Boot en el Sistema de Gestión de Laboratorios.

## Características

El arquetipo incluye:

- ✅ Spring Boot 3.5.7 con Java 21
- ✅ Spring Data JPA para persistencia
- ✅ Configuración de Oracle Cloud Database
- ✅ Soporte para Oracle Wallet
- ✅ Configuración CORS para frontend Angular
- ✅ Manejo global de excepciones
- ✅ Lombok para reducir boilerplate
- ✅ JaCoCo para cobertura de tests
- ✅ Estructura de paquetes estándar (config, controller, dto, exception, model, repository, service)
- ✅ Dockerfile para containerización
- ✅ Tests unitarios básicos con JUnit 5

## Instalación del Arquetipo

Para instalar el arquetipo en tu repositorio local de Maven:

```bash
cd laboratorios-microservice-archetype
mvn clean install
```

Esto instalará el arquetipo en `~/.m2/repository/` para que puedas usarlo en cualquier proyecto.

## Uso del Arquetipo

### Crear un nuevo microservicio

Para generar un nuevo microservicio usando este arquetipo:

```bash
mvn archetype:generate \
  -DarchetypeGroupId=cl.duoc.laboratorio \
  -DarchetypeArtifactId=laboratorios-microservice-archetype \
  -DarchetypeVersion=1.0.0 \
  -DgroupId=cl.duoc.laboratorio \
  -DartifactId=nombre-servicio \
  -Dversion=0.0.1-SNAPSHOT \
  -Dpackage=cl.duoc.laboratorio.nombre_servicio \
  -Dservice-name=nombre-servicio \
  -Dservice-description="Descripción del microservicio" \
  -Dservice-port=8080
```

### Parámetros

- `groupId`: Identificador del grupo (por defecto: cl.duoc.laboratorio)
- `artifactId`: Nombre del microservicio (ej: products-service)
- `version`: Versión del proyecto (ej: 0.0.1-SNAPSHOT)
- `package`: Paquete base de Java (ej: cl.duoc.laboratorio.products_service)
- `service-name`: Nombre descriptivo del servicio
- `service-description`: Descripción del microservicio
- `service-port`: Puerto en el que correrá el servicio (ej: 8080, 8081, 8082)

### Ejemplo de uso

Crear un microservicio de productos:

```bash
mvn archetype:generate \
  -DarchetypeGroupId=cl.duoc.laboratorio \
  -DarchetypeArtifactId=laboratorios-microservice-archetype \
  -DarchetypeVersion=1.0.0 \
  -DgroupId=cl.duoc.laboratorio \
  -DartifactId=products-service \
  -Dversion=0.0.1-SNAPSHOT \
  -Dpackage=cl.duoc.laboratorio.products_service \
  -Dservice-name=products-service \
  -Dservice-description="Microservicio de gestión de productos" \
  -Dservice-port=8084
```

## Estructura del Proyecto Generado

```
nombre-servicio/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── java/
    │   │   └── cl/duoc/laboratorio/nombre_servicio/
    │   │       ├── config/
    │   │       │   └── WebConfig.java
    │   │       ├── controller/
    │   │       ├── dto/
    │   │       ├── exception/
    │   │       │   ├── GlobalExceptionHandler.java
    │   │       │   └── ResourceNotFoundException.java
    │   │       ├── model/
    │   │       ├── repository/
    │   │       ├── service/
    │   │       └── Application.java
    │   └── resources/
    │       ├── application.properties
    │       └── wallet/
    └── test/
        └── java/
            └── cl/duoc/laboratorio/nombre_servicio/
                └── ApplicationTests.java
```

## Configuración Post-Generación

Después de generar el microservicio:

1. **Copiar el Oracle Wallet**: Copia los archivos del wallet de Oracle Cloud a `src/main/resources/wallet/`

2. **Configurar variables de entorno**:
   ```bash
   export DB_TNS_ADMIN=nombre_servicio_medium
   export DB_USERNAME=ADMIN
   export DB_PASSWORD=tu_password
   ```

3. **Implementar la lógica de negocio**:
   - Crea las entidades en `model/`
   - Crea los repositorios en `repository/`
   - Implementa los servicios en `service/`
   - Crea los DTOs en `dto/`
   - Implementa los controladores en `controller/`

4. **Ejecutar el microservicio**:
   ```bash
   mvn spring-boot:run
   ```

5. **Ejecutar tests con cobertura**:
   ```bash
   mvn clean test
   mvn jacoco:report
   ```
   Los reportes de cobertura estarán en `target/site/jacoco/index.html`

## Integración con SonarQube

El arquetipo incluye configuración para JaCoCo. Para analizar con SonarQube:

```bash
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=nombre-servicio \
  -Dsonar.projectName='Nombre Servicio' \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=tu_token
```

## Docker

Para construir y ejecutar con Docker:

```bash
# Construir JAR
mvn clean package -DskipTests

# Construir imagen Docker
docker build -t nombre-servicio:latest .

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e DB_TNS_ADMIN=nombre_servicio_medium \
  -e DB_USERNAME=ADMIN \
  -e DB_PASSWORD=tu_password \
  nombre-servicio:latest
```

## Microservicios Actuales

Este arquetipo se utiliza para estandarizar los siguientes microservicios:

1. **user-service** (Puerto 8081): Gestión de usuarios y autenticación
2. **labs-service** (Puerto 8083): Gestión de laboratorios
3. **results-service** (Puerto 8082): Gestión de resultados de análisis

## Autor

Proyecto desarrollado para la asignatura Desarrollo Fullstack 3 (DSY2205)
DUOC UC - 2025
