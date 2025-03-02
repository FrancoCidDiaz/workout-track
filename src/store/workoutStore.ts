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
    deleteSetToExercise: (exerciseId: string) => void;
    updateSetInExercise: (exerciseId: string, setId: string, updatedSet: Partial<Set>) => void;
    saveWorkout: (notes: string) => void;
    fetchWorkouts: (userId: string) => Promise<void>;
    updateCurrentWorkout: (workout: Workout) => void;
    clearCurrentWorkout: () => void;
}






export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    currentWorkout: JSON.parse(localStorage.getItem("currentWorkout") || "null"),
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
        //console.log(newWorkouts)
        const newWorkout =  { ...workout, userId }
        console.log("new workout desde addWorkout", newWorkout)
        localStorage.setItem("currentWorkout", JSON.stringify(newWorkout));
        //return {  currentWorkout: { ...workout, userId } };
        return { workouts: newWorkouts, currentWorkout: { ...workout, userId } };
    }),
    updateCurrentWorkout: (workout: Partial<Workout>) => set((state) => {
        if (state.currentWorkout) {
            const updatedWorkout = {
                ...state.currentWorkout,
                ...workout, // Actualiza los campos del workout con los nuevos valores
            };
            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
            return { currentWorkout: updatedWorkout };
        }
        return state;
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
            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
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
            const updatedWorkout = {
                ...state.currentWorkout,
                exercises: updatedExercises,
            };
            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout)); // Actualiza localStorage
            return { currentWorkout: updatedWorkout };
        }
        return state;
    }),
    deleteSetToExercise: (exerciseId: string) => set((state) => {
        if (state.currentWorkout) {
            const updatedExercises = state.currentWorkout.exercises.map((exercise) => {
                if (exercise.id === exerciseId) {
                    // Verifica que el ejercicio tenga sets antes de intentar eliminar uno
                    if (exercise.sets.length > 0) {
                        return {
                            ...exercise,
                            sets: exercise.sets.slice(0, -1), // Elimina el último set
                        };
                    }
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
            const updatedWorkout = {
                ...state.currentWorkout,
                exercises: updatedExercises
            };
            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
            return {
                currentWorkout: {
                    ...state.currentWorkout,
                    exercises: updatedExercises,
                },
            };
        }
        return state;
    }),
    clearCurrentWorkout: () => {
        localStorage.removeItem("currentWorkout"); // Elimina el currentWorkout del localStorage
        set({ currentWorkout: null }); // Limpia el estado
    },

    saveWorkout: async (notes: string) => {
        const { currentWorkout } = useWorkoutStore.getState();
        if (!currentWorkout) return;
       
        const workoutData = {
            id: currentWorkout.id,
            userId: currentWorkout.userId,
            name: currentWorkout.name,
            date: currentWorkout.date,
            totalTime: currentWorkout.totalTime,
            notes: notes,
            exercises: currentWorkout.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets.map((set) => ({
                    weight: set.weight,
                    reps: set.reps,
                    rir: set.rir,
                    notes: set.notes || "",
                })),
            })),
        };
        
    
        console.log("Datos enviados al servidor:", workoutData); // Depuración
    
        try {
            const response = await fetch("http://localhost:3001/api/workouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workoutData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar el workout");
            }
    
            const savedWorkout = await response.json();
            console.log("Workout guardado exitosamente:", savedWorkout); // Depuración
    
            set((state) => ({
                workouts: [...state.workouts, savedWorkout],
                currentWorkout: null,
            }));
        } catch (error) {
            console.error("Error al guardar el workout:", error); // Depuración
        }
    },
}));
