export type  Workout = {
    userId: string;
    id: string;
    date: string;
    name: string;
    exercises: Exercise[];
    totalTime: number;
    notes?: string;
}

export type Exercise = {
    id: string; // ID único para cada ejercicio
    name: string;
    sets: Set[]; // Arreglo de sets
}

export type Set = {
    id: string; // ID único para cada set
    weight: string;
    reps: string;
    rir: string;
    notes?: string;
}

export type Template = {
    id: string;
    name: string;
    userId: string;
    description: string;
    exercises: Exercise[];
}