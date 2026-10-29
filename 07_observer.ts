/**
 * ! Patrón Observer:
 * Define una dependencia de uno a muchos entre objetos, de modo que cuando
 * un objeto (Subject) cambia su estado, todos sus dependientes (Observers)
 * son notificados y actualizados de forma automática y desacoplada.
 *
 * En este ejemplo se implementa un sistema de telemetría y monitoreo de signos
 * vitales para una Unidad de Cuidados Intensivos (UCI). Un monitor médico
 * registra las lecturas de los pacientes y notifica a varios subsistemas
 * (pantalla de enfermería, alarma de emergencia sonora y registro clínico).
 * El patrón es adecuado porque permite que nuevos receptores se conecten o
 * desconecten dinámicamente; sin Observer, el monitor tendría dependencias
 * rígidas hacia cada pantalla, alarma o base de datos, violando el principio
 * Open/Closed y haciendo el código hospitalario frágil ante cambios.
 */

// Observer: interfaz común para todos los suscriptores interesados en los signos vitales.
interface ObservadorUCI {
    actualizar(nombrePaciente: string, ritmoCardiaco: number, saturacionOxigeno: number): void;
}

// Subject: mantiene la lista de observadores y les notifica cualquier cambio en las constantes vitales.
class MonitorSignosVitales {
    private observadores: ObservadorUCI[] = [];
    private nombrePaciente: string;
    private ritmoCardiaco = 0;
    private saturacionOxigeno = 0;

    constructor(nombrePaciente: string) {
        this.nombrePaciente = nombrePaciente;
    }

    suscribir(observador: ObservadorUCI): void {
        this.observadores.push(observador);
        console.log(`[Monitor] Observador suscrito exitosamente.`);
    }

    desuscribir(observador: ObservadorUCI): void {
        const indice = this.observadores.indexOf(observador);
        if (indice !== -1) {
            this.observadores.splice(indice, 1);
            console.log(`[Monitor] Observador retirado.`);
        }
    }

    notificar(): void {
        for (const observador of this.observadores) {
            observador.actualizar(this.nombrePaciente, this.ritmoCardiaco, this.saturacionOxigeno);
        }
    }

    cambiarLectura(ritmoCardiaco: number, saturacionOxigeno: number): void {
        console.log(`\n>>> [Sensor] Nueva lectura para ${this.nombrePaciente}: ` +
                    `${ritmoCardiaco} LPM | SpO2: ${saturacionOxigeno}% <<<`);
        this.ritmoCardiaco = ritmoCardiaco;
        this.saturacionOxigeno = saturacionOxigeno;
        this.notificar();
    }
}

// Concrete Observer 1: muestra en pantalla los signos vitales para el personal médico.
class PanelEstacionEnfermeria implements ObservadorUCI {
    actualizar(nombrePaciente: string, ritmoCardiaco: number, saturacionOxigeno: number): void {
        console.log(`  [Panel Enfermería] Paciente: ${nombrePaciente} | Pulso: ${ritmoCardiaco} LPM | Saturación: ${saturacionOxigeno}%`);
    }
}

// Concrete Observer 2: evalúa umbrales de riesgo y dispara sirenas si hay valores críticos.
class AlarmaEmergenciaUCI implements ObservadorUCI {
    actualizar(nombrePaciente: string, ritmoCardiaco: number, saturacionOxigeno: number): void {
        const ritmoPeligroso = ritmoCardiaco < 50 || ritmoCardiaco > 120;
        const oxigenoPeligroso = saturacionOxigeno < 90;

        if (ritmoPeligroso || oxigenoPeligroso) {
            console.log(`  🚨 [ALARMA SONORA UCI] ¡ALERTA CRÍTICA en paciente ${nombrePaciente}! ` +
                        `Valores fuera de rango seguro.`);
        } else {
            console.log(`  [Alarma UCI] Parámetros dentro del rango tolerable.`);
        }
    }
}

// Concrete Observer 3: persiste las mediciones en la historia clínica electrónica del hospital.
class RegistroHistorialClinico implements ObservadorUCI {
    actualizar(nombrePaciente: string, ritmoCardiaco: number, saturacionOxigeno: number): void {
        const marcaTiempo = new Date().toISOString();
        console.log(`  [Historial Clínico] ${marcaTiempo} - Guardado en expediente de ${nombrePaciente}: ` +
                    `FC=${ritmoCardiaco}, SpO2=${saturacionOxigeno}%`);
    }
}

function main(): void {
    console.log('=== SISTEMA DE TELEMETRÍA UCI (PATRÓN OBSERVER) ===');

    const monitor = new MonitorSignosVitales('Carlos Restrepo (Cama 04)');

    const panel = new PanelEstacionEnfermeria();
    const alarma = new AlarmaEmergenciaUCI();
    const historial = new RegistroHistorialClinico();

    // Suscripción de observadores
    monitor.suscribir(panel);
    monitor.suscribir(alarma);
    monitor.suscribir(historial);

    // Caso 1: lectura estable
    monitor.cambiarLectura(75, 98);

    // Caso 2: lectura con valores de emergencia
    monitor.cambiarLectura(135, 87);

    // Demostración de desuscripción dinámica
    console.log('\n--- Retirando alarma sonora por mantenimiento técnico ---');
    monitor.desuscribir(alarma);

    // Caso 3: nueva lectura sin la alarma sonora activa
    monitor.cambiarLectura(80, 97);
}

main();
