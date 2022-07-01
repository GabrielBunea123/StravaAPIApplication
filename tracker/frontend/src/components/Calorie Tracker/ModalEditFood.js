import React from 'react'
//when edit click on the daily food page
const ModalEditFood = (props) => {
    return (
        <div style={{ color: "black" }} class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            <input onChange={props.quantityChange} placeHolder="Quantity (g)" type="number" class="form-control"></input>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={props.editFood} type="button" class="btn" style={{ backgroundColor: "#00ADAD", color: "white" }} data-bs-dismiss="modal">Edit</button>
                    </div>
                </div>
            </div>
            {/* END THE MODAL */}
        </div>
    )
}

export default ModalEditFood
