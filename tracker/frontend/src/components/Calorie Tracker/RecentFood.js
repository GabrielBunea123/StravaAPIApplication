import React,{useState,useEffect} from 'react'
import { Typography,TextField,Button,Grid,FormControl} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getInputUnstyledUtilityClass, getListItemSecondaryActionClassesUtilityClass } from '@mui/material';
import OutsideSearch from "./OutsideSearch"
import InsideSearch from "./InsideSearch"
import axios from 'axios'

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

    function handleOnChangeSearch(event){
        setSearched(event.target.value);
        setSearchedInRecent(recentFoods.filter(item=>item.product_name.toLowerCase().includes(event.target.value.toLowerCase())?item:null))
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

    function searchFood(){ //nutritionx food api
        const options = {
            method: 'GET',
            url: `https://nutritionix-api.p.rapidapi.com/v1_1/search/${searched}`,
            params: {fields: 'item_name,item_id,brand_name,nf_calories,nf_total_fat,nf_sugars,nf_protein,nf_total_carbohydrate,nf_serving_weight_grams,nf_dietary_fiber'},
            headers: {
                'x-rapidapi-host': 'nutritionix-api.p.rapidapi.com',
                'x-rapidapi-key': '38a98784d7mshfa9fcbba45b0c2bp1e73dcjsn8da9d4df854d'
            }
        };
          
        axios.request(options).then(function (response) {
            setBoolOutsideSearch(true)
            setOutsideSearch(response.data.hits);
        }).catch(function (error) {
            console.error(error);
        });

    }
    
    function addDailyFoodOutside(){
        const result = outsideSearch.filter(item=>item._id==addProductId)//get the item with that id from all food
        var funcQuantity=quantity;
        if(quantity == 0) {
            funcQuantity=result[0].fields.nf_serving_weight_grams
        }
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                creator:user_id,
                meal:time,
                product_name:result[0].fields.item_name,
                quantity:funcQuantity,
                kcal:Math.floor((result[0].fields.nf_calories*funcQuantity)/result[0].fields.nf_serving_weight_grams),
                proteins:Math.floor((result[0].fields.nf_protein*funcQuantity)/result[0].fields.nf_serving_weight_grams),
                carbs:Math.floor((result[0].fields.nf_total_carbohydrate*funcQuantity)/result[0].fields.nf_serving_weight_grams),
                fats:Math.floor((result[0].fields.nf_total_fat*funcQuantity)/result[0].fields.nf_serving_weight_grams),
                sugars:Math.floor((result[0].fields.nf_sugars*funcQuantity)/result[0].fields.nf_serving_weight_grams),
                fibers:Math.floor((result[0].fields.nf_dietary_fiber*funcQuantity)/result[0].fields.nf_serving_weight_grams),
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
                product_name:result[0].fields.item_name,
                product_id:addProductId,
                grams:result[0].fields.nf_serving_weight_grams,
                kcal:result[0].fields.nf_calories,
                proteins:result[0].fields.nf_protein,
                carbs:result[0].fields.nf_total_carbohydrate,
                fats:result[0].fields.nf_total_fat,
                sugars:result[0].fields.nf_sugars,
                fibers:result[0].fields.nf_dietary_fiber,
            })
        }
        fetch("/api/add-recent-food",recentFoodRequestOptions)
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        
    }
    function addDailyFood(){
        const result = recentFoods.filter(item=>item.product_id==addProductId)//get the item with that id from all food
        console.log(result)
        var funcQuantity=quantity;
        if(quantity == 0) {
            funcQuantity=result[0].grams
        }
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                creator:user_id,
                meal:time,
                product_name:result[0].product_name,
                quantity:funcQuantity,
                kcal:result[0].kcal,
                proteins:result[0].proteins,
                carbs:result[0].carbs,
                fats:result[0].fats,
                sugars:result[0].sugars,
                fibers:result[0].fibers,
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
                product_name:result[0].product_name,
                product_id:addProductId,
                grams:result[0].grams,
                kcal:result[0].kcal,
                proteins:result[0].proteins,
                carbs:result[0].carbs,
                fats:result[0].fats,
                sugars:result[0].sugars,
                fibers:result[0].fibers,
            })
        }
        fetch("/api/add-recent-food",recentFoodRequestOptions)
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        
    }
    function getMacrosOutside(id){
        setMacrosDetails(outsideSearch.filter(item=>item._id==id))
    }
    function getMacros(id){
        console.log(id)
        setMacrosDetails(recentFoods.filter(item=>item.product_id==id))
    }
    function handleQuantityChange(event){
        setQuantity(event.target.value)
    }
    function renderRecentFoods(){
        if(searched.length==0){
            return(
                <Grid item xs={12}>
                    {recentFoods.length>0?recentFoods.map((item)=>(
                        <InsideSearch product={item.product_name} quantity={item.quantity} kcal={item.kcal} user_id={user_id} product_id={item.product_id} setAddProductId={setAddProductId} getMacros={getMacros} macrosDetails={macrosDetails} handleQuantityChange={handleQuantityChange} currentDate={currentDate} addDailyFood={addDailyFood} />
                    )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products named like that</Typography></Grid>}
                </Grid>
            )
        }
        else{
            if(boolOutsideSearch==true){
                return(
                    <Grid item xs={12}>
                        {outsideSearch.length>0?outsideSearch.map((item)=>(
                            <OutsideSearch product={item.fields.item_name} quantity={item.fields.nf_serving_weight_grams} kcal={item.fields.nf_calories} product_id={item.fields.item_id} user_id={user_id} setAddProductId={setAddProductId} getMacros={getMacrosOutside} macrosDetails={macrosDetails} handleQuantityChange={handleQuantityChange} currentDate={currentDate} addDailyFood={addDailyFoodOutside}/>
                        )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products named like that</Typography></Grid>}
                    </Grid>
                )
            }
            else{
                return(
                    <Grid item xs={12}>
                        {searchedInRecent.length>0?searchedInRecent.map((item)=>(
                            <InsideSearch product={item.product_name} quantity={item.quantity} kcal={item.kcal} user_id={user_id} product_id={item.product_id} setAddProductId={setAddProductId} getMacros={getMacros} macrosDetails={macrosDetails} handleQuantityChange={handleQuantityChange} currentDate={currentDate} addDailyFood={addDailyFood} />
                        )):<Grid item xs={12} align="center"><Typography style={{color:"gray"}} variant="h3">There are no recent products named like that</Typography></Grid>}
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
