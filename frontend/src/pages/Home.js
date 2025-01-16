import { useEffect } from "react";
import WorkoutDetails from "../components/WorkoutsDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const Home=()=>{
    const {workouts,dispatch} =useWorkoutsContext()

    useEffect(()=>{
        const fetechWorkouts=async()=>{
            const response = await fetch('/api/workouts')
            const json = await response.json()

            if (response.ok){
               dispatch({ type: 'SET_WORKOUTS',payload: json})
            }
        }
        fetechWorkouts()
    },[dispatch])
    return(
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout)=>(
                    <WorkoutDetails key={workout._id} workout={workout}></WorkoutDetails>
                ))}
            </div>
            <WorkoutForm></WorkoutForm>
        </div> 
    )
}

export default Home;