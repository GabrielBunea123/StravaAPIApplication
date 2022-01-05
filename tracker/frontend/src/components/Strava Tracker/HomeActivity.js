import React from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const HomeActivity = (props) => {
    return (
        <a style={{textDecoration:"none",color:"black"}} href={`/activity-details/${props.id}`}>
            <div class="card home-card" style={{marginBottom:60,backgroundColor:"#f5f5f5",boxShadow:5}}>
                <div class="card-body">
                    <h3 style={{fontWeight:"bold"}} class="card-title">{props.name} <FitnessCenterIcon/></h3>
                    <small>{props.start_date} {props.city}, {props.state}, {props.country}</small>
                    <div className="table-responsive">
                        <table class="table" style={{textAlign:"center",marginTop:20}}>
                            <thead>
                                <tr>
                                <th scope="col"><h5>Time</h5></th>
                                <th scope="col"><h5>Max speed</h5></th>
                                <th scope="col"><h5>Distance</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th><h6>{props.elapsed_time}</h6></th>
                                    <td><h6>{props.max_speed} m/s</h6></td>
                                    <td><h6>{props.distance} m</h6></td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                    {props.start_latlng.length>0?
                    <img className="map-image" style={{width:"100%"}} src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${props.start_latlng[1]},${props.start_latlng[0]},14/1200x300?access_token=pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg`}></img>
                    :<h4 style={{paddding:10,fontWeight:'bold',color:"#008A8A"}}>This workout has no map</h4>}
                </div>
            </div>
        </a>
    )
}

export default HomeActivity
