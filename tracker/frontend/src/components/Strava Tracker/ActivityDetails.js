import React,{useEffect,useState,useRef} from 'react'
import {Button,Grid,Typography,TextField,FormControl} from '@material-ui/core'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import mapboxgl from 'mapbox-gl'; 

const ActivityDetails = (props) => {
    const activity_id=props.match.params.id
    const [activity,setActivity] = useState([])
    const [userInfo,setUserInfo] = useState([])
    const [hasMap,setHasMap] = useState(false)

    //map

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg';

    const mapContainer = useRef(null);
    var map = useRef(null);
    const [zoom, setZoom] = useState(16);
    var mapCoordinates=[]

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
            console.log(data)
            //from ISO 8601 format to normal format date
            var date = new Date(data.start_date)
            data.start_date = date.toLocaleString();
            
            if(data.polyline){

                setHasMap(true)
                //map setup
                var coordinates = L.Polyline.fromEncoded(data.polyline).getLatLngs(); //decoding the polyline
                coordinates.map((item)=>{
                    mapCoordinates.push([item.lng,item.lat])//adding the coordinates to a list
                })

                if (map.current) return; 
                map = new mapboxgl.Map({ //creating the map
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/outdoors-v10',
                    center: [coordinates[0].lng, coordinates[0].lat],
                    zoom: zoom,
                });
                map.on('load', () => {//drawing the line
                    map.addSource('route', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': mapCoordinates
                            }
                        }
                    });
                    map.addLayer({//styling the line
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#00737B',
                            'line-width': 6
                        }
                    });
                });
                //mapsetup
            }
        
            //from seconds convert to readable time
            var elapsed_time = new Date(null);
            elapsed_time.setSeconds(data.elapsed_time); // specify value for SECONDS here
            data.elapsed_time = elapsed_time.toISOString().substr(11,8)
            
            setActivity(data)
        })
    }
    
    const getUser=()=>{
        fetch("/strava/authenticated-user")
        .then((res)=>res.json())
        .then((data)=>{
            setUserInfo(data)
        })
    }


    useEffect(()=>{
        getActivity()
        getUser()
    },[])


    
    // lat: 47.0386, lng: 23.91772

    useEffect(() => {
    });


    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                <h2 style={{paddingTop:30,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>Activity details</h2>
                <div class="card">
                    <div class="card-body">
                        <div className="d-flex flex-sm-row flex-column">
                            <div className="mr-auto p-2 profile-pic-container"><img className="profileImage" src={userInfo.profile_pic}></img></div>
                            <div style={{paddingTop:30}} className="d-flex flex-column bd-highlight mb-3">
                                <div class="text-dark mb-3">
                                    <h3>{activity?activity.name:null}</h3>
                                    <h3 style={{paddingTop:10,fontWeight:"bold"}}>{userInfo? `${userInfo.firstname} ${userInfo.lastname}`:null}</h3>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingTop:10}} className="d-flex flex-sm-row flex-column">
                            <div className="p-2"><i class="fas fa-map-marker-alt"></i> {userInfo.city}, {userInfo.state}, {userInfo.country}</div>
                        </div>
                        <div className="d-flex flex-sm-row flex-column">
                            <div className="p-2">Start date and time: {activity.start_date_local}</div>
                        </div>
                        <div className="d-flex flex-column bd-highlight mb-3 activity-container">
                            <div class="card text-center profile-recent-activities-container">
                                <div class="card-header">
                                    Details
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        
                                        <table class="table" style={{backgroundColor:"white"}}>
                                            <thead>
                                                <tr>
                                                <th scope="col"><Typography variant="p"><FitnessCenterIcon/></Typography></th>
                                                <th scope="col"><Typography variant="h6">Distance</Typography></th>
                                                <th scope="col"><Typography variant="h6">Time</Typography></th>
                                                <th scope="col"><Typography variant="h6">Speed</Typography></th>
                                                <th scope="col"><Typography variant="h6">Calories</Typography></th>
                                                </tr>
                                            </thead>
                                            <thead>
                                                <tr>
                                                    <th scope="col"><Typography variant="h6">{activity?activity.activity_type:null}</Typography></th>
                                                    <th scope="col"><Typography variant="h6">{activity?activity.distance:null} m</Typography></th>
                                                    <th scope="col"><Typography variant="h6">{activity?activity.elapsed_time:null}</Typography></th>
                                                    <th scope="col"><Typography variant="h6">{activity?activity.speed:null} m/s</Typography></th>
                                                    <th scope="col"><Typography variant="h6">{activity?activity.calories:null}</Typography></th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a style={{textDecoration:'none'}} href={`/update-activity/${activity_id}`}><button className='btn' style={{backgroundColor:"#00ADAD",color:"white"}}>Edit</button></a>
                    </div>
                </div>
                <h2 style={{paddingTop:30,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>{hasMap==true?"Your workout map":"This workout has no map"}</h2>
                {hasMap==true?<div style={{height: 700,margin:20,borderRadius:20}} ref={mapContainer} className="map-container"/>:null}
                
            </div>
        </Grid>
    )
}

export default ActivityDetails
