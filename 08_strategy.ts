/**
 * ! Patrón Strategy:
 * Define una familia de algoritmos, encapsula cada uno de ellos y los hace
 * intercambiables en tiempo de ejecución. Permite que el algoritmo varíe
 * independientemente de los clientes que lo utilizan.
 *
 * En este ejemplo se implementa un motor de cotización de envíos y logística
 * para una empresa de paquetería. Dependiendo de las necesidades de entrega
 * del usuario, el costo y el tiempo estimado se calculan mediante diferentes
 * estrategias: Terrestre Estándar, Express 24h o Internacional con aduanas.
 * El patrón es adecuado porque desacopla el cálculo del contexto que lo invoca;
 * sin Strategy, la clase calculadora tendría bloques condicionales (if/switch)
 * extensos y difíciles de mantener cada vez que cambien o se agreguen tarifas.
 */

// Strategy: interfaz que define el contrato común para todos los algoritmos de cotización.
interface EstrategiaEnvio {
    readonly nombre: string;
    calcularCosto(pesoKg: number, distanciaKm: number): number;
    obtenerTiempoEstimado(): string;
}

// Concrete Strategy 1: transporte terrestre estándar, económico para entregas sin urgencia.
class EnvioEstandarTerrestre implements EstrategiaEnvio {
    readonly nombre = 'Terrestre Estándar';

    calcularCosto(pesoKg: number, distanciaKm: number): number {
        const tarifaBase = 10000;
        const costoPorKg = pesoKg * 2000;
        const costoPorKm = distanciaKm * 50;
        return tarifaBase + costoPorKg + costoPorKm;
    }

    obtenerTiempoEstimado(): string {
        return '3 a 5 días hábiles';
    }
}

// Concrete Strategy 2: transporte aéreo prioritario con entrega en 24 horas.
class EnvioExpress24h implements EstrategiaEnvio {
    readonly nombre = 'Express 24 Horas';

    calcularCosto(pesoKg: number, distanciaKm: number): number {
        const tarifaBase = 35000;
        const costoPorKg = pesoKg * 6000;
        const costoPorKm = distanciaKm * 150;
        return tarifaBase + costoPorKg + costoPorKm;
    }

    obtenerTiempoEstimado(): string {
        return 'Máximo 24 horas garantizadas';
    }
}

// Concrete Strategy 3: envío transfronterizo con aranceles aduaneros e inspección internacional.
class EnvioInternacional implements EstrategiaEnvio {
    readonly nombre = 'Internacional Courier';

    calcularCosto(pesoKg: number, distanciaKm: number): number {
        const tarifaBase = 90000;
        const costoPorKg = pesoKg * 15000;
        const arancelAduanero = 40000;
        return tarifaBase + costoPorKg + arancelAduanero;
    }

    obtenerTiempoEstimado(): string {
        return '7 a 12 días hábiles (sujeto a nacionalización)';
    }
}

// Context: mantiene la referencia a la estrategia actual y delega el cálculo sin conocer detalles concretos.
class CalculadoraEnvios {
    private estrategia: EstrategiaEnvio;

    constructor(estrategiaInicial: EstrategiaEnvio) {
        this.estrategia = estrategiaInicial;
    }

    establecerEstrategia(nuevaEstrategia: EstrategiaEnvio): void {
        console.log(`\n[Logística] Cambiando estrategia a: >> ${nuevaEstrategia.nombre} <<`);
        this.estrategia = nuevaEstrategia;
    }

    cotizar(descripcionPaquete: string, pesoKg: number, distanciaKm: number): void {
        const costo = this.estrategia.calcularCosto(pesoKg, distanciaKm);
        const tiempo = this.estrategia.obtenerTiempoEstimado();

        console.log(`--------------------------------------------------`);
        console.log(`Paquete: ${descripcionPaquete} (${pesoKg} kg, ${distanciaKm} km)`);
        console.log(`Modalidad: ${this.estrategia.nombre}`);
        console.log(`Costo total: $${costo.toLocaleString('es-CO')}`);
        console.log(`Tiempo de entrega: ${tiempo}`);
        console.log(`--------------------------------------------------`);
    }
}

function main(): void {
    console.log('=== COTIZADOR DE LOGÍSTICA Y ENVÍOS (PATRÓN STRATEGY) ===\n');

    // Inicializamos el contexto con la estrategia económica estándar
    const cotizador = new CalculadoraEnvios(new EnvioEstandarTerrestre());
    cotizador.cotizar('Caja de repuestos industriales', 12, 320);

    // El cliente solicita rapidez para un documento legal importante
    cotizador.establecerEstrategia(new EnvioExpress24h());
    cotizador.cotizar('Contratos y documentos notariales', 1.5, 480);

    // Envío hacia el exterior que requiere gestión de aduanas
    cotizador.establecerEstrategia(new EnvioInternacional());
    cotizador.cotizar('Muestra de café especial exportación', 5.0, 2500);
}

main();
