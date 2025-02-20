import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Set {
    id: string; // ID único para cada set
    weight: string;
    reps: string;
    rir: string;
    notes?: string;
}

interface Exercise {
    id: string; // ID único para cada ejercicio
    name: string;
    sets: Set[]; // Arreglo de sets
}

interface Workout {
    id: string;
    date: string;
    name: string;
    exercises: Exercise[];
    totalTime: number;
    notes?: string;
}

interface WorkoutStore {
    workouts: Workout[];
    currentWorkout: Workout | null;
    addWorkout: (workout: Workout) => void;
    addExercise: (exercise: Omit<Exercise, 'id' | 'sets'>) => void;
    addSetToExercise: (exerciseId: string) => void; // Función para añadir sets
    updateSetInExercise: (exerciseId: string, setId: string, updatedSet: Partial<Set>) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    currentWorkout: null,
    addWorkout: (workout) => set((state) => {
        const newWorkouts = [...state.workouts, workout];
        return { workouts: newWorkouts, currentWorkout: workout };
    }),
    addExercise: (exercise) => set((state) => {
        if (state.currentWorkout) {
            const updatedWorkout = {
                ...state.currentWorkout,
                exercises: [
                    ...state.currentWorkout.exercises,
                    { ...exercise, id: uuidv4(), sets: [] } // Cada ejercicio debe tener un ID único
                ],
            };
            return { currentWorkout: updatedWorkout };
        }
        return state;
    }),
    addSetToExercise: (exerciseId: string) => set((state) => {
        if (state.currentWorkout) {
            const updatedExercises = state.currentWorkout.exercises.map((exercise) => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        sets: [
                            ...exercise.sets,
                            { id: uuidv4(), weight: "", reps: "", rir: "", notes: "" }, // Inicializa un nuevo set
                        ],
                    };
                }
                return exercise;
            });
            return {
                currentWorkout: {
                    ...state.currentWorkout,
                    exercises: updatedExercises,
                },
            };
        }
        return state;
    }),
    
    updateSetInExercise: (exerciseId: string, setId: string, updatedSet: Partial<Set>) => set((state) => {
        if (state.currentWorkout) {
            const updatedExercises = state.currentWorkout.exercises.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const updatedSets = exercise.sets.map((set) => {
                        if (set.id === setId) {
                            return { ...set, ...updatedSet }; // Actualiza los campos que han cambiado
                        }
                        return set;
                    });
                    return { ...exercise, sets: updatedSets };
                }
                return exercise;
            });
            return {
                currentWorkout: {
                    ...state.currentWorkout,
                    exercises: updatedExercises,
                },
            };
        }
        return state;
    }),
}));