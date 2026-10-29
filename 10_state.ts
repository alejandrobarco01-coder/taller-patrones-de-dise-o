/**
 * ! Patrón State:
 * Permite a un objeto alterar su comportamiento cuando su estado interno cambia.
 * El objeto parecerá haber cambiado de clase, encapsulando las reglas de cada
 * estado en clases independientes.
 *
 * En este ejemplo se modela el flujo de evaluación de una solicitud de crédito
 * bancario. La solicitud transita por diversos estados: Borrador, En Revisión,
 * Aprobado, Desembolsado y Rechazado. El patrón es adecuado porque cada estado
 * impone reglas estrictas sobre qué acciones están permitidas (por ejemplo, no
 * se puede desembolsar en borrador, ni modificar documentos durante la revisión);
 * sin State, la clase Solicitud tendría múltiples sentencias condicionales (if/switch)
 * duplicadas en cada método, haciendo el código propenso a inconsistencias financieras.
 */

// State: interfaz que define las operaciones posibles en cualquier fase de la solicitud.
interface EstadoCredito {
    readonly nombre: string;
    adjuntarDocumento(solicitud: SolicitudCredito, documento: string): void;
    solicitarRevision(solicitud: SolicitudCredito): void;
    aprobar(solicitud: SolicitudCredito): void;
    rechazar(solicitud: SolicitudCredito, motivo: string): void;
    desembolsar(solicitud: SolicitudCredito): void;
}

// Context: mantiene la información del crédito y delega el comportamiento al estado actual.
class SolicitudCredito {
    readonly radicado: string;
    readonly titular: string;
    readonly monto: number;
    private documentos: string[] = [];
    private estado: EstadoCredito;

    constructor(radicado: string, titular: string, monto: number) {
        this.radicado = radicado;
        this.titular = titular;
        this.monto = monto;
        // Estado inicial
        this.estado = new EstadoBorrador();
        console.log(`[Solicitud ${this.radicado}] Creada para ${this.titular} por $${this.monto.toLocaleString('es-CO')}. Estado: ${this.estado.nombre}`);
    }

    cambiarEstado(nuevoEstado: EstadoCredito): void {
        console.log(`  🔄 [Transición] De (${this.estado.nombre}) -> (${nuevoEstado.nombre})`);
        this.estado = nuevoEstado;
    }

    agregarDocumentoInterno(doc: string): void {
        this.documentos.push(doc);
    }

    obtenerDocumentos(): string[] {
        return [...this.documentos];
    }

    // Métodos delegados al estado activo
    adjuntarDocumento(doc: string): void {
        this.estado.adjuntarDocumento(this, doc);
    }

    solicitarRevision(): void {
        this.estado.solicitarRevision(this);
    }

    aprobar(): void {
        this.estado.aprobar(this);
    }

    rechazar(motivo: string): void {
        this.estado.rechazar(this, motivo);
    }

    desembolsar(): void {
        this.estado.desembolsar(this);
    }

    mostrarEstado(): void {
        console.log(`\n>> Solicitud ${this.radicado} | Estado actual: [${this.estado.nombre}] | Documentos: ${this.documentos.join(', ') || 'Ninguno'}`);
    }
}

// Concrete State 1: permite adjuntar soportes y solicitar revisión cuando los requisitos estén listos.
class EstadoBorrador implements EstadoCredito {
    readonly nombre = 'Borrador';

    adjuntarDocumento(solicitud: SolicitudCredito, documento: string): void {
        solicitud.agregarDocumentoInterno(documento);
        console.log(`  📄 Documento adjuntado: "${documento}"`);
    }

    solicitarRevision(solicitud: SolicitudCredito): void {
        if (solicitud.obtenerDocumentos().length === 0) {
            console.log(`  ⚠️ No se puede enviar a revisión sin al menos un documento soporte.`);
            return;
        }
        console.log(`  📤 Solicitud enviada al comité de riesgos.`);
        solicitud.cambiarEstado(new EstadoEnRevision());
    }

    aprobar(): void {
        console.log(`  ⛔ Acción denegada: Una solicitud en borrador no puede ser aprobada directamente.`);
    }

    rechazar(): void {
        console.log(`  ⛔ Acción denegada: No se puede rechazar una solicitud aún no radicada.`);
    }

    desembolsar(): void {
        console.log(`  ⛔ Acción denegada: Imposible desembolsar una solicitud en borrador.`);
    }
}

// Concrete State 2: en análisis de crédito; no se permiten cambios en documentos.
class EstadoEnRevision implements EstadoCredito {
    readonly nombre = 'En Revisión';

    adjuntarDocumento(_solicitud: SolicitudCredito, _documento: string): void {
        console.log(`  ⛔ Documentos bloqueados: El expediente está congelado durante la auditoría.`);
    }

    solicitarRevision(): void {
        console.log(`  ℹ️ La solicitud ya se encuentra en proceso de evaluación.`);
    }

