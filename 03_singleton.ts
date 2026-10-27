/**
 * ! Singleton:
 * Garantiza que exista una sola instancia de una clase y ofrece un punto
 * de acceso común a ella.
 *
 * Este ejemplo centraliza el registro de eventos de una aplicación. Es adecuado
 * porque los módulos deben escribir en el mismo registro; sin Singleton, cada
 * módulo podría mantener un historial distinto e incompleto.
 */

// Singleton: el constructor privado impide crear registros independientes.
class RegistroEventos {
    private static instancia: RegistroEventos | null = null;
    private eventos: string[] = [];

    private constructor() {}

    static obtenerInstancia(): RegistroEventos {
        if (RegistroEventos.instancia === null) {
            RegistroEventos.instancia = new RegistroEventos();
        }
        return RegistroEventos.instancia;
    }

    registrar(evento: string): void {
        this.eventos.push(evento);
        console.log(`Evento registrado: ${evento}`);
    }

    mostrarEventos(): void {
        console.log(`Historial: ${this.eventos.join(' | ')}`);
    }
}

function main(): void {
    // Dos componentes acceden al mismo objeto y comparten su historial.
    const moduloPagos = RegistroEventos.obtenerInstancia();
    moduloPagos.registrar('Pago recibido: factura F-204');

    const moduloNotificaciones = RegistroEventos.obtenerInstancia();
    moduloNotificaciones.registrar('Correo de confirmación enviado');

    console.log(`¿Comparten instancia?: ${moduloPagos === moduloNotificaciones ? 'Sí' : 'No'}`);
    moduloPagos.mostrarEventos();
}

main();
