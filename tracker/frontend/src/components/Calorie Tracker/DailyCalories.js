import { Grid } from "@material-ui/core";
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ModalEditFood from './ModalEditFood';
import ProductsDaily from './ProductsDaily';
import TablesDailyFood from './TablesDailyFood';


const DailyCalories = (props) => {
    const user_id = props.match.params.user_id
    // var currentDate = props.match.params.date


    const [stravaAuthenticated, setStravaAuthenticated] = useState(false)
    const [dailyFood, setDailyFood] = useState([])
    const [allUserFood, setAllUserFood] = useState([])
    const [currentDate, setCurrentDate] = useState(props.match.params.date)

    //FOR EDIT FUNCTION
    const [editProductId, setEditProductId] = useState(0)//THE PRODUCT ID
    const [editUserProductId, setEditUserProductId] = useState(0) //THE ID IN USER DAILY FOOD
    const [editQuantity, setEditQuantity] = useState(0)
    const [editQuantityBackup, setEditQuantityBackup] = useState(0)//IF THE EDIT QUANTITY IS 0
    const [editMeal, setEditMeal] = useState('')

    //MACROS TOTAL
    const [totalKcal, setTotalKcal] = useState(0)
    const [totalProteins, setTotalProteins] = useState(0)
    const [totalCarbs, setTotalCarbs] = useState(0)
    const [totalFats, setTotalFats] = useState(0)
    const [totalSugar, setTotalSugar] = useState(0)
    const [totalFibers, setTotalFibers] = useState(0)

    //KCAL GOAL
    const [kcalGoal, setKcalGoal] = useState(localStorage.getItem("kcalGoal"))




    var niceCurrentDate = new Date(currentDate).toDateString()


    function authenticateStrava() {
        fetch("/strava/is_authenticated")
            .then((res) => res.json())
            .then((data) => {
                setStravaAuthenticated(data.status)
                if (!data.status) {
                    fetch("/strava/get-auth-url")
                        .then((res) => res.json())
                        .then((data) => {
                            window.location.replace(data.url)//redirect to the strava url
                        })
                }
            })
    }
    function getAllDailyFood() {//get all daily food from all days
        const today = new Date()
        var day1 = 0, day2 = 0, day3 = 0, day4 = 0, day5 = 0, day6 = 0, day7 = 0;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                creator: user_id,
            })
        }
        fetch("/api/get-all-daily-food", requestOptions)
            .then((res) => res.json())
            .then((data) => {//filtering data for the chart analysis
                data.map((item, index) => {
                    const newDate = new Date(item.date)
                    if (newDate.getDate() == today.getDate() - 6) {
                        day1 = day1 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate() - 5) {
                        day2 = day2 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate() - 4) {
                        day3 = day3 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate() - 3) {
                        day4 = day4 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate() - 2) {
                        day5 = day5 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate() - 1) {
                        day6 = day6 + item.kcal
                    }
                    else if (newDate.getDate() == today.getDate()) {
                        day7 = day7 + item.kcal
                    }
                })
                var chartData = [
                    { name: "6 days ago", kcal: day1 },
                    { name: "5 days ago", kcal: day2 },
                    { name: "4 days ago", kcal: day3 },
                    { name: "3 days ago", kcal: day4 },
                    { name: "2 days ago", kcal: day5 },
                    { name: "1 day ago", kcal: day6 },
                    { name: "Today", kcal: day7 },
                ]
                setAllUserFood(chartData)
            })

    }
    function getUserDailyFood() {//get daily food from current date
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                creator: user_id,
                date: currentDate
            })
        }
        fetch("/api/get-daily-food", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    setDailyFood(data)
                    data.map((item) => {
                        setTotalKcal(kcal => kcal + item.kcal);
                        setTotalProteins(proteins => proteins + item.proteins)
                        setTotalCarbs(carbs => carbs + item.carbs)
                        setTotalFats(fats => fats + item.fats)
                        setTotalSugar(sugar => sugar + item.sugars)
                        setTotalFibers(fibers => fibers + item.fibers)
                    })
                }


            })
    }
    //edit daily food
    function editDailyFood() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quantity: editQuantity != 0 ? editQuantity : editQuantityBackup,
                daily_food_id: editUserProductId,
                product_id: editProductId,
                meal: editMeal,
                date: currentDate,
                creator: user_id,
            })
        }
        fetch("/api/edit-food", requestOptions)
            .then((res) => res.json())
            .then((data) => {
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
    function deleteDailyFood(product_id, id, meal) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                creator: user_id,
                date: currentDate,
                product_id: product_id,
                meal: meal,
                daily_food_id: id
            })
        }
        fetch("/api/delete-food", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                setTotalKcal(0)
                setTotalProteins(0)
                setTotalCarbs(0)
                setTotalFats(0)
                setTotalFibers(0)
                setTotalSugar(0)

                getUserDailyFood()
            })
    }

    function editButtonClick(product_id, id, meal, backupQuantity) {//edit here
        setEditProductId(product_id);
        setEditMeal(meal);
        setEditUserProductId(id)
        setEditQuantityBackup(backupQuantity)
    }


    function handleMinusDate() {//handle date change(previous date)
        var newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() - 1)
        setCurrentDate(newDate.toISOString().slice(0, 10))
        niceCurrentDate = newDate

    }
    function handlePlusDate() {//handle date change(next day)
        var newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + 1)
        setCurrentDate(newDate.toISOString().slice(0, 10))
        niceCurrentDate = newDate
    }
    function handleQuantityChange(event) {
        setEditQuantity(event.target.value)
    }

    function renderDailyFoodBreakfast() {
        var dailyFoodBreakfast = []
        if (dailyFood.length > 0) {
            dailyFood.map((item) => {
                if (item.meal == 'breakfast') {
                    dailyFoodBreakfast.push(item)
                }
            })
            return (
                <tbody>
                    {dailyFoodBreakfast.length > 0 ? dailyFoodBreakfast.map((row) =>
                        <ProductsDaily
                            edit={editButtonClick}
                            delete={deleteDailyFood}
                            name={row.product_name}
                            quantity={row.quantity.toFixed(2)}
                            kcal={row.kcal.toFixed(2)}
                            proteins={row.proteins.toFixed(2)}
                            product_id={row.product_id}
                            id={row.id}
                            meal="breakfast" />) : null}
                    <ModalEditFood quantityChange={handleQuantityChange} editFood={editDailyFood} />
                </tbody>

            )
        }

    }
    function renderDailyFoodLunch() {
        var dailyFoodLunch = []
        if (dailyFood.length > 0) {
            dailyFood.map((item) => {
                if (item.meal == 'lunch') {
                    dailyFoodLunch.push(item)
                }
            })
            return (
                <tbody>
                    {dailyFoodLunch.length > 0 ? dailyFoodLunch.map((row) =>
                        <ProductsDaily
                            edit={editButtonClick}
                            delete={deleteDailyFood}
                            name={row.product_name}
                            quantity={row.quantity.toFixed(2)}
                            kcal={row.kcal.toFixed(2)}
                            proteins={row.proteins.toFixed(2)}
                            product_id={row.product_id}
                            id={row.id}
                            meal="lunch" />) : null}
                    <ModalEditFood quantityChange={handleQuantityChange} editFood={editDailyFood} />
                </tbody>
            )

        }
    }
    function renderDailyFoodDinner() {
        var dailyFoodDinner = []
        if (dailyFood.length > 0) {
            dailyFood.map((item) => {
                if (item.meal == 'dinner') {
                    dailyFoodDinner.push(item)
                }
            })
            return (
                <tbody>
                    {dailyFoodDinner.length > 0 ? dailyFoodDinner.map((row) =>
                        <ProductsDaily
                            edit={editButtonClick}
                            delete={deleteDailyFood}
                            name={row.product_name}
                            quantity={row.quantity.toFixed(2)}
                            kcal={row.kcal.toFixed(2)}
                            proteins={row.proteins.toFixed(2)}
                            product_id={row.product_id}
                            id={row.id}
                            meal="dinner" />) : null}
                    <ModalEditFood quantityChange={handleQuantityChange} editFood={editDailyFood} />
                </tbody>
            )
        }

    }
    function renderDailyFoodSnack() {
        var dailyFoodSnack = []
        if (dailyFood.length > 0) {
            dailyFood.map((item) => {
                if (item.meal == 'snack') {
                    dailyFoodSnack.push(item)
                }
            })
            return (
                <tbody>
                    {dailyFoodSnack.length > 0 ? dailyFoodSnack.map((row) =>
                        <ProductsDaily
                            edit={editButtonClick}
                            delete={deleteDailyFood}
                            name={row.product_name}
                            quantity={row.quantity.toFixed(2)}
                            kcal={row.kcal.toFixed(2)}
                            proteins={row.proteins.toFixed(2)}
                            product_id={row.product_id}
                            id={row.id}
                            meal="snack" />) : null}
                    <ModalEditFood quantityChange={handleQuantityChange} editFood={editDailyFood} />
                </tbody>
            )
        }

    }

    useEffect(() => {
        authenticateStrava()
        getUserDailyFood()
        getAllDailyFood()
    }, [])
    return (
        <Grid spacing={1} className="all-container">
            <div className="container">
                {/* CURRENT DATE */}
                <div style={{ paddingBottom: 30, paddingTop: 20 }} class="d-flex">
                    <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={handleMinusDate} className="btn" style={{ color: "#008A8A" }}><i class="fas fa-chevron-left"></i></a>
                    <h4 style={{ paddingTop: 8, paddingLeft: 10, paddingRight: 10, color: "#008A8A", fontWeight: "bold" }}>{niceCurrentDate}</h4>
                    <a href={`/daily-calories/${user_id}/${currentDate}`} onClick={handlePlusDate} className="btn" style={{ color: "#008A8A" }}><i class="fas fa-chevron-right"></i></a>
                </div>
                {/* BREAKFAST */}

                <TablesDailyFood meal="Breakfast" renderDailyFood={renderDailyFoodBreakfast} user_id={user_id} currentDate={currentDate} />
                {/* LUNCH */}
                <TablesDailyFood meal="Lunch" renderDailyFood={renderDailyFoodLunch} user_id={user_id} currentDate={currentDate} />
                {/* DINNER */}
                <TablesDailyFood meal="Dinner" renderDailyFood={renderDailyFoodDinner} user_id={user_id} currentDate={currentDate} />
                {/* Snack*/}
                <TablesDailyFood meal="Snack" renderDailyFood={renderDailyFoodSnack} user_id={user_id} currentDate={currentDate} />


                {/* Totals */}
                <h3 style={{ paddingTop: 80, paddingBottom: 30, fontWeight: 'bold', color: "#008A8A" }}>Total food</h3>
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
                                <td>{totalKcal.toFixed(2)}</td>
                                <td>{totalProteins.toFixed(2)} (g)</td>
                                <td>{totalCarbs.toFixed(2)} (g)</td>
                                <td>{totalFats.toFixed(2)} (g)</td>
                                <td>{totalSugar.toFixed(2)} (g)</td>
                                <td>{totalFibers.toFixed(2)} (g)</td>
                            </tr>
                        </tbody>


                    </table>
                </div>
                <h5 style={{ paddingTop: 30, paddingBottom: 0, fontWeight: 'bold' }}>
                    Kcal goal: {kcalGoal}
                    <a href={`/set-kcal-goal/${user_id}`} style={{ textDecoration: "none", marginLeft: 10, color: "black" }}>
                        <i class="fa-solid fa-pen"></i>
                    </a>
                </h5>
                <h5 style={{ paddingTop: 5, paddingBottom: 50, fontWeight: 'bold', color: "#008A8A" }}>Remaining kcal: {(kcalGoal - totalKcal).toFixed(2)}</h5>

                <h3 style={{ paddingTop: 30, paddingBottom: 50, fontWeight: 'bold' }}>Your food analysis for the last week</h3>
                <ResponsiveContainer style={{ width: "100%" }} height={600}>
                    <AreaChart width={600} height={300} data={allUserFood} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="kcal" stroke="#008A8A" fill="#008A8A" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Grid>
    )
}

export default DailyCalories
