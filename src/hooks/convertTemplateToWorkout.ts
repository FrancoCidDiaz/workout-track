import { v4 as uuidv4 } from "uuid";
import { Template, Workout } from "../../types";

export const convertTemplateToWorkout = (template: Template): Workout => {
    return {
        id: uuidv4(), // Genera un nuevo ID para el workout
        userId: template.userId,
        name: template.name,
        date: new Date().toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }),
        totalTime: 0, // Valor por defecto
        notes: "", // Valor por defecto
        exercises: template.exercises.map((exercise) => ({
            id: uuidv4(), // Genera un nuevo ID para cada ejercicio
            name: exercise.name,
            sets: exercise.sets.map((set) => ({
                id: uuidv4(), // Genera un nuevo ID para cada set
                weight: set.weight?.toString() || "0", // Convierte a string
                reps: set.reps?.toString() || "0", // Convierte a string
                rir: set.rir?.toString() || "0", // Convierte a string
                notes: set.notes || "",
            })),
        })),
    };
};