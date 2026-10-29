/**
 * ! Patrón Command:
 * Encapsula una solicitud como un objeto independiente, permitiendo parametrizar
 * a los clientes con distintas solicitudes, encolar o registrar operaciones y
 * soportar operaciones reversibles (deshacer / undo).
 *
 * En este ejemplo se implementa un gestor de transacciones para cuentas bancarias.
 * Las operaciones financieras (depósitos, retiros y transferencias) se encapsulan
 * como comandos con su respectiva lógica de reversión. El patrón es adecuado
 * porque desacopla el emisor de la orden (cajero/aplicación móvil) del receptor que
 * ejecuta los cambios contables (la cuenta bancaria); sin Command, el cajero
 * modificaría saldos directamente, imposibilitando auditar transacciones o deshacer
 * errores de digitación de forma limpia y segura.
 */

// Command: interfaz que define la ejecución, reversión y descripción de cada operación.
interface ComandoBancario {
    ejecutar(): boolean;
    deshacer(): void;
    obtenerDetalle(): string;
}

// Receiver: contiene la lógica contable del negocio y el estado real del saldo.
class CuentaBancaria {
    readonly numeroCuenta: string;
    readonly titular: string;
    private saldo: number;

    constructor(numeroCuenta: string, titular: string, saldoInicial: number) {
        this.numeroCuenta = numeroCuenta;
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    depositar(monto: number): void {
        this.saldo += monto;
        console.log(`  [Cuenta ${this.numeroCuenta}] Depósito de $${monto.toLocaleString('es-CO')}. Nuevo saldo: $${this.saldo.toLocaleString('es-CO')}`);
    }

    retirar(monto: number): boolean {
        if (monto > this.saldo) {
            console.log(`  ❌ [Cuenta ${this.numeroCuenta}] Fondos insuficientes para retirar $${monto.toLocaleString('es-CO')} (Saldo actual: $${this.saldo.toLocaleString('es-CO')})`);
            return false;
        }
        this.saldo -= monto;
        console.log(`  [Cuenta ${this.numeroCuenta}] Retiro de $${monto.toLocaleString('es-CO')}. Nuevo saldo: $${this.saldo.toLocaleString('es-CO')}`);
        return true;
    }

    obtenerSaldo(): number {
        return this.saldo;
    }
}

// Concrete Command 1: encapsula un depósito monetario y su respectiva reversión.
class ComandoDeposito implements ComandoBancario {
    private cuenta: CuentaBancaria;
    private monto: number;
    private ejecutado = false;

    constructor(cuenta: CuentaBancaria, monto: number) {
        this.cuenta = cuenta;
        this.monto = monto;
    }

    ejecutar(): boolean {
        this.cuenta.depositar(this.monto);
        this.ejecutado = true;
        return true;
    }

    deshacer(): void {
        if (!this.ejecutado) return;
        console.log(`  ↩️ Reversando depósito de $${this.monto.toLocaleString('es-CO')} en cuenta ${this.cuenta.numeroCuenta}...`);
        this.cuenta.retirar(this.monto);
    }

    obtenerDetalle(): string {
        return `Depósito de $${this.monto.toLocaleString('es-CO')} en ${this.cuenta.titular} (${this.cuenta.numeroCuenta})`;
    }
}

// Concrete Command 2: encapsula un retiro con validación de fondos y reversión.
class ComandoRetiro implements ComandoBancario {
    private cuenta: CuentaBancaria;
    private monto: number;
    private ejecutado = false;

    constructor(cuenta: CuentaBancaria, monto: number) {
        this.cuenta = cuenta;
        this.monto = monto;
    }

    ejecutar(): boolean {
        const exito = this.cuenta.retirar(this.monto);
        this.ejecutado = exito;
        return exito;
    }

    deshacer(): void {
        if (!this.ejecutado) return;
        console.log(`  ↩️ Reversando retiro de $${this.monto.toLocaleString('es-CO')} en cuenta ${this.cuenta.numeroCuenta}...`);
        this.cuenta.depositar(this.monto);
    }

