import React from 'react'

const TablesDailyFood = (props) => {
    return (
        <div>
            <h4 style={{paddingBottom:20}}>{props.meal}</h4>
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
                    
                    {props.renderDailyFood()}
                </table>
            </div>
            <a href={`/add-food/${props.meal.toLowerCase()}/${props.user_id}/${props.currentDate}?#`} class="btn" style={{backgroundColor:"#00ADAD",color:"white",marginTop:10,marginBottom:40}}>+ Add food</a>
        </div>
    )
}

export default TablesDailyFood
