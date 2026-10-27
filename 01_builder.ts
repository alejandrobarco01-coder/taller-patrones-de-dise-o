/**
 * ! Patrón Builder:
 * Permite construir un objeto complejo paso a paso mediante un constructor
 * que configura sus partes y entrega el producto terminado.
 *
 * En este ejemplo se arma una orden de mantenimiento de vehículo con datos
 * opcionales. Es adecuado porque cada orden puede combinar servicios distintos;
 * sin Builder, habría constructores largos y combinaciones difíciles de leer.
 */

// Producto: representa la orden completa que recibirá el taller.
class OrdenMantenimiento {
    readonly placa: string;
    readonly servicios: string[];
    readonly requiereVehiculoSustituto: boolean;

    constructor(placa: string, servicios: string[], requiereVehiculoSustituto: boolean) {
        this.placa = placa;
        this.servicios = servicios;
        this.requiereVehiculoSustituto = requiereVehiculoSustituto;
    }

    mostrarResumen(): void {
        console.log(`Orden para ${this.placa}: ${this.servicios.join(', ')}`);
        console.log(`Vehículo sustituto: ${this.requiereVehiculoSustituto ? 'Sí' : 'No'}`);
    }
}

// Builder: concentra la configuración progresiva y valida que haya servicios.
class OrdenMantenimientoBuilder {
    private servicios: string[] = [];
    private requiereVehiculoSustituto = false;
    private readonly placa: string;

    constructor(placa: string) {
        this.placa = placa;
    }

    agregarServicio(servicio: string): OrdenMantenimientoBuilder {
        this.servicios.push(servicio);
        return this;
    }

    solicitarVehiculoSustituto(): OrdenMantenimientoBuilder {
        this.requiereVehiculoSustituto = true;
        return this;
    }

    build(): OrdenMantenimiento {
        if (this.servicios.length === 0) {
            throw new Error('La orden debe incluir al menos un servicio.');
        }
        return new OrdenMantenimiento(
            this.placa,
            [...this.servicios],
            this.requiereVehiculoSustituto,
        );
    }
}

// Demo: el cliente construye la orden solo con las opciones necesarias.
function main(): void {
    const orden = new OrdenMantenimientoBuilder('ABC-123')
        .agregarServicio('Cambio de aceite')
        .agregarServicio('Revisión de frenos')
        .solicitarVehiculoSustituto()
        .build();

    orden.mostrarResumen();
}

main();
