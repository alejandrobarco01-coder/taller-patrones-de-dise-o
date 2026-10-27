# Taller Patrones de Diseño

**Materia:** Arquitectura de Software  
**Universidad:** UCEVA  
**Docente:** Jesús David Mejía Vergara  
**Integrantes:** Alejandro Barco Ruiz y Andres David Perea

## Patrones y ejercicios

| # | Patrón | Clasificación | Estado | Ejercicio |
|---|---|---|---|---|
| 1 | Builder | Creacional — obligatorio | Implementado por Alejandro | Construye paso a paso una orden de mantenimiento de vehículo, combinando servicios opcionales sin un constructor con muchos parámetros. |
| 2 | Factory Method | Creacional — adicional | Implementado por Alejandro | Genera reportes de ventas CSV o JSON delegando a cada creador la selección del exportador concreto. |
| 3 | Singleton | Creacional — adicional | Implementado por Alejandro | Comparte un registro único de eventos entre módulos para conservar un historial común. |
| 4 | Adapter | Estructural — obligatorio | Implementado por Alejandro | Conecta un GPS legado, que entrega coordenadas, con una aplicación de mapas que espera un proveedor de ubicación compatible. |
| 5 | Decorator | Estructural — adicional | Implementado por Alejandro | Agrega leche y jarabe a un café y calcula el precio combinando opciones sin crear una clase para cada combinación. |
| 6 | Flyweight | Estructural — obligatorio | Pendiente | Pendiente de completar por la compañera. |
| 7 | Observer | Comportamiento — obligatorio | Pendiente | Pendiente de completar por la compañera. |
| 8 | Strategy | Comportamiento — adicional | Pendiente | Pendiente de completar por la compañera. |
| 9 | Command | Comportamiento — adicional | Pendiente | Pendiente de completar por la compañera. |
| 10 | State | Comportamiento — adicional | Pendiente | Pendiente de completar por la compañera. |

## Ejecución

Los ejemplos están escritos en TypeScript. Desde la raíz del repositorio, con Deno instalado, ejecuta cada archivo así:

```sh
deno run 01_builder.ts
deno run 02_factory_method.ts
deno run 03_singleton.ts
deno run 04_adapter.ts
deno run 05_decorator.ts
```

También se pueden ejecutar con Node.js 24 o posterior, que incluye soporte experimental para TypeScript:

```sh
node --experimental-strip-types 01_builder.ts
node --experimental-strip-types 02_factory_method.ts
node --experimental-strip-types 03_singleton.ts
node --experimental-strip-types 04_adapter.ts
node --experimental-strip-types 05_decorator.ts
```

Los archivos `06_flyweight.ts` a `10_state.ts` contienen solo un comentario TODO. Aún no tienen una demo ejecutable.

## Alcance de la entrega

Este repositorio contiene únicamente el trabajo de los integrantes. La carpeta base con los ejemplos entregados por el profesor no hace parte de esta entrega.
