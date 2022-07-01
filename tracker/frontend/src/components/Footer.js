import React from 'react'
import { Grid } from '@material-ui/core'

const Footer = () => {
    return (
        <div>
            <footer className="footer-container navbar">
                <div className="container">
                    <div>
                        <h3 style={{ color: 'white', fontWeight: "bold", marginTop: 10 }}>Eat&Track</h3>
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: "bold", paddingTop: 10 }}>
                            <div>This website helps you track both your calories and your workouts. It uses the Strava api to track all your daily activities.</div>
                        </div>
                    </div>
                    <Grid item xs={12} align="center">
                        <a href="https://www.facebook.com/gabriel.bunea.1" className="btn"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://github.com/GabrielBunea123" className="btn"><i class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/gabriel-bunea-a21089204/" className="btn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://twitter.com/BuneaGabriel4" className="btn"><i class="fab fa-twitter"></i></a>
                    </Grid>
                </div>
            </footer>
        </div>
    )
}

export default Footer
