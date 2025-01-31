import { useEffect, useState } from "react";
import WorkoutDetails from "../components/WorkoutsDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext()
    const [workoutToEdit, setWorkoutToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {user} = useAuthContext()

    useEffect(() => {
        const fetechWorkouts = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`,{
                headers:{
                    'Authorization':`Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_WORKOUTS', payload: json })
            }
        }
        if (user) {
            fetechWorkouts()
          }
    }, [dispatch,user])

    const filteredWorkouts = workouts
        ? workouts.filter((workout) =>
            workout.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];


    return (
        <div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search workouts by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="home">
                <div className="workouts">
                    {filteredWorkouts.map((workout) => (
                        <WorkoutDetails
                            key={workout._id}
                            workout={workout}
                            setWorkoutToEdit={setWorkoutToEdit}
                        />
                    ))}
                </div>
                <WorkoutForm workoutToEdit={workoutToEdit} setWorkoutToEdit={setWorkoutToEdit} />
            </div>
        </div>
    )
}

export default Home;