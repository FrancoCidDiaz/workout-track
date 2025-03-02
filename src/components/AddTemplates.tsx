import React, { useState } from "react";
import { useTemplateStore } from "../store/templateStore";
import { useAuthStore } from "../store/authStore";
import AddExercisesToTemplate from "./AddExercisesToTemplate";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

const AddTemplates: React.FC = () => {
    const { addTemplate, deleteTemplate, saveTemplate, currentTemplate } = useTemplateStore();
    const { user } = useAuthStore();

    const [newTemplateName, setNewTemplateName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const handleAddTemplate = () => {
        if (newTemplateName.trim() && newDescription.trim()) {
            const newTemplate = {
                id: uuidv4(),
                userId: user?.uid || "",
                name: newTemplateName,
                description: newDescription,
                exercises: [],
            };
            addTemplate(newTemplate);
            setNewTemplateName("");
            setNewDescription("");
        }
    };

    const handleRegisterTemplate = async() => {
        if (!currentTemplate) return;      
            console.log("currentTemplate antes de guardar:", currentTemplate);
            console.log("Ejercicios en currentTemplate:", currentTemplate.exercises);
         await saveTemplate(currentTemplate);
     
        alert("Template registrado correctamente!");
    };

    return (
        <div className="flex flex-col gap-3 w-full h-screen">
            <h1 className="text-center mt-3">Añadir Template</h1>

            <div className="flex flex-col gap-3 w-full items-center justify-center">
                <input
                    className="w-3/4"
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Nombre"
                />
                <input
                    className="w-3/4"
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Descripción"
                />
                <button onClick={handleAddTemplate}>Agregar Template</button>
            </div>

            {/* Mostrar solo el template actual */}
            {currentTemplate && (
                <div key={currentTemplate.id}>
                    <h2>{currentTemplate.name}</h2>
                    <p>{currentTemplate.description}</p>
                    <button onClick={() => deleteTemplate(currentTemplate.id)}>Eliminar</button>

                    <AddExercisesToTemplate templateId={currentTemplate.id} />

                    <ul>
                        {currentTemplate.exercises?.map((exercise, index) => (
                            <li key={index}>
                                 {exercise.name} -
                                  {/* {exercise.sets} sets  */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {currentTemplate && (
                <button onClick={handleRegisterTemplate} className="rojo-oscuro p-3 rounded-sm">
                    Registrar
                </button>
            )}

            <div className="flex flex-row gap-3 items-center justify-center"> 
              <Link className="rojo-oscuro p-3 rounded-sm" to="/app">Volver</Link>
              <Link className="rojo-oscuro p-3 rounded-sm" to="/templates">Listar Templates</Link>                
            </div>
            
            
        </div>
    );
};

export default AddTemplates;
