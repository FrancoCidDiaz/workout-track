 export const convertTemplateSetsToWorkoutSets = (template: Template): Template => {
    const updatedTemplate = { ...template };
    updatedTemplate.exercises = updatedTemplate.exercises.map(exercise => {
        // Convertir sets de string a un arreglo de objetos
        const numberOfSets = parseInt(exercise.sets, 10);
        const setsArray = Array.from({ length: numberOfSets }, (_, index) => ({
            id: `${exercise.name}-set-${index + 1}`, // Genera un ID único para cada set
            weight: '',  // Inicializar el peso como vacío
            reps: '',    // Inicializar repeticiones como vacío
            rir: '',     // Inicializar RIR como vacío
            notes: ''    // Inicializar notas como vacío
        }));
        
        return {
            ...exercise,
            sets: setsArray // Reemplazar sets con el arreglo generado
        };
    });

    return updatedTemplate;
};
