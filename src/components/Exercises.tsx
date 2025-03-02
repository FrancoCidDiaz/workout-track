import { useState, useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";
import { useTemplateStore } from "../store/templateStore";
import { useAuthStore } from "../store/authStore";
import { convertTemplateToWorkout } from "../hooks/convertTemplateToWorkout";

const Exercises = () => {
    const { currentWorkout, addSetToExercise, updateSetInExercise, deleteSetToExercise, fetchWorkouts, updateCurrentWorkout} = useWorkoutStore();
    const { user } = useAuthStore()
    const { selectedTemplate } = useTemplateStore();
    const [visibleExerciseId, setVisibleExerciseId] = useState<string | null>(null);
    const [compareExerciseList, setCompareExerciseList] = useState([])


    useEffect(() => {
        if (selectedTemplate) {
          const convertedTemplate = convertTemplateToWorkout(selectedTemplate)
          console.log("convertedtemplate:", convertedTemplate)
          updateCurrentWorkout(convertedTemplate);
        }
      }, [selectedTemplate]);
    
    // Utiliza el selectedTemplate si está disponible
    const exercises = currentWorkout?.exercises || [];




    useEffect(() => {
      console.log("selected template desde exercises:", selectedTemplate)
    }, [selectedTemplate])

    useEffect(() => {
     console.log("current workout desde exercises:", currentWorkout)
    }, [currentWorkout])
    
    

    

    const handleExerciseClick = (exerciseId: string) => {
        setVisibleExerciseId(visibleExerciseId === exerciseId ? null : exerciseId);
    };

    const handleInputChange = (exerciseId: string, setId: string, field: string, value: string | number) => {
        updateSetInExercise(exerciseId, setId, { [field]: value });
    };

    const handleCompareExercise = async (exerciseName: string) => {
        const workouts = await fetchWorkouts(user?.uid);
    
        // Filtra los ejercicios que coincidan con el nombre
        const filteredExercises = workouts.flatMap((workout) =>
            workout.exercises
                .filter((exercise) => exercise.name === exerciseName)
                .map((exercise) => ({
                    ...exercise,
                    workoutDate: workout.date,
                    workoutName: workout.name 
                }))
        );
    
        setCompareExerciseList(filteredExercises);
        console.log(compareExerciseList);
    };

    return (
        <div className="flex flex-col items-center w-full mt-2">
            <h4>Entrenamiento Actual:</h4>
            
            {exercises.length > 0 ? (
                <ul className="w-9/10 flex flex-col items-center mt-2">
                    {exercises.map((exercise) => (
                        <li className="w-full flex flex-col items-center mb-4 p-2 border rounded-lg" key={exercise.id}>
                            {/* Nombre del ejercicio, cantidad de sets y botón + */}
                            <div 
                                className="flex items-center justify-center w-full cursor-pointer gap-4" 
                                onClick={() => handleExerciseClick(exercise.id)}
                            >
                                <h5 className="text-lg font-bold">{exercise.name}</h5>
                                <button onClick={() => handleCompareExercise(exercise.name)}>Comparar rendimiento</button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Sets: {exercise.sets.length}</span>
                                    <button className="text-2xl" onClick={(e) => {
                                        e.stopPropagation();
                                        addSetToExercise(exercise.id);  // Cambié `exercise.name` a `exercise.id`
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                    <button className="text-2xl" onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSetToExercise(exercise.id);  // Cambié `exercise.name` a `exercise.id`
                                    }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                         </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Contenedor de los sets con animación */}
                            <ul className={`grid grid-cols-1 gap-2 w-full mt-2 transition-all duration-300 overflow-hidden 
                                ${visibleExerciseId === exercise.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                {exercise.sets.map((set, index) => (
                                    <li key={index} className="flex gap-2 justify-center w-full">
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
                <p>No hay ejercicios disponibles.</p>
            )}
        </div>
    );
};


export default Exercises;
