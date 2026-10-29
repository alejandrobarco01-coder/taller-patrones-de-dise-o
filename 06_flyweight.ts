/**
 * ! Patrón Flyweight:
 * Permite mantener una gran cantidad de objetos consumiendo un mínimo de memoria,
 * compartiendo las partes comunes del estado (estado intrínseco) entre múltiples
 * objetos en lugar de duplicar los datos en cada instancia individual.
 *
 * En este ejemplo se implementa un sistema de alertas de tráfico urbano en tiempo
 * real para una aplicación de mapas. Cada reporte vial comparte un tipo de alerta,
 * un icono y un nivel de severidad (estado intrínseco), mientras que la ubicación
 * (latitud, longitud), la hora y el código de reporte son únicos (estado extrínseco).
 * El patrón es adecuado porque en una ciudad congestionada pueden existir miles
 * de alertas simultáneas; sin Flyweight, cada alerta duplicaría objetos pesados en
 * memoria y colapsaría el rendimiento del cliente o del servidor.
 */

// Flyweight: almacena el estado intrínseco (compartido e inmutable).
class TipoAlertaVial {
    readonly nombre: string;
    readonly icono: string;
    readonly nivelSeveridad: string;

    constructor(nombre: string, icono: string, nivelSeveridad: string) {
        this.nombre = nombre;
        this.icono = icono;
        this.nivelSeveridad = nivelSeveridad;
    }

    renderizar(latitud: number, longitud: number, codigoReporte: string, hora: string): void {
        console.log(
            `  [${this.icono} ${this.nombre.toUpperCase()}] Ref: ${codigoReporte} | ` +
            `Severidad: ${this.nivelSeveridad} | Ubicación: (${latitud.toFixed(4)}, ${longitud.toFixed(4)}) | Hora: ${hora}`
        );
    }
}

// FlyweightFactory: crea y gestiona la reutilización de los objetos Flyweight existentes.
class FabricaAlertas {
    private static tiposAlertas: Map<string, TipoAlertaVial> = new Map();

    static obtenerTipoAlerta(nombre: string, icono: string, nivelSeveridad: string): TipoAlertaVial {
        const clave = `${nombre}_${nivelSeveridad}`.toLowerCase();

        if (!this.tiposAlertas.has(clave)) {
            console.log(`-> [Fábrica] Creando nueva instancia Flyweight para tipo: "${nombre}"`);
            this.tiposAlertas.set(clave, new TipoAlertaVial(nombre, icono, nivelSeveridad));
        } else {
            console.log(`-> [Fábrica] Reutilizando instancia Flyweight existente para tipo: "${nombre}"`);
        }

        return this.tiposAlertas.get(clave)!;
    }

    static cantidadInstanciasCreadas(): number {
        return this.tiposAlertas.size;
    }
}

// Context: almacena el estado extrínseco (único para cada reporte) y referencia al Flyweight.
class ReporteTrafico {
    private readonly codigoReporte: string;
    private readonly latitud: number;
    private readonly longitud: number;
    private readonly hora: string;
    private readonly tipoAlerta: TipoAlertaVial;

    constructor(
        codigoReporte: string,
        latitud: number,
        longitud: number,
        hora: string,
        tipoAlerta: TipoAlertaVial
    ) {
        this.codigoReporte = codigoReporte;
        this.latitud = latitud;
        this.longitud = longitud;
        this.hora = hora;
        this.tipoAlerta = tipoAlerta;
    }

    mostrar(): void {
        this.tipoAlerta.renderizar(this.latitud, this.longitud, this.codigoReporte, this.hora);
    }
}

// Cliente: gestiona la colección de reportes del mapa urbano.
class SistemaMonitoreoTrafico {
    private reportes: ReporteTrafico[] = [];

    registrarAlerta(
        codigo: string,
        latitud: number,
        longitud: number,
        hora: string,
        nombreTipo: string,
        icono: string,
        severidad: string
    ): void {
        const tipoCompartido = FabricaAlertas.obtenerTipoAlerta(nombreTipo, icono, severidad);
        const reporte = new ReporteTrafico(codigo, latitud, longitud, hora, tipoCompartido);
        this.reportes.push(reporte);
    }

    renderizarMapa(): void {
        console.log('\n--- ALERTAS ACTIVAS EN EL MAPA ---');
        for (const reporte of this.reportes) {
            reporte.mostrar();
        }
    }

    mostrarEstadisticasAhorro(): void {
        const totalReportes = this.reportes.length;
        const totalInstanciasFlyweight = FabricaAlertas.cantidadInstanciasCreadas();
        const instanciasAhorradas = totalReportes - totalInstanciasFlyweight;
        const porcentajeAhorro = ((instanciasAhorradas / totalReportes) * 100).toFixed(1);

        console.log('\n--- BALANCE DE MEMORIA (PATRÓN FLYWEIGHT) ---');
        console.log(`Total de reportes viales registrados: ${totalReportes}`);
        console.log(`Instancias de TipoAlerta en memoria:   ${totalInstanciasFlyweight}`);
        console.log(`Instancias pesadas evitadas/ahorradas: ${instanciasAhorradas} (~${porcentajeAhorro}% de ahorro)`);
    }
}

function main(): void {
    console.log('=== SISTEMA DE MONITOREO DE TRÁFICO URBANO ===');
    const sistema = new SistemaMonitoreoTrafico();

    // Registro de 8 incidentes distribuidos en solo 3 categorías
    sistema.registrarAlerta('REP-101', 3.4516, -76.5320, '08:00', 'Accidente de tránsito', '💥', 'Alta');
    sistema.registrarAlerta('REP-102', 3.4580, -76.5290, '08:05', 'Bache profundo', '🕳️', 'Media');
    sistema.registrarAlerta('REP-103', 3.4621, -76.5342, '08:12', 'Cámara fotomulta', '📷', 'Baja');
    sistema.registrarAlerta('REP-104', 3.4490, -76.5410, '08:15', 'Accidente de tránsito', '💥', 'Alta');
    sistema.registrarAlerta('REP-105', 3.4533, -76.5388, '08:22', 'Bache profundo', '🕳️', 'Media');
    sistema.registrarAlerta('REP-106', 3.4670, -76.5255, '08:30', 'Accidente de tránsito', '💥', 'Alta');
    sistema.registrarAlerta('REP-107', 3.4712, -76.5301, '08:35', 'Bache profundo', '🕳️', 'Media');
    sistema.registrarAlerta('REP-108', 3.4605, -76.5360, '08:40', 'Cámara fotomulta', '📷', 'Baja');

    sistema.renderizarMapa();
    sistema.mostrarEstadisticasAhorro();
}

main();
