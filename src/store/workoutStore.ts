import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../store/authStore";





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
    userId: string;
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
    addSetToExercise: (exerciseId: string) => void;
    updateSetInExercise: (exerciseId: string, setId: string, updatedSet: Partial<Set>) => void;
    saveWorkout: (notes: string) => void;
    fetchWorkouts: (userId: string) => Promise<void>;
}






export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    currentWorkout: null,
    fetchWorkouts: async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/workouts?userId=${userId}`);
            if (!response.ok) throw new Error("Error al obtener workouts");
            const workouts = await response.json();
            set({ workouts });
            return workouts; // Retornar los workouts obtenidos
        } catch (error) {
            console.error("Error fetching workouts:", error);
            return []; // Retornar array vacío en caso de error
        }
    },
    addWorkout: (workout) => set((state) => {
        const userId = useAuthStore.getState().user?.uid || "";
        const newWorkouts = [...state.workouts, { ...workout, userId }];
        console.log(newWorkouts)
        return { workouts: newWorkouts, currentWorkout: { ...workout, userId } };
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
    saveWorkout: async (notes: string) => {
        const { currentWorkout } = useWorkoutStore.getState();
        if (!currentWorkout) return;
    
        const workoutData = {
            userId: currentWorkout.userId,
            name: currentWorkout.name,
            date: currentWorkout.date,
            totalTime: currentWorkout.totalTime,
            notes: notes,
            exercises: currentWorkout.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets.map((set) => ({
                    weight: parseFloat(set.weight),
                    reps: parseInt(set.reps),
                    rir: parseInt(set.rir),
                    notes: set.notes || "",
                })),
            })),
        };
    
        try {
            const response = await fetch("http://localhost:3001/api/workouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workoutData),
            });
    
            if (!response.ok) {
                throw new Error("Error al guardar el workout");
            }
    
            console.log("Workout guardado exitosamente");
            set({ currentWorkout: null });
        } catch (error) {
            console.error("Error al guardar el workout:", error);
        }
    
    },
}));
