import { useState } from "react";
import { useWorkoutStore } from "../store/workoutStore";

const Exercises = () => {
    const { currentWorkout, addSetToExercise, updateSetInExercise } = useWorkoutStore();
    const [visibleExerciseId, setVisibleExerciseId] = useState<string | null>(null); // Estado para controlar qué ejercicio está visible

    const handleExerciseClick = (exerciseId: string) => {
        // Alterna la visibilidad del ejercicio clickeado
        setVisibleExerciseId(visibleExerciseId === exerciseId ? null : exerciseId);
    };

    const handleInputChange = (exerciseId: string, setId: string, field: string, value: string | number) => {
        // Actualiza los datos del set en el store
        updateSetInExercise(exerciseId, setId, { [field]: value });
    };

    return (
        <div className="flex flex-col items-center">
            <h4>Ejercicios del Workout Actual</h4>
            {currentWorkout ? (
                <ul>
                    {currentWorkout.exercises.map((exercise) => (
                        <li className="flex flex-row" key={exercise.id}>
                            <div onClick={() => handleExerciseClick(exercise.id)}>
                                {exercise.name}
                            </div>
                            {visibleExerciseId === exercise.id && (
                                <ul>
                                    {exercise.sets.map((set) => (
                                        <li key={set.id}>
                                            <input
                                                type="number"
                                                value={set.reps}
                                                onChange={(e) => handleInputChange(exercise.id, set.id, 'reps', Number(e.target.value))}
                                                placeholder="Reps"
                                            />
                                            <input
                                                type="number"
                                                value={set.weight}
                                                onChange={(e) => handleInputChange(exercise.id, set.id, 'weight', Number(e.target.value))}
                                                placeholder="Peso"
                                            />
                                            <input
                                                type="number"
                                                value={set.rir}
                                                onChange={(e) => handleInputChange(exercise.id, set.id, 'rir', Number(e.target.value))}
                                                placeholder="RIR"
                                            />
                                            <input
                                                type="text"
                                                value={set.notes}
                                                onChange={(e) => handleInputChange(exercise.id, set.id, 'notes', e.target.value)}
                                                placeholder="Notas"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button className="text-2xl" onClick={() => addSetToExercise(exercise.id)}>+</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay un workout actual.</p>
            )}
        </div>
    );
};

export default Exercises;
