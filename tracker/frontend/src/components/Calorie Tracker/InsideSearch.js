import React from 'react';

const InsideSearch = (props) => {
    return (
        <ol class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{props.product}</div>
                    {props.kcal} cal per serving
                </div>
                {/* <span class="badge bg-primary rounded-pill">14</span> */}
                <button onClick={() => { props.setAddProductId(props.product_id); props.getMacros(props.product_id) }} className="btn" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-plus"></i></button>

                <div style={{ color: "black" }} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].grams : null} (g)</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].kcal : null}</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].proteins : null} (g)</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].carbs : null} (g)</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].fats : null} (g)</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].sugars : null} (g)</td>
                                                <td>{props.macrosDetails.length > 0 ? props.macrosDetails[0].fibers : null} (g)</td>
                                            </tr>
                                        </tbody>


                                    </table>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <h5 class="modal-title" id="exampleModalLabel">Set the quantity of the food</h5>
                                    <label for="exampleInputEmail1" class="form-label">Grams</label>
                                    <input onChange={props.handleQuantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <a href={`/daily-calories/${props.user_id}/${props.currentDate}`} onClick={() => { props.addDailyFood() }} type="button" class="btn" style={{ backgroundColor: "#00ADAD", color: "white" }}>+ Add</a>
                            </div>
                        </div>
                    </div>
                    {/* END OF THE MODAL */}
                </div>

            </li>

        </ol>
    )
};

export default InsideSearch;