    obtenerDetalle(): string {
        return `Retiro de $${this.monto.toLocaleString('es-CO')} en ${this.cuenta.titular} (${this.cuenta.numeroCuenta})`;
    }
}

// Concrete Command 3: transfiere saldo entre dos cuentas con reversión coordinada.
class ComandoTransferencia implements ComandoBancario {
    private origen: CuentaBancaria;
    private destino: CuentaBancaria;
    private monto: number;
    private ejecutado = false;

    constructor(origen: CuentaBancaria, destino: CuentaBancaria, monto: number) {
        this.origen = origen;
        this.destino = destino;
        this.monto = monto;
    }

    ejecutar(): boolean {
        console.log(`  Intentando transferir $${this.monto.toLocaleString('es-CO')} de ${this.origen.numeroCuenta} a ${this.destino.numeroCuenta}...`);
        const retiroExitoso = this.origen.retirar(this.monto);
        if (retiroExitoso) {
            this.destino.depositar(this.monto);
            this.ejecutado = true;
            return true;
        }
        return false;
    }

    deshacer(): void {
        if (!this.ejecutado) return;
        console.log(`  ↩️ Reversando transferencia: debitando de ${this.destino.numeroCuenta} y acreditando a ${this.origen.numeroCuenta}...`);
        this.destino.retirar(this.monto);
        this.origen.depositar(this.monto);
    }

    obtenerDetalle(): string {
        return `Transferencia de $${this.monto.toLocaleString('es-CO')} de ${this.origen.titular} a ${this.destino.titular}`;
    }
}

// Invoker: solicita la ejecución de los comandos, mantiene la auditoría y permite deshacer operaciones.
class GestorTransaccionesBancarias {
    private historial: ComandoBancario[] = [];
    private pilaDeshacer: ComandoBancario[] = [];

    procesarComando(comando: ComandoBancario): void {
        console.log(`\n[Gestor] Procesando solicitud: "${comando.obtenerDetalle()}"`);
        const resultado = comando.ejecutar();
        if (resultado) {
            this.historial.push(comando);
            this.pilaDeshacer.push(comando);
            console.log(`[Gestor] Transacción completada y registrada en auditoría.`);
        } else {
            console.log(`[Gestor] Transacción rechazada. No se aplicaron cambios contables.`);
        }
    }

    deshacerUltimaTransaccion(): void {
        const comando = this.pilaDeshacer.pop();
        if (!comando) {
            console.log(`\n[Gestor] No hay transacciones pendientes por deshacer.`);
            return;
        }
        console.log(`\n[Gestor] Deshaciendo última transacción: "${comando.obtenerDetalle()}"`);
        comando.deshacer();
    }

    mostrarAuditoria(): void {
        console.log('\n--- HISTORIAL DE AUDITORÍA TRANSACCIONAL ---');
        this.historial.forEach((cmd, idx) => {
            console.log(`  ${idx + 1}. ${cmd.obtenerDetalle()}`);
        });
    }
}

function main(): void {
    console.log('=== SISTEMA DE TRANSACCIONES BANCARIAS (PATRÓN COMMAND) ===\n');

    const cuentaA = new CuentaBancaria('001-A', 'Andrés Perea', 200000);
    const cuentaB = new CuentaBancaria('002-B', 'Alejandro Barco', 50000);

    const gestor = new GestorTransaccionesBancarias();

    // 1. Depósito ordinario
    gestor.procesarComando(new ComandoDeposito(cuentaA, 100000));

    // 2. Transferencia entre cuentas
    gestor.procesarComando(new ComandoTransferencia(cuentaA, cuentaB, 70000));

    // 3. Intento de retiro que supera el saldo (falla controlada)
    gestor.procesarComando(new ComandoRetiro(cuentaA, 500000));

    // 4. Reversión de la última transacción exitosa (la transferencia)
    gestor.deshacerUltimaTransaccion();

    // Resumen final de auditoría y saldos
    gestor.mostrarAuditoria();

    console.log('\n--- SALDOS FINALES ---');
    console.log(`Cuenta ${cuentaA.numeroCuenta} (${cuentaA.titular}): $${cuentaA.obtenerSaldo().toLocaleString('es-CO')}`);
    console.log(`Cuenta ${cuentaB.numeroCuenta} (${cuentaB.titular}): $${cuentaB.obtenerSaldo().toLocaleString('es-CO')}`);
}

main();
