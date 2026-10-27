/**
 * ! Patrón Decorator:
 * Añade responsabilidades a un objeto envolviéndolo con objetos decoradores
 * que conservan la misma interfaz.
 *
 * Este ejemplo permite agregar leche y jarabe a una bebida de cafetería.
 * Es adecuado porque las opciones se pueden combinar; sin Decorator, se
 * necesitaría una clase distinta para cada combinación posible de ingredientes.
 */

// Component: contrato común para la bebida y sus decoradores.
interface Bebida {
    descripcion(): string;
    costo(): number;
}

// Concrete Component: bebida básica que se puede extender.
class Cafe implements Bebida {
    descripcion(): string {
        return 'Café';
    }

    costo(): number {
        return 3000;
    }
}

// Decorator base: conserva una bebida y delega el comportamiento común.
abstract class DecoradorBebida implements Bebida {
    protected bebida: Bebida;

    constructor(bebida: Bebida) {
        this.bebida = bebida;
    }

    descripcion(): string {
        return this.bebida.descripcion();
    }

    costo(): number {
        return this.bebida.costo();
    }
}

// Concrete Decorators: agregan descripción y costo sin cambiar la bebida base.
class Leche extends DecoradorBebida {
    descripcion(): string {
        return `${this.bebida.descripcion()} con leche`;
    }

    costo(): number {
        return this.bebida.costo() + 800;
    }
}

class Jarabe extends DecoradorBebida {
    descripcion(): string {
        return `${this.bebida.descripcion()} con jarabe`;
    }

    costo(): number {
        return this.bebida.costo() + 500;
    }
}

function main(): void {
    let pedido: Bebida = new Cafe();
    pedido = new Leche(pedido);
    pedido = new Jarabe(pedido);

    console.log(`Pedido: ${pedido.descripcion()}`);
    console.log(`Total: $${pedido.costo()}`);
}

main();
