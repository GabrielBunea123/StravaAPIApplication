import React,{useEffect,useState,useRef} from 'react'
import {Typography,FormControl,Grid,Button} from '@material-ui/core'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeActivity from './HomeActivity'
import { IterationsIcon } from '@primer/octicons-react';
import HomeUserFollowers from './HomeUserFollowers'

const Home = () => {

    const [activities,setActivities] = useState([])
    const [userInfo,setUserInfo] = useState([])
    const [stravaActivity,setStravaActivity] = useState([])
    const [totalKcal,setTotalKcal] = useState(0)
    const currentDate=new Date().toISOString().slice(0,10);
    const kcalGoal = localStorage.getItem("kcalGoal")

    function UserDetails(){
        fetch("/strava/authenticated-user")
        .then((res)=>res.json())
        .then((data)=>{
            setUserInfo(data)
            getDailyFood(data.id)
        })
    }

    function getDailyFood(id){
        const requestOptions={
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                date:currentDate,
                creator:id
            })
        }
        fetch("/api/get-daily-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            data.map((item)=>{
                setTotalKcal(kcal=>kcal+item.kcal)
            })
        })
    }

    const getStravaActivities=()=>{
        fetch("/strava/get-strava-activities")
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            data.map((item)=>{
                //from ISO 8601 format to normal format date
                var date = new Date(item.start_date)
                item.start_date = date.toDateString();


                //from seconds convert to readable time
                var elapsed_time = new Date(null);
                elapsed_time.setSeconds(item.elapsed_time); // specify value for SECONDS here
                item.elapsed_time = elapsed_time.toISOString().substr(11,8)
            })
            setActivities(data)
        })
    }

    const renderActivities=()=>{
        return(
            <div className="home-activities-container">
                {activities.length>0?
                    
                    activities.map((item, index) => (
                        <HomeActivity 
                            id={item.id} 
                            name={item.name} 
                            start_date={item.start_date} 
                            city={userInfo.city} 
                            state={userInfo.state} 
                            country={userInfo.country} 
                            elapsed_time={item.elapsed_time} 
                            max_speed={item.max_speed} 
                            distance={item.distance} 
                            start_latlng={item.start_latlng}/>
                    )):null}
            </div>
        )
    }

    useEffect(()=>{
        getStravaActivities();
        UserDetails()
    },[])
    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                <div className="d-flex">
                    <div className="mr-auto p-2 small-stats" style={{marginTop:10}}><img style={{width:70,borderRadius:"50%"}} src={userInfo.profile?userInfo.profile:"/static/images/UserDefault.png"}></img></div>
                    <h3 className="small-stats" style={{paddingTop:30,paddingBottom:20,fontWeight:'bold',color:"#008A8A"}}>{userInfo.firstname} {userInfo.lastname}</h3>
                </div>
                <div style={{paddingTop:50}} className="d-flex flex-sm-row flex-column">
                    <div className="home-profile-stats flex-column">
                        <div className="mr-auto p-2 profile-pic-container"><img className="home-profileImage" src={userInfo.profile?userInfo.profile:"/static/images/UserDefault.png"}></img></div>
                        <HomeUserFollowers userInfo={userInfo} activities={activities}/>
                    </div>
                    <div className="flex-column home-middle-column-container">
                        <div class="card text-center">
                            <div class="card-header">
                                Start now
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Record your workout</h5>
                                <div class="card-text">You can start by recording your first workout from the Strava mobile application or you can add it manually both in this application and Strava</div>
                                <a style={{marginTop:10 ,backgroundColor:"#00ADAD",color:"white"}} href="/create-activity" class="btn">Add manually</a>
                            </div>
                        </div>
                        <div style={{marginTop:20}} class="card">
                            <ul class="list-group list-group-flush">
                                <li style={{textAlign:"center"}} class="list-group-item">Kcal Goal: {kcalGoal}</li>
                                <li style={{textAlign:"center"}} class="list-group-item">Today's kcal: {totalKcal}</li>
                                <li style={{textAlign:"center"}} class="list-group-item">Remaining kcal: {kcalGoal-totalKcal}</li>
                            </ul>
                        </div>
                    </div>
                    <Grid item xs={12} align="center">
                    <div className="flex-column" className="about-container">
                        <div class="card">
                            <div class="card-body">
                                <h5 style={{fontWeight:"bold"}} class="card-title">About Eat&Track</h5>
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
                <h3 style={{paddingTop:30,paddingBottom:50,fontWeight:'bold',color:"#008A8A"}}>Activity feed</h3>
                {renderActivities()}
            </div>
            {/* <img style={{width:"100%"}} src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-a+9ed4bd(-122.46589,37.77343),pin-s-b+000(-122.42816,37.75965),path-5+f44-0.5(%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM)/auto/500x200?access_token=pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg`}></img> */}
        </Grid>
    )
    
}

export default Home
