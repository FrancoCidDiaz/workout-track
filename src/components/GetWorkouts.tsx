import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router';
import { ClipLoader } from "react-spinners";

interface Set {
  id: string;
  weight: number;
  reps: number;
  rir: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
}

const GetWorkouts = () => {
  const { fetchWorkouts } = useWorkoutStore();
  const { user } = useAuthStore();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [visibleWorkoutId, setVisibleWorkoutId] = useState<string | null>(null);

  const handleWorkoutClick = (workoutId: string) => {
    setVisibleWorkoutId(visibleWorkoutId === workoutId ? null : workoutId);
    console.log(workoutId);
  };

  const getWorkouts = async () => {
    const userId = user?.uid || '';
    const response = await fetchWorkouts(userId);
    if (response) setWorkouts(response);
  };

  useEffect(() => {
    console.log('user desde getwkts:', user);
    getWorkouts();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-items-center gap-3 mb-3">
      <h2 className="text-4xl text-center p-3">Tus entrenamientos</h2>
      {workouts.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#ff0000" size={70} />
        <p className="ml-2">Cargando...</p>
      </div>
      ) : (
        workouts.map((workout) => (
          <div className="rojo-oscuro p-3 rounded-sm w-5/6" key={workout.id}>
            <div className="w-full">
              <div className="cursor-pointer" onClick={() => handleWorkoutClick(workout.id)}>
                <h3>{workout.name}</h3>
                <p>Fecha: {workout.date}</p>
                <p>{workout?.notes || null}</p>
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${
                visibleWorkoutId === workout.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}>
                <h4>Ejercicios:</h4>
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id}>
                    <p className='text-black font-medium'>{exercise.name}</p>
                    <ul>
                      {exercise.sets.map((set) => (
                        <li key={set.id}>
                          Peso: {set.weight} kg, Reps: {set.reps}, RIR: {set.rir}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
      <Link className="rojo-oscuro p-3 rounded-sm w-2/4 text-center" to="/app">
        Volver
      </Link>
    </div>
  );
};

export default GetWorkouts;
