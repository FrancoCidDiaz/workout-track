import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { BsCurrencyRupee } from "react-icons/bs";
import { useAuthStore } from "./authStore";


interface Set {
    weight: number | null;
    reps: number | null;
    rir: number | null;
    notes: string;
}

interface Exercise {
    name: string;
    sets: Set[]; // Ahora `sets` puede contener objetos
}

interface Template {
    id: string;
    name: string;
    userId: string;
    description: string;
    exercises: Exercise[];
}

interface TemplateStore {
    templates: Template[];
    currentTemplate: Template | null;
    selectedTemplate: Template | null; // Agregar selectedTemplate
    fetchTemplates: (userId: string) => Promise<void>;
    addTemplate: (template: Template) => void;
    deleteTemplate: (templateId: string) => void;
    updateTemplate: (templateId: string, updatedTemplate: Template) => void;
    saveTemplate: (template: Template) => void;
    selectTemplate: (template: Template) => void; // Cambiar el nombre aquí
    addExerciseToTemplate: (templateId :string, exercise: Exercise) => void;
}



export const useTemplateStore = create<TemplateStore>((set) => ({
    templates: [],
    currentTemplate: null,
    selectedTemplate: null, // Inicializar selectedTemplate
    fetchTemplates: async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/templates?userId=${userId}`);
            if (!response.ok) throw new Error("Error al obtener templates");
            const templates = await response.json();
            set({ templates });
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    },
    addTemplate: (template) => set((state) => {
        const userId = useAuthStore.getState().user?.uid || ""; // Simulación de un userId. Usa el valor correcto en tu código.
        const newTemplate = { ...template, id: uuidv4(), userId };
        console.log("desde add template new template:", newTemplate);
        
        return {
            templates: [...state.templates, newTemplate],
            currentTemplate: newTemplate
        };
        
    }),
    addExerciseToTemplate: (templateId, exercise) => {
        set((state) => {
            const template = state.templates.find(t => t.id === templateId);
            if (!template) return state;
    
            const updatedTemplate = {
                ...template,
                exercises: [...template.exercises, exercise], // <-- Asegura que se agregan correctamente
            };
    
            return {
                templates: state.templates.map(t => t.id === templateId ? updatedTemplate : t),
                currentTemplate: updatedTemplate, // <-- Asegura que currentTemplate se actualiza
            };
        });
    },
    deleteTemplate: async (templateId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/templates/${templateId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
              
            });
            if (!response.ok) throw new Error("Error al eliminar template");
            const templates = await response.json();
            set({ templates });
        } catch (error) {
            console.error("Error eliminando templates:", error);
        }
    },
    updateTemplate: (templateId, updatedTemplate) => set((state) => {
        //console.log("currenttemplate desde updateteamplte",currentTemplate)
        const updatedTemplates = state.templates.map((template) =>
            template.id === templateId
                ? { 
                    ...template, 
                    exercises: updatedTemplate.exercises || template.exercises 
                  }
                : template
        );
    
        // Buscar el template actualizado
        const updatedCurrentTemplate = updatedTemplates.find(t => t.id === templateId) || null;
        console.log("updatecurrenttemplates desde updatetemplate:", updatedCurrentTemplate)
    
        return { 
            templates: updatedTemplates,
            currentTemplate: updatedCurrentTemplate // 💡 Ahora también se actualiza currentTemplate
        };
    }),
    saveTemplate: async (template) => {
        if (!template) return;
    
        const templateData = {
            id: template.id,
            userId: template.userId,
            name: template.name,
            description: template.description,
            exercises: template.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets.map(set => ({
                    weight: set.weight ?? null,
                    reps: set.reps ?? null,
                    rir: set.rir ?? null,
                    notes: set.notes ?? "",
                })),
            })),
        };
        console.log("template data desde savetemplate:", templateData)
        //console.log("Template a guardar:", JSON.stringify(template));
        try {
            const response = await fetch("http://localhost:3001/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(templateData),
            });
    
            if (!response.ok) throw new Error("Error al guardar el template");
    
            console.log("Template guardado exitosamente", templateData);
            set({ currentTemplate: null }); // Reiniciar currentTemplate después de guardarlo
        } catch (error) {
            console.error("Error al guardar el template:", error);
        }
    },
    selectTemplate: (template) => set(() => ({
    
        selectedTemplate: template
      
        
          // Guardar el template seleccionado
        
    }))
    
}));