    aprobar(solicitud: SolicitudCredito): void {
        console.log(`  ✅ Capacidad de pago validada. Solicitud pre-aprobada por el comité.`);
        solicitud.cambiarEstado(new EstadoAprobado());
    }

    rechazar(solicitud: SolicitudCredito, motivo: string): void {
        console.log(`  ❌ Crédito denegado por riesgo financiero: ${motivo}`);
        solicitud.cambiarEstado(new EstadoRechazado(motivo));
    }

    desembolsar(): void {
        console.log(`  ⛔ Acción denegada: Requiere dictamen de aprobación antes de transferir fondos.`);
    }
}

// Concrete State 3: aprobado; listo para girar los fondos.
class EstadoAprobado implements EstadoCredito {
    readonly nombre = 'Aprobado';

    adjuntarDocumento(): void {
        console.log(`  ℹ️ Trámite concluido: no se requieren más documentos.`);
    }

    solicitarRevision(): void {
        console.log(`  ℹ️ El crédito ya fue aprobado.`);
    }

    aprobar(): void {
        console.log(`  ℹ️ La solicitud ya cuenta con visto bueno.`);
    }

    rechazar(solicitud: SolicitudCredito, motivo: string): void {
        console.log(`  ⚠️ Cancelación extraordinaria antes de desembolso: ${motivo}`);
        solicitud.cambiarEstado(new EstadoRechazado(motivo));
    }

    desembolsar(solicitud: SolicitudCredito): void {
        console.log(`  💰 Desembolso efectuado por $${solicitud.monto.toLocaleString('es-CO')} a la cuenta del titular.`);
        solicitud.cambiarEstado(new EstadoDesembolsado());
    }
}

// Concrete State 4: estado final exitoso; fondos entregados.
class EstadoDesembolsado implements EstadoCredito {
    readonly nombre = 'Desembolsado';

    adjuntarDocumento(): void {
        console.log(`  ⛔ Crédito finalizado: no admite modificaciones.`);
    }

    solicitarRevision(): void {
        console.log(`  ⛔ Operación no válida: el crédito ya fue desembolsado.`);
    }

    aprobar(): void {
        console.log(`  ⛔ Operación no válida: proceso concluido exitosamente.`);
    }

    rechazar(): void {
        console.log(`  ⛔ Operación no válida: el dinero ya fue transferido.`);
    }

    desembolsar(): void {
        console.log(`  ⚠️ Advertencia: este crédito ya fue desembolsado previamente.`);
    }
}

// Concrete State 5: estado final no exitoso.
class EstadoRechazado implements EstadoCredito {
    readonly nombre = 'Rechazado';
    private motivo: string;

    constructor(motivo: string) {
        this.motivo = motivo;
    }

    adjuntarDocumento(): void {
        console.log(`  ⛔ Solicitud archivada: no acepta documentos.`);
    }

    solicitarRevision(): void {
        console.log(`  ⛔ Solicitud archivada por motivo: "${this.motivo}".`);
    }

    aprobar(): void {
        console.log(`  ⛔ No es posible aprobar una solicitud formalmente rechazada.`);
    }

    rechazar(): void {
        console.log(`  ℹ️ Ya se encuentra en estado rechazado.`);
    }

    desembolsar(): void {
        console.log(`  ⛔ Denegado: nunca se desembolsa una solicitud rechazada.`);
    }
}

function main(): void {
    console.log('=== FLUJO DE SOLICITUD DE CRÉDITO BANCARIO (PATRÓN STATE) ===\n');

    const credito = new SolicitudCredito('CRE-7749', 'Andrés David Perea', 15000000);

    // 1. Intentar desembolsar en borrador (acción inválida según el estado)
    console.log('\n--- Intento 1: Desembolsar prematuramente ---');
    credito.desembolsar();

    // 2. Adjuntar requisitos
    console.log('\n--- Paso 2: Adjuntar documentación ---');
    credito.adjuntarDocumento('Cédula de ciudadanía');
    credito.adjuntarDocumento('Certificado laboral y de ingresos');

    // 3. Enviar a revisión
    console.log('\n--- Paso 3: Radicar para estudio ---');
    credito.solicitarRevision();

    // 4. Intentar modificar documentos mientras se audita (bloqueado por EstadoEnRevision)
    console.log('\n--- Intento 4: Agregar documento en medio de revisión ---');
    credito.adjuntarDocumento('Extracto bancario adicional');

    // 5. Aprobación por comité de riesgo
    console.log('\n--- Paso 5: Decisión del comité ---');
    credito.aprobar();

    // 6. Desembolso final
    console.log('\n--- Paso 6: Desembolso a cuenta ---');
    credito.desembolsar();

    // 7. Intento de re-desembolso (protección de EstadoDesembolsado)
    console.log('\n--- Intento 7: Reintentar desembolso ---');
    credito.desembolsar();

    credito.mostrarEstado();
}

main();
