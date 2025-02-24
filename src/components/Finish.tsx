import  { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore'; // Asegúrate de importar tu store
import * as XLSX from 'xlsx';
import { Link } from 'react-router';

const Finish = () => {
  const { currentWorkout, saveWorkout } = useWorkoutStore();
  const [notes, setNotes] = useState("");

  const handleFinish = async () => {
    if (!currentWorkout) return;
    
    await saveWorkout(notes);
    // Asegúrate de que hay un workout actual

    // Crear un objeto que contenga los datos del workout
    const workoutData = {
      name: currentWorkout.name,
      date: currentWorkout.date,
      totalTime: currentWorkout.totalTime,
      notes: notes,
    };

    // Convertir el workout a una hoja de cálculo
    const workoutSheet = XLSX.utils.json_to_sheet([workoutData]);
    
    // Crear un array para los exercises
    const exerciseData = currentWorkout.exercises.map(exercise => {
      return {
        exerciseName: exercise.name,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          rir: set.rir,
          notes: set.notes,
        })),
      };
    });

    // Crear una hoja para los exercises
    type ExerciseRow = {
      Exercise?: string;
      Reps?: number;
      Weight?: number;
      RIR?: number;
      Notes?: string;
    };
    
    const exerciseRows: ExerciseRow[] = [];
    
    exerciseData.forEach(exercise => {
      // Añadir la fila del ejercicio
      exerciseRows.push({ Exercise: exercise.exerciseName });
      
      // Añadir las filas de cada set del ejercicio
      exercise.sets.forEach(set => {
        exerciseRows.push({
          Exercise: '',
          Reps: parseFloat(set.reps),
          Weight: parseFloat(set.weight),
          RIR: parseFloat(set.rir),
          Notes: set.notes,
        });
      });
      
      // Añadir una fila vacía para separar ejercicios
      exerciseRows.push({});
    });

    const exercisesSheet = XLSX.utils.json_to_sheet(exerciseRows);

    // Crear un nuevo libro de trabajo y añadir las hojas
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, workoutSheet, 'Workout Data');
    XLSX.utils.book_append_sheet(workbook, exercisesSheet, 'Exercises');

    // Generar el archivo Excel y forzar la descarga
    XLSX.writeFile(workbook, `${currentWorkout.date}_workout.xlsx`);
    window.location.reload(); 
  };

  return (
    <div className='mt-8 flex flex-col items-center w-full gap-3 mb-4'>
      <h3>¿Quieres terminar el entrenamiento?</h3>
      <p>Agrega notas sobre el entrenamiento de hoy</p>
      <input
        className='w-2/4 placeholder:text-center'
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas sobre el entrenamiento"
      />
      <button className='rojo-oscuro p-3 rounded-sm' onClick={handleFinish}>Finalizar</button>
      <Link className='rojo-oscuro p-3 rounded-sm' to="/workouts">Revisar mis entrenamientos</Link>
    </div>
  );
};

export default Finish;
