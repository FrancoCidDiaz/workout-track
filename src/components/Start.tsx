import { useState, useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";

const Start = () => {
    const { workouts, currentWorkout, addWorkout } = useWorkoutStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate()

    const [name, setName] = useState("");

    const onLogout = async () => {
        await logout
        navigate("/")
    }

    

    const handleAddWorkout = () => {
        if (!name.trim()) return; // Evitar workouts sin nombre

        const formattedDate = new Date().toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Para formato 24 horas
        });

        addWorkout({
            id: uuidv4(), // Generar un ID único
            date: formattedDate,
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


    useEffect(() => {
      console.log("usuario:", user)
    }, [user])
    
    return (


        <div className="flex flex-col items-center justify-items-center w-full gap-4">
           

          {user? (
             <div className="flex flex-col items-center justify-items-center gap-2">
             <img src={user.photoURL}  width={50} />
             <p>{user.displayName}</p>
             <button className="rojo-oscuro p-3 rounded-sm" onClick={onLogout}>Cerrar sesión</button>
         </div>
          ): (null)}

           
            <h3 className="text-4xl p-2 text-center">Qué entrenarás hoy?</h3>
            <input
                className="w-2/4 placeholder:text-center"
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
