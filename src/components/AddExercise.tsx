import { useState, useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";

const AddExercise = () => {
    const { currentWorkout, addExercise } = useWorkoutStore();
    const [exerciseName, setExerciseName] = useState("");

    const handleAddExercise = () => {
        if (!currentWorkout || !exerciseName.trim()) return; // Asegúrate de que hay un workout actual y nombre de ejercicio
        const formatedName = exerciseName.toLowerCase()

        addExercise({
            name: formatedName
            
           
        });

        // Limpiar el campo después de añadir
        setExerciseName("");
    };

    // useEffect(() => {
    //   console.log(currentWorkout)
    
   
    // }, [currentWorkout])
    

    return (
        <div className="flex flex-col items-center gap-4 mt-4 w-full">
            <h4>Añadir Ejercicio</h4>
            <input
                className="w-2/4 placeholder:text-center"
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Nombre del ejercicio"
            />
            <button className="rojo-oscuro p-3 rounded-sm" onClick={handleAddExercise}>Añadir</button>
        </div>
    );
};

export default AddExercise;
