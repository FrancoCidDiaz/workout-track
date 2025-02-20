interface Exercise {
    name: string; // Nombre del ejercicio (Ej: "Press Banca")
    weight: number; // Peso usado en kg
    reps: number; // Repeticiones realizadas
    rir: number; // Repeticiones en reserva
    notes?: string; // Notas opcionales
    sets: number; // Cantidad de series realizadas
  }
  
  interface Workout {
    date: string; // Fecha en formato ISO (Ej: "2024-02-19T15:30:00Z")
    name: string; // Nombre del entrenamiento (Ej: "Día de Push")
    exercises: Exercise[]; // Lista de ejercicios
    totalTime: number;
    notes?: string; // Tiempo total del entrenamiento en minutos
  }