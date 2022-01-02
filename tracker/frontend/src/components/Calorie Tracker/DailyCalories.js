import React,{useState,useEffect} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,styled,tableCellClasses} from "@mui/material"
import {Typography,Button,FormControl,Grid} from "@material-ui/core"
import {makeStyles} from '@material-ui/core';
import { RowsIcon } from '@primer/octicons-react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1A74BA",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

const DailyCalories = (props) => {

    const user_id = props.match.params.user_id
    // var currentDate = props.match.params.date


    const [stravaAuthenticated,setStravaAuthenticated] = useState(false)
    const [dailyFood,setDailyFood] = useState([])
    const [currentDate,setCurrentDate] = useState(props.match.params.date)

    //FOR EDIT FUNCTION
    const [editProductId,setEditProductId] = useState(0)//THE PRODUCT ID
    const [editUserProductId,setEditUserProductId] = useState(0) //THE ID IN USER DAILY FOOD
    const [editQuantity,setEditQuantity] = useState(0)
    const [editQuantityBackup,setEditQuantityBackup] = useState(0)//IF THE EDIT QUANTITY IS 0
    const [editMeal,setEditMeal] = useState('')

    //MACROS TOTAL
    const [totalKcal,setTotalKcal] = useState(0)
    const [totalProteins,setTotalProteins] = useState(0)
    const [totalCarbs,setTotalCarbs] = useState(0)
    const [totalFats,setTotalFats] = useState(0)
    const [totalSugar,setTotalSugar] = useState(0)
    const [totalFibers,setTotalFibers] = useState(0)

    //KCAL GOAL
    const [kcalGoal,setKcalGoal] = useState(localStorage.getItem("kcalGoal"))




    var niceCurrentDate = new Date(currentDate).toDateString()


    function authenticateStrava(){
        fetch('/strava/is_authenticated')
        .then((res)=>res.json())
        .then((data)=>{
            setStravaAuthenticated(data.status)
            if(!data.status){
                fetch("/strava/get-auth-url")
                .then((res)=>res.json())
                .then((data)=>{
                    window.location.replace(data.url)//redirect to the strava url
                })
            }
        })
    }
    function getUserDailyFood(){
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                creator:user_id,
                date:currentDate
            })
        }
        fetch("/api/get-daily-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setDailyFood(data)
            data.map((item)=>{
                setTotalKcal(kcal=>kcal+item.kcal);
                setTotalProteins(proteins=>proteins+item.proteins)
                setTotalCarbs(carbs=>carbs+item.carbs)
                setTotalFats(fats=>fats+item.fats)
                setTotalSugar(sugar=>sugar+item.sugars)
                setTotalFibers(fibers=>fibers+item.fibers)
            })
            
        })
    }
    //edit daily food
    function editDailyFood(){
        const requestOptions = {
            method:"PUT",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                quantity:editQuantity!=0?editQuantity: editQuantityBackup,
                daily_food_id:editUserProductId,
                product_id:editProductId,
                meal:editMeal,
                date:currentDate,
                creator:user_id,
            })
        }
        fetch("/api/edit-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setTotalKcal(0)
            setTotalProteins(0)
            setTotalCarbs(0)
            setTotalFats(0)
            setTotalFibers(0)
            setTotalSugar(0)

            getUserDailyFood()
        })
        
    }

    //DELETE DAILY FOOD
    function deleteDailyFood(product_id,id,meal){
        const requestOptions ={
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                creator:user_id,
                date:currentDate,
                product_id:product_id,
                meal:meal,
                daily_food_id:id
            })
        }
        fetch("/api/delete-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setTotalKcal(0)
            setTotalProteins(0)
            setTotalCarbs(0)
            setTotalFats(0)
            setTotalFibers(0)
            setTotalSugar(0)

            getUserDailyFood()
        })
    }

    function handleMinusDate(){//handle date change(previous date)
        var newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() - 1)
        setCurrentDate(newDate.toISOString().slice(0,10))
        niceCurrentDate = newDate

    }
    function handlePlusDate(){//handle date change(next day)
        var newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() +1)
        setCurrentDate(newDate.toISOString().slice(0,10))
        niceCurrentDate = newDate
    }
    function handleQuantityChange(event){
        setEditQuantity(event.target.value)
    }
    function editButtonClick(product_id,id,meal,backupQuantity){
        setEditProductId(product_id);
        setEditMeal(meal);
        setEditUserProductId(id)
        setEditQuantityBackup(backupQuantity)
    }

    function renderDailyFoodBreakfast(){
        var dailyFoodBreakfast =[]
        if(dailyFood.length>0){
            dailyFood.map((item)=>{
                if(item.meal=='breakfast'){
                    dailyFoodBreakfast.push(item)
                }
            })
            return(
                <tbody>
                {dailyFoodBreakfast.length>0?dailyFoodBreakfast.map((row) => (
                    <tr>
                         <td>{row.product_name}</td>
                        <td>{row.quantity} (g)</td>
                        <td>{row.kcal}</td>
                        <td>{row.proteins} (g)</td>
                        <td>
                            <button onClick={()=>editButtonClick(row.product_id,row.id,"breakfast",row.quantity)} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td><button style={{color:"red"}} className="btn" onClick={()=>{deleteDailyFood(row.product_id,row.id,"breakfast")}}>&#10006;</button></td>
                        <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            {/* OPEN THE MODAL TO SET THE QUANTITY */}
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <div className="table-responsive card">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    {/* CHANGE HERE */}
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Total kcal</th>
                                                    <th scope="col">Total proteins</th>
                                                    <th scope="col">Total carbs</th>
                                                    <th scope="col">Total fats</th>
                                                    <th scope="col">Total sugar</th>
                                                    <th scope="col">Total fibers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{row.quantity} (g)</td>
                                                    <td>{row.kcal}</td>
                                                    <td>{row.proteins} (g)</td>
                                                    <td>{row.carbs}(g)</td>
                                                    <td>{row.fats}(g)</td>
                                                    <td>{row.sugars}(g)</td>
                                                    <td>{row.fibers}(g)</td>
                                                </tr>
                                            </tbody>
                                            
                                            
                                        </table>
                                        </div>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                        <label for="exampleInputEmail1" class="form-label">Grams</label>
                                        <input onChange={handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button onClick={()=>{editDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-dismiss="modal">+ Add</button>
                                </div>
                                </div>
                            </div>
                            {/* END THE MODAL */}
                        </div>
                        
                    </tr>
                )):null}
                </tbody>
                
            )
        }

    }
    function renderDailyFoodLunch(){
        var dailyFoodLunch =[]
        if(dailyFood.length>0){
            dailyFood.map((item)=>{
                if(item.meal=='lunch'){
                    dailyFoodLunch.push(item)
                }
            })
            return(
                <tbody>
                {dailyFoodLunch.length>0?dailyFoodLunch.map((row) => (
                    <tr>
                         <td>{row.product_name}</td>
                        <td>{row.quantity} (g)</td>
                        <td>{row.kcal}</td>
                        <td>{row.proteins} (g)</td>
                        <td>
                            <button onClick={()=>editButtonClick(row.product_id,row.id,"lunch",row.quantity)} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td><button style={{color:"red"}} className="btn" onClick={()=>{deleteDailyFood(row.product_id,row.id,"lunch")}}>&#10006;</button></td>
                    </tr>
                )):null}
                    <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        {/* OPEN THE MODAL TO SET THE QUANTITY */}
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Grams</label>
                                    <input onChange={handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={()=>{editDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-dismiss="modal">+ Add</button>
                            </div>
                            </div>
                        </div>
                        {/* END THE MODAL */}
                    </div>
                </tbody>
            )
    
        }
    }
    function renderDailyFoodDinner(){
        var dailyFoodDinner =[]
        if(dailyFood.length>0){
            dailyFood.map((item)=>{
                if(item.meal=='dinner'){
                    dailyFoodDinner.push(item)
                }
            })
            return(
                <tbody>
                {dailyFoodDinner.length>0?dailyFoodDinner.map((row) => (
                    <tr>
                         <td>{row.product_name}</td>
                        <td>{row.quantity} (g)</td>
                        <td>{row.kcal}</td>
                        <td>{row.proteins} (g)</td>
                        <td>
                            <button onClick={()=>editButtonClick(row.product_id,row.id,"dinner",row.quantity)} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td><button style={{color:"red"}} className="btn" onClick={()=>{deleteDailyFood(row.product_id,row.id,"dinner")}}>&#10006;</button></td>
                    </tr>
                )):null}
                    <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        {/* OPEN THE MODAL TO SET THE QUANTITY */}
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Grams</label>
                                    <input onChange={handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={()=>{editDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-dismiss="modal">+ Add</button>
                            </div>
                            </div>
                        </div>
                        {/* END THE MODAL */}
                    </div>
                </tbody>
            )
        }

    }
    function renderDailyFoodSnack(){
        var dailyFoodSnack =[]
        if(dailyFood.length>0){
            dailyFood.map((item)=>{
                if(item.meal=='snack'){
                    dailyFoodSnack.push(item)
                }
            })
            return(
                <tbody>
                {dailyFoodSnack.length>0?dailyFoodSnack.map((row) => (
                    <tr>
                         <td>{row.product_name}</td>
                        <td>{row.quantity} (g)</td>
                        <td>{row.kcal}</td>
                        <td>{row.proteins} (g)</td>
                        <td>
                            <button onClick={()=>editButtonClick(row.product_id,row.id,"snack",row.quantity)} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td><button style={{color:"red"}} className="btn" onClick={()=>{deleteDailyFood(row.product_id,row.id,"snack")}}>&#10006;</button></td>
                    </tr>
                )):null}
                    <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        {/* OPEN THE MODAL TO SET THE QUANTITY */}
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Grams</label>
                                    <input onChange={handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={()=>{editDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-dismiss="modal">+ Add</button>
                            </div>
                            </div>
                        </div>
                        {/* END THE MODAL */}
                    </div>
                </tbody>
            )
        }
        
    }

    useEffect(()=>{
        authenticateStrava()
        getUserDailyFood()
        // getKcalGoal()
    },[])
    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                <h3 style={{paddingTop:30,paddingBottom:50,fontWeight:'bold',color:"#008A8A"}}>Daily food</h3>
                {kcalGoal>0?null:<h4 style={{paddingTop:30,paddingBottom:50,fontWeight:'bold',color:"#008A8A"}}><a style={{textDecoration:"none"}} href={`/set-kcal-goal/${user_id}`}>Set kcal goal</a></h4>}
                {/* CURRENT DATE */}
                <div style={{paddingBottom:30}} class="d-flex justify-content-center">
                    <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={handleMinusDate} className="btn"><i class="fas fa-chevron-left"></i></a>
                    <h4 style={{paddingTop:10,paddingLeft:10,paddingRight:10,color:"#008A8A"}}>{niceCurrentDate}</h4>
                    <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={handlePlusDate} className="btn"><i class="fas fa-chevron-right"></i></a>
                </div>
                {/* BREAKFAST */}
                <h4 style={{paddingBottom:20}}>Breakfast</h4>
                <div className="table-responsive card">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Food name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Proteins</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        
                        {renderDailyFoodBreakfast()}
                    </table>
                </div>
                <a href={`/add-food/breakfast/${user_id}/${currentDate}`} class="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:5}}>+ Add food</a>
                {/* LUNCH */}
                <h4 style={{paddingBottom:20,paddingTop:30}}>Lunch</h4>
                <div className="table-responsive card">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Food name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Proteins</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        
                        {renderDailyFoodLunch()}
                    </table>
                </div>
                <a href={`/add-food/lunch/${user_id}/${currentDate}`} class="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:5}}>+ Add food</a>
                {/* DINNER */}
                <h4 style={{paddingBottom:20,paddingTop:30}}>Dinner</h4>
                <div className="table-responsive card">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Food name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Proteins</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        
                        {renderDailyFoodDinner()}
                    </table>
                </div>
                <a href={`/add-food/dinner/${user_id}/${currentDate}`} class="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:5}}>+ Add food</a>
                {/* Snack*/}
                <h4 style={{paddingBottom:20,paddingTop:30}}>Snack</h4>
                <div className="table-responsive card">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Food name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Kcal</th>
                                <th scope="col">Proteins</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        
                        {renderDailyFoodSnack()}
                    </table>
                </div>
                <a href={`/add-food/snack/${user_id}/${currentDate}`} class="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:5}}>+ Add food</a>
                <h3 style={{paddingTop:80,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>Total food</h3>
                <div className="table-responsive card">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Total kcal</th>
                                <th scope="col">Total proteins</th>
                                <th scope="col">Total carbs</th>
                                <th scope="col">Total fats</th>
                                <th scope="col">Total sugar</th>
                                <th scope="col">Total fibers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{totalKcal}</td>
                                <td>{totalProteins} (g)</td>
                                <td>{totalCarbs}</td>
                                <td>{totalFats} (g)</td>
                                <td>{totalSugar} (g)</td>
                                <td>{totalFibers} (g)</td>
                            </tr>
                        </tbody>
                        
                        
                    </table>
                </div>
                <h3 style={{paddingTop:30,paddingBottom:50,fontWeight:'bold',color:"#008A8A"}}>Remaining kcal: {kcalGoal-totalKcal}</h3>
            </div>
        </Grid>
    )
}

export default DailyCalories
