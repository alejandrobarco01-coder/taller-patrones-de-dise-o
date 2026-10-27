/**
 * ! Factory Method:
 * Define una operación de creación en una clase base y deja que sus subclases
 * elijan qué producto concreto instanciar.
 *
 * Este ejemplo genera reportes de ventas en CSV o JSON. Es adecuado porque
 * cada formato tiene reglas distintas; sin el patrón, la lógica de selección y
 * creación se mezclaría con el proceso de generar el reporte.
 */

// Producto: todos los exportadores ofrecen la misma operación.
interface ExportadorReporte {
    exportar(datos: string[]): string;
}

// Productos concretos: cada uno representa un formato de salida.
class ExportadorCSV implements ExportadorReporte {
    exportar(datos: string[]): string {
        return `ventas\n${datos.join('\n')}`;
    }
}

class ExportadorJSON implements ExportadorReporte {
    exportar(datos: string[]): string {
        return JSON.stringify({ ventas: datos }, null, 2);
    }
}

// Creador: define el Factory Method y el flujo de exportación común.
abstract class GeneradorReporte {
    protected abstract crearExportador(): ExportadorReporte;

    generar(datos: string[]): void {
        const exportador = this.crearExportador();
        console.log(exportador.exportar(datos));
    }
}

// Creadores concretos: deciden qué producto se construye.
class GeneradorCSV extends GeneradorReporte {
    protected crearExportador(): ExportadorReporte {
        return new ExportadorCSV();
    }
}

class GeneradorJSON extends GeneradorReporte {
    protected crearExportador(): ExportadorReporte {
        return new ExportadorJSON();
    }
}

function main(): void {
    const ventas = ['V-001,150000', 'V-002,89000'];
    console.log('Reporte CSV:');
    new GeneradorCSV().generar(ventas);
    console.log('Reporte JSON:');
    new GeneradorJSON().generar(ventas);
}

main();
