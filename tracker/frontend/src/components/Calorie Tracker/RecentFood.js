import React,{useState,useEffect} from 'react'
import { Typography,TextField,Button,Grid,FormControl} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getInputUnstyledUtilityClass, getListItemSecondaryActionClassesUtilityClass } from '@mui/material';

const RecentFood = (props) => {

    const time = props.match.params.time
    const user_id = props.match.params.user_id
    const currentDate = props.match.params.date

    const [allFood,setAllFood] = useState([])
    const [searched,setSearched] = useState('')
    const [recentFoods,setRecentFoods] = useState([])
    const [searchedInRecent,setSearchedInRecent] = useState([])
    const [outsideSearch,setOutsideSearch] = useState([])
    const [boolOutsideSearch,setBoolOutsideSearch] = useState(false)
    const [addProductId,setAddProductId] = useState(0)
    const [quantity,setQuantity] = useState(0)
    const [macrosDetails,setMacrosDetails] = useState([])
    const noFood = ["No food"]

    function getAllProducts(){
        fetch("/api/get-all-products")
        .then((res)=>res.json())
        .then((data)=>setAllFood(data))
    }

    function searchFood(){
        const requestOptions={
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
                product:searched
            })
        }
        fetch("/api/search-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setOutsideSearch(data)
            setBoolOutsideSearch(true)
        })
    }

    function handleOnChangeSearch(event){
        setSearched(event.target.value);
        setSearchedInRecent(recentFoods.filter(item=>item.product_name.includes(event.target.value)?item:null))
        setOutsideSearch([])
    
    }
    
    function getRecentFoods(){
        const requestOptions={
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body:JSON.stringify({
                creator:user_id,
            })
        }
        fetch('/api/get-recent-food',requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
            setRecentFoods(data)
        })
    }
    function addDailyFood(){
        const result = allFood.filter(item=>item.id==addProductId)//get the item with that id from all food
        var funcQuantity=quantity;
        if(quantity == 0) {
            funcQuantity=result[0].quantity
        }
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                creator:user_id,
                meal:time,
                product_name:result[0].product,
                quantity:funcQuantity,
                kcal:Math.floor((result[0].kcal*funcQuantity)/result[0].quantity),
                proteins:Math.floor((result[0].proteins*funcQuantity)/result[0].quantity),
                carbs:Math.floor((result[0].carbs*funcQuantity)/result[0].quantity),
                fats:Math.floor((result[0].fats*funcQuantity)/result[0].quantity),
                sugars:Math.floor((result[0].sugars*funcQuantity)/result[0].quantity),
                fibers:Math.floor((result[0].fibers*funcQuantity)/result[0].quantity),
                date:currentDate,
                product_id:addProductId
            })
        }
        fetch("/api/add-daily-food",requestOptions)
        .then((res)=>res.json())
        .then((data)=>null)

        //add the product to recent food if it isn't already there
        const recentFoodRequestOptions = {
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                creator:user_id,
                product_name:result[0].product,
                product_id:addProductId,
                grams:result[0].quantity,
                kcal:result[0].kcal,
            })
        }
        fetch("/api/add-recent-food",recentFoodRequestOptions)
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        
    }
    function getMacros(id){
        setMacrosDetails(allFood.filter(item=>item.id==id))
        console.log(macrosDetails[0])
    }
    function handleQuantityChange(event){
        setQuantity(event.target.value)
    }
    function renderRecentFoods(){
        if(searched.length==0){
            return(
                <Grid item xs={12}>
                    {recentFoods.length>0?recentFoods.map((item)=>(
                        <div className="card" style={{marginBottom:20,backgroundColor:"#00737B",borderRadius:30,padding:10,color:"white"}}>
                            <div style={{marginTop:10}} class="d-flex justify-content-between">
                                <div class="p-2">
                                    <h5>{item.product_name.length>35?item.product_name:item.product_name}</h5>
                                </div>
                                <div class="p-2">
                                    <h6>{item.grams} (g)</h6>
                                </div>
                                <div class="p-2">
                                    <h6>{item.kcal} kcal</h6>
                                </div>
                                <div class="p-2">
                                    <button onClick={()=>{setAddProductId(item.product_id);getMacros(item.product_id)}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">+</button>

                                    <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        {/* OPEN THE MODAL TO SET THE QUANTITY */}
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <div className="table-responsive card">
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
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
                                                                <td>{macrosDetails.length>0?macrosDetails[0].quantity:null} (g)</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].kcal:null}</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].proteins:null} (g)</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].carbs:null} (g)</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].fats:null} (g)</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].sugars:null} (g)</td>
                                                                <td>{macrosDetails.length>0?macrosDetails[0].fibers:null} (g)</td>
                                                            </tr>
                                                        </tbody>
                                                        
                                                        
                                                    </table>
                                                </div>
                                            </div>
                                            <div class="modal-body">
                                                <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1" class="form-label">Grams</label>
                                                    <input onChange={handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={()=>{addDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}}>+ Add</a>
                                            </div>
                                            </div>
                                        </div>
                                        {/* END THE MODAL */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products</Typography></Grid>}
                </Grid>
            )
        }
        else{
            if(boolOutsideSearch==true){
                return(
                    <Grid item xs={12}>
                        {outsideSearch.length>0?outsideSearch.map((item)=>(
                            
                            <div className="card" style={{marginBottom:20,backgroundColor:"#00737B",borderRadius:30,padding:10,color:"white"}}>
                                <div style={{marginTop:10}} class="d-flex justify-content-between">
                                    <div class="p-2">
                                        <h5>{item.product.length>35?item.product:item.product}</h5>
                                    </div>
                                    <div class="p-2">
                                        <h6>{item.quantity} (g)</h6>
                                    </div>
                                    <div class="p-2">
                                        <h6>{item.kcal} kcal</h6>
                                    </div>
                                    <div class="p-2">
                                        <button onClick={()=>{setAddProductId(item.product_id);getMacros(item.product_id)}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">+</button>

                                        <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            {/* OPEN THE MODAL TO SET THE QUANTITY */}
                                            <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content">
                                                <div class="modal-header">
                                                    <div className="table-responsive card">
                                                        <table class="table table-striped">
                                                            <thead>
                                                                <tr>
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
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].quantity:null} (g)</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].kcal:null}</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].proteins:null} (g)</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].carbs:null} (g)</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].fats:null} (g)</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].sugars:null} (g)</td>
                                                                    <td>{macrosDetails.length>0?macrosDetails[0].fibers:null} (g)</td>
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
                                                    <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={()=>{addDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}}>+ Add</a>
                                                </div>
                                                </div>
                                            </div>
                                            {/* END OF THE MODAL */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products</Typography></Grid>}
                    </Grid>
                )
            }
            else{
                return(
                    <Grid item xs={12}>
                        {searchedInRecent.length>0?searchedInRecent.map((item)=>(
                            
                                <div className="card" style={{marginBottom:20,backgroundColor:"#00737B",borderRadius:30,padding:10,color:"white"}}>
                                    <div style={{marginTop:10}} class="d-flex justify-content-between">
                                        <div class="p-2">
                                            <h5>{item.product_name.length>35?item.product_name:item.product_name}</h5>
                                        </div>
                                        <div class="p-2">
                                            <h6>{item.grams} (g)</h6>
                                        </div>
                                        <div class="p-2">
                                            <h6>{item.kcal} kcal</h6>
                                        </div>
                                        {/* OPEN THE MODAL TO SET THE QUANTITY */}
                                        <div class="p-2">
                                            <button onClick={()=>{setAddProductId(item.product_id);getMacros(item.product_id)}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} data-bs-toggle="modal" data-bs-target="#exampleModal">+</button>

                                            <div style={{color:"black"}} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <div className="table-responsive card">
                                                                <table class="table table-striped">
                                                                    <thead>
                                                                        <tr>
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
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].quantity:null} (g)</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].kcal:null}</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].proteins:null} (g)</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].carbs:null} (g)</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].fats:null} (g)</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].sugars:null} (g)</td>
                                                                            <td>{macrosDetails.length>0?macrosDetails[0].fibers:null} (g)</td>
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
                                                            <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={()=>{addDailyFood()}} type="button" class="btn" style={{backgroundColor:"#00ADAD",color:"white"}}>+ Add</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* MODAL END */}
                                    </div>
                                </div>
                        )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products</Typography></Grid>}
                    </Grid>
                )
            }
        }
    }

    useEffect(()=>{
        getRecentFoods()
        getAllProducts()
    },[])
    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                <h3 style={{paddingTop:30,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>Search food</h3>
                {/* SEARCH BAR */}
                <form action="#" class="input-group mb-3" onSubmit={()=>{searchFood();return false}}>
                    <input onChange={handleOnChangeSearch} type="text" class="form-control" placeholder="Search for food" aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                    <button class="btn" style={{backgroundColor:"#00ADAD",color:"white"}} type="submit" id="button-addon2">Search</button>
                </form>
                <a class="btn btn-outline-dark" href={`/create-food/${user_id}`}>Add new recipe</a>
                {/* END OF SEARCH BAR */}
                <h3 style={{paddingTop:30,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>Recent food</h3>
                {renderRecentFoods()}
            </div>
        </Grid>
    )
}

export default RecentFood
