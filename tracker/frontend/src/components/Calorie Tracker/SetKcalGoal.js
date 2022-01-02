import React,{useState} from 'react'
import {Grid} from "@material-ui/core"

const CaloriesSettings = (props) => {

    const user_id=props.match.params.user_id
    const date = new Date().toISOString().slice(0,10)

    const [goal,setGoal] = useState(0);

    function handleKcalChange(event){
        setGoal(event.target.value);
    }
    function SetKcalGoal(){
        const requestOptions={
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                creator:user_id,
                goal:goal
            })
        }
        fetch("/api/set-kcal-goal",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            localStorage.setItem("kcalGoal",goal);
        })
    }
    return (
        <Grid container spacing={1} className="all-container">
            <div className="container">
                <h3 style={{paddingTop:30,paddingBottom:30}}>Set kcal goal</h3>
                <div class="card">
                    <div class="card-body">
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Kcal</label>
                            <input onChange={handleKcalChange} type="number" class="form-control" placeholder="Calories"></input>
                            <small class="form-text text-muted">Your daily calories</small>
                        </div>

                        <Grid item xs={12} align="center">
                            <a style={{textDecoration:'none'}} href={`/daily-calories/${user_id}/${date}`}><button onClick={SetKcalGoal} className="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:30}}>Apply</button></a>    
                        </Grid>
                    </div>
                </div>
            </div>

        </Grid>
    )
}

export default CaloriesSettings
