import React, { useState, useEffect } from 'react'
import { Grid, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core';


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

const Activities = () => {

    const [activities, setActivities] = useState([])
    const [filteredActivities, setFilteredActivities] = useState([])
    const [filterName, setFilterName] = useState('')
    const [filterType, setFilterType] = useState('none')
    const [filterBool, setFilterBool] = useState(false)
    const [stravaAuthenticated, setStravaAuthenticated] = useState(false)

    function authenticateStrava() {
        fetch("/strava/is_authenticated")
            .then((res) => res.json())
            .then((data) => {
                setStravaAuthenticated(data.status)
                if (!data.status) {
                    fetch("/strava/get-auth-url")
                        .then((res) => res.json())
                        .then((data) => {
                            window.location.replace(data.url)//redirect to the strava url
                        })
                }
            })
    }

    const getStravaActivities = () => {
        fetch("/strava/get-strava-activities")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                data.map((item) => {
                    //from ISO 8601 format to normal format date
                    var date = new Date(item.start_date)
                    item.start_date = date.toLocaleString();


                    //from seconds convert to readable time
                    var elapsed_time = new Date(null);
                    elapsed_time.setSeconds(item.elapsed_time); // specify value for SECONDS here
                    item.elapsed_time = elapsed_time.toISOString().substr(11, 8)
                })
                setActivities(data)
                setFilteredActivities(data)
            })
    }
    const filterActivities = () => { //search in activities
        if (filterName.length > 0 && filterType == 'none') {//filter only by name
            setFilteredActivities([]);
            activities.map((item, index) => {
                if (item.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase())) {
                    setFilteredActivities(filteredActivities => [...filteredActivities, item]);
                    setFilterBool(true)
                }
            })
        }
        else if (filterName.length == 0 && filterType != 'none') {//filter only by type
            setFilteredActivities([]);
            activities.map((item, index) => {
                if (item.activity_type.toLocaleLowerCase().includes(filterType.toLocaleLowerCase())) {
                    setFilteredActivities(filteredActivities => [...filteredActivities, item]);
                    setFilterBool(true)
                }
            })
        }
        else if (filterName.length > 0 && filterType != 'none') {//filter both by name and by type
            setFilteredActivities([]);
            activities.map((item, index) => {
                if (item.activity_type.toLocaleLowerCase().includes(filterType.toLocaleLowerCase()) && item.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase())) {
                    setFilteredActivities(filteredActivities => [...filteredActivities, item]);
                    setFilterBool(true)
                }
            })
        }
        else if (filterName.length == 0 && filterType == 'none') {
            setFilterBool(false)
            setFilteredActivities(activities)
        }
    }
    const handleActivityFilterNameChange = (event) => {
        setFilterName(event.target.value)
    }
    const handleActivityFilterTypeChange = (event) => {
        setFilterType(event.target.value)
    }

    const loopAllActivities = () => {
        if (filterBool == false) {
            return (
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length > 0 ? activities.map((item, index) => (
                                <tr>
                                    <th scope="col">{index + 1}</th>
                                    <td>{item.activity_type}</td>
                                    <td><a style={{ color: "#00ADAD" }} href={`/activity-details/${item.activity_id}`}>{item.name}</a></td>
                                    <td>{item.start_date_local.slice(0, 10)}</td>
                                    <th>{item.elapsed_time}</th>
                                </tr>
                            )) : <Typography variant="h3">There are no activities</Typography>}
                        </tbody>
                    </table>
                </div>
            )
        }
        else if (filterBool == true) {
            return (
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.length > 0 ? filteredActivities.map((item, index) => (
                                <tr>
                                    <th scope="col">{index + 1}</th>
                                    <td>{item.activity_type}</td>
                                    <td><a style={{ color: "#00ADAD" }} href={`/activity-details/${item.activity_id}`}>{item.name}</a></td>
                                    <td>{item.start_date_local.slice(0, 10)}</td>
                                    <th>{item.elapsed_time}</th>
                                </tr>
                            )) : <Typography variant="h3">There are no activities</Typography>}
                        </tbody>
                    </table>
                </div>
            )
        }

    }


    useEffect(() => {
        getStravaActivities()
        authenticateStrava()
    }, [])
    return (
        <Grid spacing={1} className="all-container">
            <div style={{ paddingTop: 50 }} className="container">
                <h2 style={{ paddingBottom: 30 }}>My Strava activities</h2>

                {/* ACTIVITIES FILTER */}
                <div style={{ marginBottom: 50 }} class="card">
                    <div class="card-body">
                        <div style={{ paddingBottom: 20 }}>Filter activities</div>
                        <div>
                            <div class="row">
                                <div class="col-6">
                                    <input onChange={handleActivityFilterNameChange} type="text" class="form-control" placeholder="Name"></input>
                                </div>
                                <div class="col-6">
                                    <select onChange={handleActivityFilterTypeChange} class="form-select" aria-label="Default select example">
                                        <option value="none">None</option>
                                        {activity_types.map((item, index) => {
                                            return (
                                                <option value={item.value}>{item.label}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div style={{ paddingTop: 20 }}>
                                    <button className="btn" onClick={filterActivities} style={{ backgroundColor: "#00ADAD", color: "white" }}>Filter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTIVITIES TABLE */}
                {loopAllActivities()}

                <h4 style={{ paddingTop: 30 }}>{filteredActivities.length} Activities</h4>

            </div>
        </Grid>
    )
}

export default Activities
