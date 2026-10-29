# Taller Patrones de Diseño

**Materia:** Arquitectura de Software  
**Universidad:** UCEVA  
**Docente:** Jesús David Mejía Vergara  
**Integrantes:** Alejandro Barco Ruiz y Andrés David Perea

## Patrones y ejercicios

| # | Patrón | Clasificación | Estado | Ejercicio |
|---|---|---|---|---|
| 1 | Builder | Creacional — obligatorio | Implementado por Alejandro | Construye paso a paso una orden de mantenimiento de vehículo, combinando servicios opcionales sin un constructor con muchos parámetros. |
| 2 | Factory Method | Creacional — adicional | Implementado por Alejandro | Genera reportes de ventas CSV o JSON delegando a cada creador la selección del exportador concreto. |
| 3 | Singleton | Creacional — adicional | Implementado por Alejandro | Comparte un registro único de eventos entre módulos para conservar un historial común. |
| 4 | Adapter | Estructural — obligatorio | Implementado por Alejandro | Conecta un GPS legado, que entrega coordenadas, con una aplicación de mapas que espera un proveedor de ubicación compatible. |
| 5 | Decorator | Estructural — adicional | Implementado por Alejandro | Agrega leche y jarabe a un café y calcula el precio combinando opciones sin crear una clase para cada combinación. |
| 6 | Flyweight | Estructural — obligatorio | Implementado por Andrés David Perea | Optimiza el uso de memoria en un mapa de tráfico urbano compartiendo el tipo y metadatos de las alertas entre miles de reportes viales. |
| 7 | Observer | Comportamiento — obligatorio | Implementado por Andrés David Perea | Notifica en tiempo real cambios en constantes vitales de pacientes en UCI a paneles de enfermería, alarmas sonoras y bitácoras clínicas. |
| 8 | Strategy | Comportamiento — adicional | Implementado por Andrés David Perea | Calcula costos y plazos de entrega en paquetería logística alternando dinámicamente entre modalidades terrestre, express e internacional. |
| 9 | Command | Comportamiento — adicional | Implementado por Andrés David Perea | Gestiona transacciones bancarias (depósito, retiro, transferencia) como órdenes auditables que soportan la reversión de operaciones. |
| 10 | State | Comportamiento — adicional | Implementado por Andrés David Perea | Modela las fases de una solicitud de crédito bancario (Borrador, En Revisión, Aprobado, Desembolsado, Rechazado) restringiendo acciones según el estado. |

## Ejecución

Los ejemplos están escritos en TypeScript. Desde la raíz del repositorio, con Deno instalado, ejecuta cada archivo así:

```sh
deno run 01_builder.ts
deno run 02_factory_method.ts
deno run 03_singleton.ts
deno run 04_adapter.ts
deno run 05_decorator.ts
deno run 06_flyweight.ts
deno run 07_observer.ts
deno run 08_strategy.ts
deno run 09_command.ts
deno run 10_state.ts
```

También se pueden ejecutar con Node.js 24 o posterior, que incluye soporte experimental para TypeScript:

```sh
node --experimental-strip-types 01_builder.ts
node --experimental-strip-types 02_factory_method.ts
node --experimental-strip-types 03_singleton.ts
node --experimental-strip-types 04_adapter.ts
node --experimental-strip-types 05_decorator.ts
node --experimental-strip-types 06_flyweight.ts
node --experimental-strip-types 07_observer.ts
node --experimental-strip-types 08_strategy.ts
node --experimental-strip-types 09_command.ts
node --experimental-strip-types 10_state.ts
```

## Alcance de la entrega

Este repositorio contiene únicamente el trabajo de los integrantes. La carpeta base con los ejemplos entregados por el profesor no hace parte de esta entrega.
