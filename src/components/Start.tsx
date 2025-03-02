import { useState, useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../store/authStore";
import { useTemplateStore } from "../store/templateStore";
import { useNavigate, Link } from "react-router";
import { convertTemplateToWorkout } from "../hooks/convertTemplateToWorkout";

const Start = () => {
    const { currentWorkout, addWorkout } = useWorkoutStore();
    const { selectedTemplate } = useTemplateStore()
    const { user, logout } = useAuthStore();
    const navigate = useNavigate()

    const [name, setName] = useState("");

    const onLogout = async () => {
        await logout
        navigate("/")
    }

   

    useEffect(() => {
      if(selectedTemplate) {
        const convertedTemplate = convertTemplateToWorkout(selectedTemplate)
        addWorkout(convertedTemplate)
      }
    }, [])
    
    

    

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
  


   
    
    return (


        <div className="flex flex-col items-center justify-items-center w-full gap-4">
           

          {user? (
             <div className="flex flex-col items-center justify-items-center gap-2">
             <img src={user.photoURL}  width={50} />
             <p>{user.displayName}</p>
             <button className="rojo-oscuro p-3 rounded-sm" onClick={onLogout}>Cerrar sesión</button>
         </div>
          ): (null)}
             <div className="flex flex-row gap-3">
              <Link className="rojo-oscuro p-3 rounded-sm" to="/add-templates">Añadir Templates</Link>
              <Link className="rojo-oscuro p-3 rounded-sm" to="/templates">Listar Templates</Link>
            </div>
            <div className="w-full">
                {selectedTemplate ? (
                 <h3 className="text-center">Workout actual: {selectedTemplate.name}</h3>
                ) 
                
                
                :(
                     <div className="flex flex-col gap-3 w-full justify-center items-center">
                    <h3 className="text-2xl p-2 text-center">Qué entrenarás hoy?</h3>
                    <input
                      className="w-2/4 placeholder:text-center"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nombre del entrenamiento"
                      />
                    <button className="rojo-oscuro p-3 rounded-sm w-1/2" onClick={handleAddWorkout}>Empezar!</button>
      
                    {currentWorkout && (
                      <div>
                          <h3>Workout Actual: {currentWorkout.name}</h3>
                      </div>
                  )}
                  </div>

                ) 
                
            }

              

            </div>
           
            {/* Mostrar el nombre del workout actual */}
            
        </div>
    );
};

export default Start;
