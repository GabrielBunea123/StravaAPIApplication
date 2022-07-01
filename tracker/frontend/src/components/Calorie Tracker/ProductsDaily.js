import React from 'react'

//render all the products in daily food
const ProductsDaily = (props) => {

    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.quantity} (g)</td>
            <td>{props.kcal}</td>
            <td>
                <button onClick={() => props.edit(props.product_id, props.id, props.meal, props.quantity)} type="button" class="btn" style={{ backgroundColor: "#00ADAD", color: "white" }} data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
            <td><button style={{ color: "red" }} className="btn" onClick={() => { props.delete(props.product_id, props.id, props.meal) }}>&#10006;</button></td>
        </tr>
    )
}

export default ProductsDaily
