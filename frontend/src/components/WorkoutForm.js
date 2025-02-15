import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm=({ workoutToEdit, setWorkoutToEdit })=>{
    const{dispatch}=useWorkoutsContext()
    const { user } = useAuthContext()

    const [title,setTitle]=useState('')
    const [load,setLoad]=useState('')
    const [reps,setReps]=useState('')
    const [error,setError]=useState(null)
    const [emptyFields,setEmptyFields]=useState([])

    useEffect(() => {
        if (workoutToEdit) {
            setTitle(workoutToEdit.title);
            setLoad(workoutToEdit.load);
            setReps(workoutToEdit.reps);
        }
    }, [workoutToEdit]);

    const handleSubmit= async (e)=> {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const workout={title,load,reps}

        const response = await fetch (workoutToEdit ? `${process.env.REACT_APP_API_URL}/api/workouts/${workoutToEdit._id}` : `${process.env.REACT_APP_API_URL}/api/workouts`,{
            method: workoutToEdit ? 'PATCH' : 'POST',
            body:JSON.stringify(workout),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${user.token}`
            }
        })
        const json= await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            setTitle('')
            setLoad('')
            setReps('')
            setError(null)
            setEmptyFields([])
            console.log(workoutToEdit ? 'Workout updated' : 'New workout added', json);
            dispatch({ type: workoutToEdit ? "UPDATE_WORKOUT" : "CREATE_WORKOUT", payload: json });

            if (workoutToEdit) {
                setWorkoutToEdit(null);
            }
        }
    }
    return(
         <form className="create" onSubmit={handleSubmit}>
            <h3>{workoutToEdit ? 'Edit Workout' : 'Add a New Workout'}</h3>

            <label>Exercise Title: </label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Load (in kg):</label>
            <input
                type="number"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />

            <label>Reps:</label>
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />
            <button>{workoutToEdit ? 'Update Workout' : 'Add Workout'}</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm;