import React from 'react'

const HomeUserFollowers = (props) => {
    return (
        <div style={{paddingTop:30,paddingBottom:30}} className="d-flex flex-sm-row flex-column bd-highlight mb-3">
            <div class="card" style={{width:"100%"}}>
                <div class="d-flex flex-sm-row justify-content-between">
                    <div className="home-followers-stats" class="mr-auto p-2">
                        <h5 className="h5-followers">Followers</h5>
                        <h5>{props.userInfo.follower_count}</h5>
                    </div>
                    <hr></hr>
                    <div className="home-followers-stats" class="mr-auto p-2">
                        <h5 className="h5-followers" >Activities</h5>
                        <h5>{props.activities.length}</h5>
                    </div>
                    <hr></hr>
                    <div className="home-followers-stats" class="mr-auto p-2">
                        <h5 className="h5-followers">Weight</h5>
                        <h5>{(Math.round(props.userInfo.weight * 100) / 100).toFixed(2)} kg</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeUserFollowers
