import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router';


const GetWorkouts = () => {

  const { fetchWorkouts } = useWorkoutStore();
  const { user } = useAuthStore();
  const [workouts, setWorkouts] = useState([])

  const getWorkouts = async () => {
   const userId = user.uid
   const response = await fetchWorkouts(userId)
   setWorkouts(response)
  }

  useEffect(() => {
    console.log("user desde getwkts:" ,user)
    getWorkouts()

  }, [user])
  

  return (
    <div className='flex flex-col items-center justify-items-center gap-3 mb-3'>
    <h2 className='text-4xl text-center p-3'>Tus entrenamientos</h2>
    {workouts.length === 0 ? (
      <p>No hay entrenamientos disponibles</p>
    ) : (
      workouts.map((workout) => (
        <div className='rojo-oscuro p-3 rounded-sm w-5/6' key={workout.id}>
          <h3>{workout.name}</h3>
          <p>Fecha: {workout.date}</p>
          <h4>Ejercicios:</h4>
          {workout.exercises.map((exercise) => (
            <div key={exercise.id}>
              <p>{exercise.name}</p>
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
      ))
    )}
    <Link className='rojo-oscuro p-3 rounded-sm w-2/4 text-center' to="/app">Volver</Link>
  </div>
  )
}

export default GetWorkouts