import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import HomeActivity from './HomeActivity'
import HomeUserFollowers from './HomeUserFollowers'


const Home = () => {

    const [stravaAuthenticated, setStravaAuthenticated] = useState(false)
    const [activities, setActivities] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [stravaActivity, setStravaActivity] = useState([])
    const [totalKcal, setTotalKcal] = useState(0)
    const currentDate = new Date().toISOString().slice(0, 10);
    const kcalGoal = localStorage.getItem("kcalGoal")


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
                setUserInfo(data)
                getDailyFood(data.id)
            })
    }

    function getDailyFood(id) {
        const requestOptions = {
            method: "POST",
            headers: { "Cntent-Type": "application/json" },
            body: JSON.stringify({
                date: currentDate,
                creator: id
            })
        }
        fetch("/api/get-daily-food", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    data.map((item) => {
                        setTotalKcal(kcal => kcal + item.kcal)
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
                    item.start_date = date.toDateString();


                    //from seconds convert to readable time
                    var elapsed_time = new Date(null);
                    elapsed_time.setSeconds(item.elapsed_time); // specify value for SECONDS here
                    item.elapsed_time = elapsed_time.toISOString().substr(11, 8)
                })
                setActivities(data)
            })
    }

    const renderActivities = () => {
        return (
            <div className="home-activities-container d-flex flex-wrap justify-content-evenly">
                {activities.length > 0 ?

                    activities.map((item, index) => (
                        <HomeActivity
                            activity_id={item.activity_id}
                            name={item.name}
                            start_date={item.start_date}
                            city={userInfo.city}
                            state={userInfo.state}
                            country={userInfo.country}
                            elapsed_time={item.elapsed_time}
                            date={item.start_date_local.slice(0, 10)}
                            distance={item.distance}
                            polyline={item.polyline}
                        />
                    )) : null}
            </div>
        )
    }

    useEffect(() => {
        authenticateStrava()
        getStravaActivities();
        UserDetails()
    }, [])
    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                <div className="d-flex">
                    <div className="mr-auto p-2 small-stats" style={{ marginTop: 10 }}><img style={{ width: 70, borderRadius: "50%" }} src={userInfo.profile_pic ? userInfo.profile_pic : "/static/images/UserDefault.png"}></img></div>
                    <h3 className="small-stats" style={{ paddingTop: 30, paddingBottom: 20, fontWeight: 'bold', color: "#008A8A" }}>{userInfo.firstname} {userInfo.lastname}</h3>
                </div>
                <div style={{ paddingTop: 50 }} className="d-flex flex-sm-row flex-column">
                    <div className="home-profile-stats flex-column">
                        <div className="mr-auto p-2 profile-pic-container"><img className="home-profileImage" src={userInfo.profile_pic ? userInfo.profile_pic : "/static/images/UserDefault.png"}></img></div>
                        <HomeUserFollowers userInfo={userInfo} activities={activities} />
                    </div>
                    <div className="flex-column home-middle-column-container">
                        <div class="card text-center">
                            <div class="card-header">
                                Start now
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Record your workout</h5>
                                <div class="card-text">You can start by recording your first workout from the Strava mobile application or you can add it manually both in this application and Strava</div>
                                <a style={{ marginTop: 10, backgroundColor: "#00ADAD", color: "white" }} href="/create-activity" class="btn">Add manually</a>
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }} class="card">
                            <ul class="list-group list-group-flush">
                                <li style={{ textAlign: "center" }} class="list-group-item">Kcal Goal: {kcalGoal}</li>
                                <li style={{ textAlign: "center" }} class="list-group-item">Today's kcal: {totalKcal}</li>
                                <li style={{ textAlign: "center" }} class="list-group-item">Remaining kcal: {kcalGoal - totalKcal}</li>
                            </ul>
                        </div>
                    </div>
                    <Grid item xs={12} align="center">
                        <div className="flex-column about-container">
                            <div class="card">
                                <div class="card-body">
                                    <h5 style={{ fontWeight: "bold" }} class="card-title">About Eat&Track</h5>
                                    <div class="card-text">
                                        This app was developed to help its users keep track of their workouts and daily food calories intake.
                                        The workouts can be recorded live using Strava or manually added from the app.
                                        All your Strava activities will appear in Eat&Track.
                                        <br></br><br></br>
                                        The daily calories tracker has a very large variety of food and if by any chance the food you are looking for is not in the list, you can create your own recipe.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
                <h3 style={{ paddingTop: 30, paddingBottom: 50, fontWeight: 'bold', color: "#008A8A" }}>Activity feed</h3>
                {renderActivities()}
            </div>
        </Grid>
    )

}

export default Home
