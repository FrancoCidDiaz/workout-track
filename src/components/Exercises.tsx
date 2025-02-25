import { useState } from "react";
import { useWorkoutStore } from "../store/workoutStore";

const Exercises = () => {
    const { currentWorkout, addSetToExercise, updateSetInExercise } = useWorkoutStore();
    const [visibleExerciseId, setVisibleExerciseId] = useState<string | null>(null);

    const handleExerciseClick = (exerciseId: string) => {
        setVisibleExerciseId(visibleExerciseId === exerciseId ? null : exerciseId);
    };

    const handleInputChange = (exerciseId: string, setId: string, field: string, value: string | number) => {
        updateSetInExercise(exerciseId, setId, { [field]: value });
    };

    return (
        <div className="flex flex-col items-center w-full mt-2">
            <h4>Entrenamiento Actual:</h4>
            {currentWorkout ? (
                <ul className="w-9/10 flex flex-col items-center mt-2">
                    {currentWorkout.exercises.map((exercise) => (
                        <li className="w-full flex flex-col items-center mb-4 p-2 border rounded-lg" key={exercise.id}>
                            {/* Nombre del ejercicio, cantidad de sets y botón + */}
                            <div 
                                className="flex items-center justify-center w-full cursor-pointer gap-3" 
                                onClick={() => handleExerciseClick(exercise.id)}
                            >
                                <h5 className="text-lg font-bold">{exercise.name}</h5>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Sets: {exercise.sets.length}</span>
                                    <button className="text-2xl" onClick={(e) => {
                                        e.stopPropagation();
                                        addSetToExercise(exercise.id);
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Contenedor de los sets con animación */}
                            <ul className={`grid grid-cols-1 gap-2 w-full mt-2 transition-all duration-300 overflow-hidden 
                                ${visibleExerciseId === exercise.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                {exercise.sets.map((set) => (
                                    <li key={set.id} className="flex gap-2 justify-center w-full">
                                        <input
                                            className="w-1/5 p-1 border rounded"
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) => handleInputChange(exercise.id, set.id, 'reps', Number(e.target.value))}
                                            placeholder="Reps"
                                        />
                                        <input
                                            className="w-1/5 p-1 border rounded"
                                            type="number"
                                            value={set.weight}
                                            onChange={(e) => handleInputChange(exercise.id, set.id, 'weight', Number(e.target.value))}
                                            placeholder="Peso"
                                        />
                                        <input
                                            className="w-1/5 p-1 border rounded"
                                            type="number"
                                            value={set.rir}
                                            onChange={(e) => handleInputChange(exercise.id, set.id, 'rir', Number(e.target.value))}
                                            placeholder="RIR"
                                        />
                                        <input
                                            className="w-1/4 p-1 border rounded"
                                            type="text"
                                            value={set.notes}
                                            onChange={(e) => handleInputChange(exercise.id, set.id, 'notes', e.target.value)}
                                            placeholder="Notas"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay un entrenamiento actual.</p>
            )}
        </div>
    );
};

export default Exercises;
