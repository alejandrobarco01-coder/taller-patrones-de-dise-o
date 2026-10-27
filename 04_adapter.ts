/**
 * ! Patrón Adapter:
 * Convierte la interfaz de una clase existente en otra que espera el cliente.
 *
 * Este ejemplo integra un GPS legado que entrega coordenadas separadas con
 * una aplicación de mapas que espera una dirección textual. El Adapter permite
 * reutilizar el GPS; sin él, habría que cambiar la aplicación o duplicar lógica
 * de conversión en cada cliente.
 */

// Target: interfaz requerida por la aplicación de mapas.
interface ProveedorUbicacion {
    obtenerUbicacion(): string;
}

// Adaptee: servicio legado con una interfaz incompatible.
class GPSLegado {
    leerCoordenadas(): { latitud: number; longitud: number } {
        return { latitud: 3.9009, longitud: -76.2978 };
    }
}

// Adapter: traduce la respuesta del GPS al formato que requiere el cliente.
class AdaptadorGPS implements ProveedorUbicacion {
    private gps: GPSLegado;

    constructor(gps: GPSLegado) {
        this.gps = gps;
    }

    obtenerUbicacion(): string {
        const coordenadas = this.gps.leerCoordenadas();
        return `${coordenadas.latitud}, ${coordenadas.longitud}`;
    }
}

// Cliente: trabaja solo con la interfaz Target.
class AplicacionMapas {
    private proveedor: ProveedorUbicacion;

    constructor(proveedor: ProveedorUbicacion) {
        this.proveedor = proveedor;
    }

    mostrarUbicacion(): void {
        console.log(`Ubicación actual: ${this.proveedor.obtenerUbicacion()}`);
    }
}

function main(): void {
    const gps = new GPSLegado();
    const proveedorCompatible = new AdaptadorGPS(gps);
    new AplicacionMapas(proveedorCompatible).mostrarUbicacion();
}

main();
