import React,{useEffect,useState,useRef} from 'react'
import {Typography,FormControl,Grid,Button} from '@material-ui/core'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
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
                    <a style={{textDecoration:"none",color:"black"}} href={`/activity-details/${item.id}`}>
                        <div class="card home-card" style={{marginBottom:60,backgroundColor:"#f5f5f5",boxShadow:5,maxWidth:650}}>
                            <div class="card-body">
                                <h5 class="card-title">{item.name}</h5>
                                <small>{item.start_date} {userInfo.city}, {userInfo.state}, {userInfo.country}</small>
                                <div className="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                            <th scope="col">Time</th>
                                            <th scope="col">Max speed</th>
                                            <th scope="col">Distance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{item.elapsed_time}</td>
                                                <td>{item.max_speed} m/s</td>
                                                <td>{item.distance} m</td>
                                            </tr>
                                        </tbody>
                                        
                                    </table>
                                </div>
                                {item.start_latlng.length>0?
                                <img className="map-image" src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${item.start_latlng[1]},${item.start_latlng[0]},14/568x218?access_token=pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg`}></img>
                                :<h4 style={{paddding:10,fontWeight:'bold',color:"#008A8A"}}>This workout doesn't have a map</h4>}
                            </div>
                        </div>
                    </a>
                    )):<Typography variant="h3">There are no activities</Typography>}
                <div class="card text-center">
                    <div class="card-header">
                        Start now
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Record your first workout</h5>
                        <div class="card-text">You can start by recording your first workout from the Strava mobile application or you can add it manually both in this application and Strava</div>
                        <a style={{marginTop:10 ,backgroundColor:"#00ADAD",color:"white"}} href="/create-activity" class="btn">Add manually</a>
                    </div>
                </div>
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
                <h3 style={{paddingTop:30,paddingBottom:50,fontWeight:'bold',color:"#008A8A"}}>Activity feed</h3>
                    <div className="d-flex">
                        <div className="home-profile-stats">
                            <div className="mr-auto p-2 profile-pic-container"><img className="profileImage" src={userInfo.profile}></img></div>
                            <div style={{paddingTop:30}} className="d-flex flex-sm-row flex-column bd-highlight mb-3">
                                <div class="card text-dark mb-3 stats-profile-container">
                                    <div class="card-body">
                                        <div className="d-flex flex-sm-row flex-column align-content-center">
                                            <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities-followers">
                                                <div className="mr-auto p-2">Followers</div>
                                                <div className="mr-auto p-2">{userInfo.follower_count}</div>
                                            </div>
                                            <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities">
                                                    <div className="mr-auto p-2">Activities</div>
                                                    <div className="mr-auto p-2">{activities.length}</div>
                                                </div>
                                            <div class="d-flex flex-column bd-highlight mb-3 profile-recent-activities">
                                                <div className="mr-auto p-2">Weight</div>
                                                <div className="mr-auto p-2">{(Math.round(userInfo.weight * 100) / 100).toFixed(2)} kg</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {renderActivities()}
                        <div style={{width:'100%'}} class="text-center home-profile-stats-kcal">
                            <div class="card text-dark mb-3 stats-profile-container">
                                <div class="card-body text-center">
                                    <h4 style={{fontWeight:"bold"}}>Kcal goal</h4>
                                    <h4 style={{color:"#008A8A",fontWeight:"bold"}}>{kcalGoal} kcal</h4>
                                    <h4 style={{fontWeight:"bold"}}>Today's calories</h4>
                                    <h4 style={{color:"#008A8A",fontWeight:"bold"}}>{totalKcal} kcal</h4>
                                    <h4 style={{fontWeight:"bold"}}>Remaining calories</h4>
                                    <h4 style={{color:"#008A8A",fontWeight:"bold"}}>{kcalGoal-totalKcal} kcal</h4>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            {/* <img style={{width:"100%"}} src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-a+9ed4bd(-122.46589,37.77343),pin-s-b+000(-122.42816,37.75965),path-5+f44-0.5(%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM)/auto/500x200?access_token=pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg`}></img> */}
        </Grid>
    )
    
}

export default Home
