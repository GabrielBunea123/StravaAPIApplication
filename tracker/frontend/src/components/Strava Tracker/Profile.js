import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';


const Profile = () => {
    const [stravaAuthenticated, setStravaAuthenticated] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    const [userStats, setUserStats] = useState([])
    const [activities, setActivities] = useState([])
    //for run
    const [allRunningTime, setAllRunningTime] = useState('')
    const [allMovingTime, setAllMovingTime] = useState('')
    //for ride
    const [allRidingTime, setAllRidingTime] = useState('')
    const [allMovingRidingTime, setAllMovingRidingTime] = useState('')
    //for swim
    const [allSwimmingTime, setAllSwimmingTime] = useState('')
    const [allMovingSwimmingTime, setAllMovingSwimmingTime] = useState('')


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
    function UserDetails() {
        fetch("/strava/authenticated-user")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setUserInfo(data)
            })
    }
    function UserStats() {
        fetch("/strava/user-stats")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setUserStats(data)
                // setting the running time
                var runningTimeDate = new Date(null);
                runningTimeDate.setSeconds(data.all_run_totals_moving_time); // specify value for SECONDS here
                setAllRunningTime(runningTimeDate.toISOString().substr(11, 8))

                //setting the moving time run
                var movingRunningTimeDate = new Date(null);
                movingRunningTimeDate.setSeconds(data.all_run_totals_moving_time); // specify value for SECONDS here
                setAllMovingTime(movingRunningTimeDate.toISOString().substr(11, 8))

                // setting the riding time
                var ridingTimeDate = new Date(null);
                ridingTimeDate.setSeconds(data.all_ride_totals_moving_time); // specify value for SECONDS here
                setAllRidingTime(ridingTimeDate.toISOString().substr(11, 8))

                //setting the moving time ride
                var movingRidingTimeDate = new Date(null);
                movingRidingTimeDate.setSeconds(data.all_ride_totals_moving_time); // specify value for SECONDS here
                setAllMovingRidingTime(movingRidingTimeDate.toISOString().substr(11, 8))

                // setting the swimming time
                var swimmingTimeDate = new Date(null);
                swimmingTimeDate.setSeconds(data.all_swim_totals_moving_time); // specify value for SECONDS here
                setAllSwimmingTime(swimmingTimeDate.toISOString().substr(11, 8))

                //setting the moving time swim
                var movingSwimmingTimeDate = new Date(null);
                movingSwimmingTimeDate.setSeconds(data.all_swim_totals_moving_time); // specify value for SECONDS here
                setAllMovingSwimmingTime(movingSwimmingTimeDate.toISOString().substr(11, 8))

            })
    }
    const getStravaActivities = () => {
        fetch("/strava/get-strava-activities")
            .then((res) => res.json())
            .then((data) => {
                setActivities(data)
            })
    }


    useEffect(() => {
        authenticateStrava()
        UserDetails()
        UserStats()
        getStravaActivities()
    }, [])
    return (
        <Grid container spacing={1} style={{ paddingTop: 30 }} className="all-container">
            <div className="container" style={{ padding: 20 }}>
                <Grid item xs={12} align="center">
                    {/* FOLLOWERS AND STATS */}
                    <div className="d-flex flex-sm-row flex-column">
                        <div className="mr-auto p-2 profile-pic-container"><img className="profileImage" src={userInfo.profile_pic}></img></div>
                        <div style={{ paddingTop: 30 }} className="d-flex flex-column bd-highlight mb-3">
                            <div class="card text-dark mb-3 stats-profile-container">
                                <div class="card-body">
                                    <div className="d-flex flex-sm-row flex-column align-content-center">
                                        <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities-followers">
                                            <div className="mr-auto p-2"><Typography variant="h6">Followers</Typography></div>
                                            <div className="mr-auto p-2"><Typography variant="h6">{userInfo.followers}</Typography></div>
                                        </div>
                                        <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities">
                                            <div className="mr-auto p-2"><Typography variant="h6">Activities</Typography></div>
                                            <div className="mr-auto p-2"><Typography variant="h6">{activities.length}</Typography></div>
                                        </div>
                                        <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities">
                                            <div className="mr-auto p-2"><Typography variant="h6">Weight</Typography></div>
                                            <div className="mr-auto p-2"><Typography variant="h6">{(Math.round(userInfo.weight * 100) / 100).toFixed(2)} kg</Typography></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* NAME AND COUNTRY */}
                    <div className="d-flex flex-sm-row flex-column">
                        <div className="mr-auto p-2"><Typography style={{ paddingTop: 20 }} variant="h5">{userInfo.firstname} {userInfo.lastname}</Typography></div>
                    </div>
                    <div className="d-flex flex-sm-row flex-column">
                        <div className="p-2"><i class="fas fa-map-marker-alt"></i> {userInfo.city}, {userInfo.state}, {userInfo.country}</div>
                    </div>

                    {/* RECENT ACTIVITY CARD */}
                    <div className="d-flex flex-column bd-highlight mb-3 profile-recent-activity-container">
                        <div class="card text-center profile-recent-activities-container">
                            <div class="card-header">
                                Recent activity
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">

                                    <table class="table" style={{ backgroundColor: "white" }}>
                                        <thead>
                                            <tr>
                                                <th scope="col"><Typography variant="p"><FitnessCenterIcon /></Typography></th>
                                                <th scope="col"><Typography variant="h6">Distance</Typography></th>
                                                <th scope="col"><Typography variant="h6">Time</Typography></th>
                                                <th scope="col"><Typography variant="h6">Speed</Typography></th>
                                            </tr>
                                        </thead>
                                        <thead>
                                            <tr>
                                                <th scope="col"><Typography variant="h6">{activities.length > 0 ? activities[0].name : null}</Typography></th>
                                                <th scope="col"><Typography variant="h6">{activities.length > 0 ? activities[0].distance : null}</Typography></th>
                                                <th scope="col"><Typography variant="h6">{activities.length > 0 ? activities[0].elapsed_time : null}</Typography></th>
                                                <th scope="col"><Typography variant="h6">{activities.length > 0 ? activities[0].average_speed : null} m/s</Typography></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <a href={`/activity-details/${activities.length > 0 ? activities[0].activity_id : "#"}`} class="btn" style={{ backgroundColor: "#00ADAD", color: "white" }}>Activity details</a>
                            </div>
                        </div>
                    </div>
                    {/* TABS FOR USER RUN/RIDE/SWIM DETAILS */}
                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button class="nav-link active" id="nav-general-tab" data-bs-toggle="tab" data-bs-target="#nav-general" type="button" role="tab" aria-controls="nav-general" aria-selected="true">General</button>
                            <button class="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="false">Run</button>
                            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Ride</button>
                            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Swim</button>
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                        {/* GENERAL */}
                        <div class="tab-pane fade show active" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
                            <div class="card" style={{ backgroundColor: "#E9FBFB" }}>
                                <div class="card-body">
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Biggest ride distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.biggest_ride_distance ? `${userStats.biggest_ride_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Total run distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_run_totals_distance ? `${userStats.all_run_totals_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Total ride distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_ride_totals_distance ? `${userStats.all_ride_totals_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Total swim distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_swim_totals_distance ? `${userStats.all_swim_totals_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <a href="/activities" class="btn" style={{ backgroundColor: "#00ADAD", color: "white" }}>Activities</a>
                                </div>
                            </div>
                        </div>
                        {/* RUN */}
                        <div class="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <div class="card" style={{ backgroundColor: "#E9FBFB" }}>
                                <div class="card-body">
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Total run distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_run_totals_distance ? `${userStats.all_run_totals_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Number of runs</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_run_totals_count ? `${userStats.all_run_totals_count}` : "0"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">All running time</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_run_totals_moving_time ? allRunningTime : "0 s"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">All moving time</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_run_totals_moving_time ? allMovingTime : "0 s"}</Typography>
                                        </div>
                                    </div>
                                    {/* <a href="#" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}}>Running activities</a> */}
                                </div>
                            </div>
                        </div>
                        {/* RIDE */}
                        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                <div class="card" style={{ backgroundColor: "#E9FBFB" }}>
                                    <div class="card-body">
                                        <div class="d-flex bd-highlight mb-3">
                                            <div class="p-2 bd-highlight">
                                                <Typography variant="h6">Total ride distance</Typography>
                                            </div>
                                            <div class="ms-auto p-2 bd-highlight">
                                                <Typography variant="h6">{userStats.all_ride_totals_distance ? `${userStats.all_ride_totals_distance} m` : "0 m"}</Typography>
                                            </div>
                                        </div>
                                        <div class="d-flex bd-highlight mb-3">
                                            <div class="p-2 bd-highlight">
                                                <Typography variant="h6">Number of rides</Typography>
                                            </div>
                                            <div class="ms-auto p-2 bd-highlight">
                                                <Typography variant="h6">{userStats.all_ride_totals_count ? `${userStats.all_ride_totals_count}` : "0"}</Typography>
                                            </div>
                                        </div>
                                        <div class="d-flex bd-highlight mb-3">
                                            <div class="p-2 bd-highlight">
                                                <Typography variant="h6">All riding time</Typography>
                                            </div>
                                            <div class="ms-auto p-2 bd-highlight">
                                                <Typography variant="h6">{userStats.all_ride_totals_moving_time ? allRidingTime : "0"}</Typography>
                                            </div>
                                        </div>
                                        <div class="d-flex bd-highlight mb-3">
                                            <div class="p-2 bd-highlight">
                                                <Typography variant="h6">All moving time</Typography>
                                            </div>
                                            <div class="ms-auto p-2 bd-highlight">
                                                <Typography variant="h6">{userStats.all_ride_totals_moving_time ? allMovingRidingTime : "0"}</Typography>
                                            </div>
                                        </div>
                                        {/* <a href="#" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}}>Riding activities</a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SWIM */}
                        <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                            <div class="card" style={{ backgroundColor: "#E9FBFB" }}>
                                <div class="card-body">
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Total swim distance</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_swim_totals_distance ? `${userStats.all_swim_totals_distance} m` : "0 m"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">Number of swims</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_swim_totals_count ? `${userStats.all_swim_totals_count}` : "0"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">All swimming time</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_swim_totals_moving_time ? allSwimmingTime : "0"}</Typography>
                                        </div>
                                    </div>
                                    <div class="d-flex bd-highlight mb-3">
                                        <div class="p-2 bd-highlight">
                                            <Typography variant="h6">All moving time</Typography>
                                        </div>
                                        <div class="ms-auto p-2 bd-highlight">
                                            <Typography variant="h6">{userStats.all_swim_totals_moving_time ? allMovingSwimmingTime : "0"}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>

            </div>
        </Grid>
    )
}

export default Profile
