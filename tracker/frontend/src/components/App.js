import React,{ useRef, useEffect, useState } from 'react'
import {BrowserRouter as Router,Switch,Route,Link,Redirect,} from "react-router-dom";
import Home from './Strava Tracker/Home';
import Sidebar from './Sidebar'
import Profile from './Strava Tracker/Profile';
import CreateActivity from './Strava Tracker/CreateActivity'
import Activities from './Strava Tracker/Activities';
import ActivityDetails from './Strava Tracker/ActivityDetails'
import UpdateActivity from './Strava Tracker/UpdateActivity'
import DailyCalories from './Calorie Tracker/DailyCalories';
import RecentFood from './Calorie Tracker/RecentFood';
import CreateFood from './Calorie Tracker/CreateFood';
import SetKcalGoal from './Calorie Tracker/SetKcalGoal';
import Footer from './Footer';

const App = () => {
    
    const [userInfo,setUserInfo] = useState([])
 
    return (
        <Router>
            <Sidebar/>
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/profile" component={Profile}></Route>
                <Route exact path="/create-activity" component={CreateActivity}></Route>
                <Route exact path="/activities" component={Activities}></Route>
                <Route exact path="/activity-details/:id" component={ActivityDetails}></Route>
                <Route exact path="/update-activity/:id" component={UpdateActivity}></Route>
                <Route exact path="/daily-calories/:user_id/:date" component={DailyCalories}></Route>
                <Route exact path="/add-food/:time/:user_id/:date" component={RecentFood}></Route>
                <Route exact path="/create-food/:user_id" component={CreateFood}></Route>
                <Route exact path="/set-kcal-goal/:user_id" component={SetKcalGoal}></Route>
            </Switch>
            <Footer/>
        </Router>
    )
}

export default App
