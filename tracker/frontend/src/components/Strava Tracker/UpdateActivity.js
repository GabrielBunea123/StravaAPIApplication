import React,{useEffect,useState} from 'react'
import {Button,Grid,Typography,TextField,FormControl,Input,Menu,MenuItem} from '@material-ui/core'


const activity_types = [
    {
        value: 'Run',
        label:"Run"
    },
    {
        value: 'Swim',
        label:'Swim'
    },
    {
        value: 'Hike',
        label: 'Hike'
    },
    {
        value: 'Walk',
        label:"Walk"
    },
    {
        value:"AlpineSki",
        label:"Alpine Ski"
    },
    {
        value:"BackcountrySki",
        label:'Backcountry Ski'
    },
    {   
        value:"Canoeing",
        label:"Canoe",
    },
    {
        value:"Crossfit",
        label:"Crossfit"
    },
    {
        value:'EBikeRide',
        label:'E-Bike Ride',
    },
    {
        value:'Elliptical',
        label:"Elliptical"
    },
    {
        value:'Handcycle',
        label:"Handcycle"
    },
    {
        value:'IceSkate',
        label:"ice Skate"
    },
    {
        value:'InlineSkate',
        label:"Inline Skate"
    },
    {
        value:'Kayaking',
        label:"Kayaking"
    },
    {
        value:'Kitesurf',
        label:"Kitesurf"
    },
    {
        value:'NordicSki',
        label:"Nordic Ski"
    },
    {
        value:'RockClimbing',
        label:"Rock Climbing"
    },
    {
        value:'RollerSki',
        label:"Roller Ski"
    },
    {
        value:'Rowing',
        label:"Rowing"
    },
    {
        value:'Snowboard',
        label:"Snowboard"
    },
    {
        value:'Snowshoe',
        label:"Snowshoe"
    },
    {
        value:'StairStepper',
        label:"Stair-Stepper"
    },
    {
        value:'StandUpPaddling',
        label:"Stand Up Paddling"
    },
    {
        value:'Ride',
        label:"Ride"
    },
    {
        value:'Surfing',
        label:"Surfing"
    },
    {
        value:'Velomobile',
        label:"Velomobile"
    },
    {
        value:'VirtualRide',
        label:"Virtual Ride"
    },
    {
        value:'VirtualRun',
        label:"Virtual Run"
    },
    {
        value:'WeightTraining',
        label:"Weight Training"
    },
    {
        value:'Wheelchair',
        label:"Wheelchair"
    },
    {
        value:'Windsurf',
        label:"Windsurf"
    },
    {
        value:'Workout',
        label:"Workout"
    },
    {
        value:'Yoga',
        label:"Yoga"
    },



  ];

const UpdateActivity = (props) => {
    const activity_id=props.match.params.id
    const [activity,setActivity] = useState([])
    const [name,setName]=useState('')
    const [activity_type,setActivity_Type] = useState('')
    const [elapsed_time,setElapsed_Time] = useState(0)
    const [description,setDescription] = useState('')
    const [distance,setDistance] = useState(0)

    const getActivity=()=>{
        const requestOptions={
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                activity_id: activity_id,
            })
        }
        fetch("/strava/get-one-strava-activity",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setActivity(data)
            setName(data.name)
            setActivity_Type(data.type)
            setElapsed_Time(data.elapsed_time)
            setDescription(data.description)
            setDistance(data.distance)
        })
    }

    function handleNameChange(event){
        setName(event.target.value)
    }
    function handleActivity_TypeChange(event){
        setActivity_Type(event.target.value)
    }
    function handleDurationChange(event){
        setElapsed_Time(event.target.value)
    }
    function handleDescriptionChange(event){
        setDescription(event.target.value)
    }
    function handleDistanceChange(event){
        setDistance(event.target.value)
    }

    const updateActivity=()=>{
        const requestOptions={
            method:"PUT",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
                name:name,
                activity_id:activity_id,
                activity_type:activity_type,
                elapsed_time:elapsed_time,
                description:description,
                distance:distance
            })
        }
        fetch("/strava/update-activity",requestOptions)
        .then((res)=>res.json())
        .then((data)=>console.log(data))
    }
    useEffect(()=>{
        getActivity()
    },[])
    return (
        <Grid container spacing={1} className="all-container">
            <div className="container">
                <h3 style={{paddingTop:30,paddingBottom:30}}>Update the {name} activity</h3>
                <div class="card">
                    <div class="card-header">
                        Details
                    </div>
                    <div class="card-body">
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Name</label>
                            <input value={name} onChange={handleNameChange} class="form-control" placeholder="Name"></input>
                            <small class="form-text text-muted">The name of the activity</small>
                        </div>
                        <div style={{paddingBottom:20}} class="form-group">
                            <label for="exampleFormControlSelect1">Select the type of activity</label>
                            <select value={activity_type} onChange={handleActivity_TypeChange} class="form-control">
                                {activity_types.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Duration</label>
                            <input value={elapsed_time} onChange={handleDurationChange} type="number" class="form-control" placeholder="Seconds"></input>
                            <small class="form-text text-muted">The duration of the workout</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Description</label>
                            <input value={description} onChange={handleDescriptionChange} class="form-control" placeholder="Description"></input>
                            <small class="form-text text-muted">Describe the workout</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Distance</label>
                            <input value={distance} onChange={handleDistanceChange} type="number" class="form-control" placeholder="Meters"></input>
                            <small class="form-text text-muted">The distance of the workout</small>
                        </div>

                        <Grid item xs={12} align="center">
                            <a style={{textDecoration:'none'}} href={`/activity-details/${activity_id}`}><button className="btn" onClick={updateActivity} style={{backgroundColor:"#00ADAD",color:"white",marginTop:30}}>Update</button></a>    
                        </Grid>
                    </div>
                </div>
            </div>

        </Grid>
    )
}

export default UpdateActivity
