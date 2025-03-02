import { useState } from "react";
import { useTemplateStore } from "../store/templateStore";

interface AddExerciseToTemplateProps {
    templateId: string;
}

const AddExerciseToTemplate: React.FC<AddExerciseToTemplateProps> = ({ templateId }) => {
    const { updateTemplate, templates, currentTemplate } = useTemplateStore();
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState("");

    const handleAddExercise = () => {
        if (!exerciseName.trim() || !sets.trim()) return;
    
        const template = templates.find((t) => t.id === templateId);
        if (!template) return;
        console.log("sets desde handleaddexercise to template:", sets)
    
        const updatedExercises = [
            ...(template.exercises || []), 
            { 
                name: exerciseName, 
                sets: Array.from({ length: parseInt(sets) || 0 }, () => ({ weight: null, reps: null, rir: null, notes: "" }))
            }
        ];
    
        // Crear el objeto actualizado con todas las propiedades
        const updatedTemplate = {
            ...template,
            exercises: updatedExercises
        };
    
        updateTemplate(templateId, updatedTemplate);
        console.log("sets y exercises añadidos desde addexercisestotemplate", updatedExercises);
        console.log("currente template despues de updatetemplate en addexercisestotemplate:", currentTemplate)
    
        setExerciseName("");
        setSets("");
    };

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
            <input
                className="w-2/4 placeholder:text-center"
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="Número de Sets"
            />
            <button className="rojo-oscuro p-3 rounded-sm" onClick={handleAddExercise}>
                Añadir
            </button>
        </div>
    );
};

export default AddExerciseToTemplate;
