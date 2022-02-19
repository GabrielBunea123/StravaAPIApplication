import React,{useEffect, useState} from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const HomeActivity = (props) => {

    const [mapCoordinates,setMapCoordinates] = useState([])

    const decodePolyline = () => {
        if(props.polyline){
            var coordinates = L.Polyline.fromEncoded(props.polyline).getLatLngs(); //decoding the polyline
            return(
                <img className="map-image" style={{width:"100%",height:"100%",borderRadius:20}} src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coordinates[0].lng},${coordinates[0].lat},14/1200x300?access_token=pk.eyJ1IjoiYnVuZWEiLCJhIjoiY2t4cWkxZW1xMDlhaDJvbXA3ajgxNjN3YiJ9.J0yOXHYvHos1LeiXnvjKhg`}></img>
            )
            console.log(coordinates[0].lat)
        }
        
    }

    useEffect(()=>{
        decodePolyline();
    },[])


    return (
            <div class="card home-card" style={{marginBottom:60,color:'white',backgroundColor:"#00ADAD",boxShadow:5,borderRadius:20,paddingLeft:10,paddingRight:10}}>
                <a style={{textDecoration:"none",color:"white"}} href={`/activity-details/${props.activity_id}`}>
                    <div class="card-body">
                        <h3 style={{fontWeight:"bold"}} class="card-title">{props.name} <FitnessCenterIcon/></h3>
                        <small>{props.city}, {props.country}</small>
                        <div className="table-responsive">
                            <table class="table" style={{textAlign:"center",marginTop:20,color:"white"}}>
                                <thead>
                                    <tr>
                                    <th scope="col"><h5>Time</h5></th>
                                    <th scope="col"><h5>Date</h5></th>
                                    <th scope="col"><h5>Distance</h5></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th><h6>{props.elapsed_time}</h6></th>
                                        <td><h6>{props.date}</h6></td>
                                        <td><h6>{props.distance} m</h6></td>
                                    </tr>
                                </tbody>
                                
                            </table>
                        </div>
                        {decodePolyline()}
                    </div>
                </a>
            </div>
    )
}

export default HomeActivity
