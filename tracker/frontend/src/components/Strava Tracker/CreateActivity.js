import React, { useState } from 'react'
import { Grid, Button, Typography, TextField, FormControl, Menu, MenuItem } from '@material-ui/core'


const activity_types = [
    {
        value: 'Run',
        label: "Run"
    },
    {
        value: 'Swim',
        label: 'Swim'
    },
    {
        value: 'Hike',
        label: 'Hike'
    },
    {
        value: 'Walk',
        label: "Walk"
    },
    {
        value: "AlpineSki",
        label: "Alpine Ski"
    },
    {
        value: "BackcountrySki",
        label: 'Backcountry Ski'
    },
    {
        value: "Canoeing",
        label: "Canoe",
    },
    {
        value: "Crossfit",
        label: "Crossfit"
    },
    {
        value: 'EBikeRide',
        label: 'E-Bike Ride',
    },
    {
        value: 'Elliptical',
        label: "Elliptical"
    },
    {
        value: 'Handcycle',
        label: "Handcycle"
    },
    {
        value: 'IceSkate',
        label: "Ice Skate"
    },
    {
        value: 'InlineSkate',
        label: "Inline Skate"
    },
    {
        value: 'Kayaking',
        label: "Kayaking"
    },
    {
        value: 'Kitesurf',
        label: "Kitesurf"
    },
    {
        value: 'NordicSki',
        label: "Nordic Ski"
    },
    {
        value: 'RockClimbing',
        label: "Rock Climbing"
    },
    {
        value: 'RollerSki',
        label: "Roller Ski"
    },
    {
        value: 'Rowing',
        label: "Rowing"
    },
    {
        value: 'Snowboard',
        label: "Snowboard"
    },
    {
        value: 'Snowshoe',
        label: "Snowshoe"
    },
    {
        value: 'StairStepper',
        label: "Stair-Stepper"
    },
    {
        value: 'StandUpPaddling',
        label: "Stand Up Paddling"
    },
    {
        value: 'Ride',
        label: "Ride"
    },
    {
        value: 'Surfing',
        label: "Surfing"
    },
    {
        value: 'Velomobile',
        label: "Velomobile"
    },
    {
        value: 'VirtualRide',
        label: "Virtual Ride"
    },
    {
        value: 'VirtualRun',
        label: "Virtual Run"
    },
    {
        value: 'WeightTraining',
        label: "Weight Training"
    },
    {
        value: 'Wheelchair',
        label: "Wheelchair"
    },
    {
        value: 'Windsurf',
        label: "Windsurf"
    },
    {
        value: 'Workout',
        label: "Workout"
    },
    {
        value: 'Yoga',
        label: "Yoga"
    },



];


const CreateActivity = () => {

    const [name, setName] = useState('')
    const [activity_type, setActivity_Type] = useState('')
    const [duration, setDuration] = useState(0)
    const [description, setDescription] = useState("")
    const [distance, setDistance] = useState(0)

    function handleNameChange(event) {
        setName(event.target.value)
    }
    function handleActivity_TypeChange(event) {
        setActivity_Type(event.target.value)
    }
    function handleDurationChange(event) {
        setDuration(event.target.value)
    }
    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }
    function handleDistanceChange(event) {
        setDistance(event.target.value)
    }
    function createActivity() {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                activity_type: activity_type,
                elapsed_time: duration,
                description: description,
                distance: distance
            })
        }
        fetch("/strava/create-activity", requestOptions)
            .then((res) => res.json())
            .then((data) => console.log(data))
    }


    return (
        <Grid container spacing={1} className="all-container">
            <div className="container">
                <h3 style={{ paddingTop: 30, paddingBottom: 30 }}>Create new Strava activity</h3>
                <div class="card">
                    <div class="card-header">
                        Details
                    </div>
                    <div class="card-body">
                        <div style={{ paddingBottom: 20 }} className="form-group">
                            <label>Name</label>
                            <input onChange={handleNameChange} class="form-control" placeholder="Name"></input>
                            <small class="form-text text-muted">The name of the activity</small>
                        </div>
                        <div style={{ paddingBottom: 20 }} class="form-group">
                            <label for="exampleFormControlSelect1">Select the type of activity</label>
                            <select onChange={handleActivity_TypeChange} class="form-control">
                                {activity_types.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ paddingBottom: 20 }} className="form-group">
                            <label>Duration</label>
                            <input onChange={handleDurationChange} type="number" class="form-control" placeholder="Seconds"></input>
                            <small class="form-text text-muted">The duration of the workout</small>
                        </div>
                        <div style={{ paddingBottom: 20 }} className="form-group">
                            <label>Description</label>
                            <input onChange={handleDescriptionChange} class="form-control" placeholder="Description"></input>
                            <small class="form-text text-muted">Describe the workout</small>
                        </div>
                        <div style={{ paddingBottom: 20 }} className="form-group">
                            <label>Distance</label>
                            <input onChange={handleDistanceChange} type="number" class="form-control" placeholder="Meters"></input>
                            <small class="form-text text-muted">The distance of the workout</small>
                        </div>

                        <Grid item xs={12}>
                            <a style={{ textDecoration: 'none' }} href={`/activities`}><button className="btn" onClick={createActivity} style={{ backgroundColor: "#00ADAD", color: "white", marginTop: 30 }}>Create</button></a>
                        </Grid>
                    </div>
                </div>
            </div>

        </Grid>
    )
}

export default CreateActivity
