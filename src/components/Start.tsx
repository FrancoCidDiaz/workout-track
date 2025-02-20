import { useState, useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";
import { v4 as uuidv4 } from "uuid";

const Start = () => {
    const { workouts, currentWorkout, addWorkout } = useWorkoutStore();
    const [name, setName] = useState("");

    const handleAddWorkout = () => {
        if (!name.trim()) return; // Evitar workouts sin nombre

        addWorkout({
            id: uuidv4(), // Generar un ID único
            date: new Date().toISOString(),
            name: name, // El nombre ingresado por el usuario
            exercises: [],
            totalTime: 0,
            notes: "",
        });

        setName(""); // Limpiar el input después de añadir
    };

    // useEffect para registrar cambios en workouts
    useEffect(() => {
        console.log(workouts);
    }, [workouts]); // Agrega el cierre correcto del array de dependencias

    return (
        <div className="flex flex-col items-center w-full gap-4">
            <h3 className="text-4xl p-4 text-center">Qué entrenarás hoy?</h3>
            <input
                className="w-1/6"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del entrenamiento"
            />
            <button className="rojo-oscuro p-3 rounded-sm" onClick={handleAddWorkout}>Empezar!</button>

            {/* Mostrar el nombre del workout actual */}
            {currentWorkout && (
                <div>
                    <h4>Workout Actual: {currentWorkout.name}</h4>
                </div>
            )}
        </div>
    );
};

export default Start;
