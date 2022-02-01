import React,{useState} from 'react'
import {Grid,Collapse} from '@material-ui/core'
import {Alert} from "@material-ui/lab"

const CreateFood = (props) => {

    const user_id = props.match.params.user_id

    const [addedProduct,setAddedProduct] = useState([])
    const [name,setName] = useState('')
    const [quantity,setQuantity] = useState(0)
    const [kcal,setKcal] = useState(0)
    const [proteins,setProteins] = useState(0)
    const [carbs,setCarbs] = useState(0)
    const [fats,setFats] = useState(0)
    const [sugar,setSugar] = useState(0)
    const [fibers,setFibers] = useState(0)
    const [successMsg,setSuccessMsg] = useState('')
    const [errorMsg,setErrorMsg] = useState('')

    function handleNameChange(event){
        setName(event.target.value)
    }
    function handleQuantityChange(event){
        setQuantity(event.target.value)
    }
    function handleKcalChange(event){
        setKcal(event.target.value)
    }
    function handleProteinsChange(event){
        setProteins(event.target.value)
    }
    function handleCarbsChange(event){
        setCarbs(event.target.value)
    }
    function handleFatsChange(event){
        setFats(event.target.value)
    }
    function handleSugarChange(event){
        setSugar(event.target.value)
    }
    function handleFibersChange(event){
        setFibers(event.target.value)
    }
    function addProduct(){
        const requestOptions = {
            method: 'POST',
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                product:name,
                quantity:quantity,
                kcal:kcal,
                proteins:proteins,
                carbs:carbs,
                fats:fats,
                sugars:sugar,
                fibers:fibers

            })
        }
        fetch("/api/add-product",requestOptions)
        .then((res)=>res.json())
        .then((data)=>{
           //add the product to recent food if it isn't already there
            const recentFoodRequestOptions = {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify({
                    creator:user_id,
                    product_name:name,
                    product_id:data.product_id,
                    grams:quantity,
                    kcal:kcal,
                    proteins:proteins,
                    carbs:carbs,
                    fats:fats,
                    sugars:sugar,
                    fibers:fibers
                })
            }
            fetch("/api/add-recent-food",recentFoodRequestOptions)
            .then((resRecent)=>{
                if(resRecent.ok){
                    setSuccessMsg("The recipe has been added")
                }
                else{
                    setErrorMsg("There has been an error, try again")
                }
            })
            .then((dataRecent)=>console.log(dataRecent))
        })

    }
    
    return (
        <Grid container spacing={1} className="all-container">
            <div className="container">
                <Grid style={{paddingTop:10}} item xs = {12} align="center">
                    <Collapse in={errorMsg.length>0 || successMsg.length>0}>
                        {successMsg.length>0 ?(<Alert severity="success">{successMsg}</Alert>):(<Alert severity="error">{errorMsg}</Alert>)}
                    </Collapse>
                </Grid>
                <h3 style={{paddingTop:30,paddingBottom:30,fontWeight:'bold',color:"#008A8A"}}>Create new recipe</h3>
                <div class="card">
                    <div class="card-header">
                        Details
                    </div>
                    <div class="card-body">
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Name</label>
                            <input onChange={handleNameChange} class="form-control" placeholder="Name"></input>
                            <small class="form-text text-muted">The name of the meal/recipe</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Quantity</label>
                            <input onChange={handleQuantityChange} type="number" class="form-control" placeholder="Grams"></input>
                            <small class="form-text text-muted">Enter a valid quantity</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Kcal</label>
                            <input onChange={handleKcalChange} type="number" class="form-control" placeholder="Kcal"></input>
                            <small class="form-text text-muted">The kcal the meal contains</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Proteins</label>
                            <input onChange={handleProteinsChange} type="number" class="form-control" placeholder="Proteins"></input>
                            <small class="form-text text-muted">The proteins the meal contains</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Carbs</label>
                            <input onChange={handleCarbsChange} type="number" class="form-control" placeholder="Carbs"></input>
                            <small class="form-text text-muted">The carbs the meal contains</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Fats</label>
                            <input onChange={handleFatsChange} type="number" class="form-control" placeholder="Fats"></input>
                            <small class="form-text text-muted">The fats the meal contains</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Sugar</label>
                            <input onChange={handleSugarChange} type="number" class="form-control" placeholder="Sugar"></input>
                            <small class="form-text text-muted">The sugar the meal contains</small>
                        </div>
                        <div style={{paddingBottom:20}} className="form-group">
                            <label>Fibers</label>
                            <input onChange={handleFibersChange} type="number" class="form-control" placeholder="Fibers"></input>
                            <small class="form-text text-muted">The fibers the meal contains</small>
                        </div>

                        <Grid item xs={12} align="center">
                            <a style={{textDecoration:'none'}}><button className="btn" onClick={addProduct} style={{backgroundColor:"#00ADAD",color:"white",marginTop:30}}>Create</button></a>    
                        </Grid>
                        <Grid style={{paddingTop:10}} item xs = {12} align="center">
                            <Collapse in={errorMsg !="" || successMsg!=""}>
                                {successMsg !="" ?(<Alert severity="success">{successMsg}</Alert>):(<Alert severity="error">{errorMsg}</Alert>)}
                            </Collapse>

                        </Grid>
                    </div>
                </div>
            </div>

        </Grid>
    )
}

export default CreateFood
