import { useEffect, useState } from "react";
import { useTemplateStore } from "../store/templateStore";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { useWorkoutStore } from "../store/workoutStore";
import { convertTemplateToWorkout } from "../hooks/convertTemplateToWorkout";
import { Template } from "../../types"

const GetTemplates = () => {
    const { fetchTemplates, templates, selectTemplate, deleteTemplate } = useTemplateStore();
    const { updateCurrentWorkout } = useWorkoutStore();
    const { user } = useAuthStore();
    const [localTemplates, setLocalTemplates] = useState<Template[]>([]);
    const navigate = useNavigate();

    const handleSelectTemplate = (template: Template) => {
        const workoutFromTemplate = convertTemplateToWorkout(template);
        updateCurrentWorkout(workoutFromTemplate); // Actualiza el currentWorkout
        selectTemplate(template);
        console.log("template seleccionado:", template) // Opcional: guarda el template seleccionado
        navigate("/app"); // Navega a la vista principal
    };

    const handleDeleteTemplate = async(template: Template) => {
      await deleteTemplate(template._id)
      setLocalTemplates((prevTemplates) => prevTemplates.filter(t => t._id !== template._id));

    }

    useEffect(() => {
        if (user?.uid) {
            fetchTemplates(user.uid);
        }
    }, [user]);

    useEffect(() => {
        setLocalTemplates(templates);
    }, [templates]);

    return (
        <div className="flex flex-col gap-3 w-full mx-auto">
            {localTemplates.length === 0 ? (
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader color="#ff0000" size={70} />
                    <p className="ml-2">Cargando...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-lg font-bold text-center mt-3">Templates</h2>
                    {localTemplates.map((template, index) => (
                        <div key={index} className="rojo-oscuro p-3 rounded-sm w-5/6 mx-auto">
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold">{template.name}</p>
                                <button onClick={() => handleSelectTemplate(template)}>Seleccionar</button>
                                <button onClick={() => handleDeleteTemplate(template)}>Eliminar</button>
                            </div>
                            <p className="text-sm">{template.description}</p>
                            {template.exercises.map((exercise, idx) => (
                                <div key={idx} className="ml-3">
                                    <p>{exercise.name}</p>
                                    <p>{exercise.sets.length} sets</p> {/* Imprimir el número de sets */}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex justify-between mt-4">
                        <Link to="/app" className="rojo-oscuro p-3 rounded-sm">Volver</Link>
                        <Link to="/add-templates" className="rojo-oscuro p-3 rounded-sm">Añadir Templates</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default GetTemplates;