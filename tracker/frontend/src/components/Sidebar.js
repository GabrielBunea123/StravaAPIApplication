import React,{useState,useEffect} from 'react'
import {Button,Grid, Typography} from '@material-ui/core'
import {PersonIcon} from '@primer/octicons-react'

const Sidebar = () => {
    const [toggled,setToggled] = useState(false)
    const [userInfo,setUserInfo] = useState([])
    const currentDate = new Date().toJSON().slice(0,10);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    function sidebarOpen(){
        setToggled(true)
    }
    function sidebarClose(){
        setToggled(false)
    }
    function UserDetails(){
        fetch("/strava/authenticated-user")
        .then((res)=>res.json())
        .then((data)=>{setUserInfo(data);})
    }

    //window dimenssions
    function getWindowDimensions() {
        const {
           innerWidth: width,
           innerHeight: height
        } = window;
        return {
           width,
           height
        };
    }

    useEffect(()=>{
        UserDetails()

        //when resizing the screen
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[])

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark" style={{backgroundColor:"#008A8A"}}>
                <div class={windowDimensions.width<=992?"container-fluid":"container-fluid container"}>
                    <a style={{fontWeight:"bold"}} class="navbar-brand item-nav-space side-item-font" href="/">Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown item-nav-space">
                            <a style={{fontWeight:"bold"}} class="nav-link navbar-brand dropdown-toggle active side-item-font" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Activities
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a style={{fontWeight:"bold"}} class="dropdown-item" href="/activities">My activities</a></li>
                                <li><a style={{fontWeight:"bold"}} class="dropdown-item" href="/create-activity">Create Activity</a></li>
                            </ul>
                        </li>
                        <li class="nav-item item-nav-space">
                            <a style={{fontWeight:"bold"}} class="nav-link navbar-brand active side-item-font" href={`/daily-calories/${userInfo.id}/${currentDate}`}>Daily calories</a>
                        </li>
                        
                    </ul>
                    {/* RIGHT SIDE OF THE NAV */}
                    <form class="d-flex">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item active item-nav-space">
                                <a style={{fontWeight:"bold"}} class="nav-link navbar-brand side-item-font" href={`/profile`}><i class="far fa-user"></i> Profile</a>
                            </li>
                            {/* <li class="nav-item active item-nav-space">
                                <a class="nav-link navbar-brand" href={`/create-food/${userInfo.id}`}>New recipe</a>
                            </li> */}
                            <li class="nav-item active item-nav-space">
                                <a style={{fontWeight:"bold"}} href={`/set-kcal-goal/${userInfo.id}`} class="nav-link navbar-brand side-item-font"><i class="fas fa-cog"></i></a>
                            </li>
                        </ul>
                    </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar
