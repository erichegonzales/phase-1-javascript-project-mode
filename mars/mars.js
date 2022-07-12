const rover = document.getElementById('rover')
const selectedRover = rover.options[rover.selectedIndex].value
const camera = document.getElementById('camera')
const selectedCamera = camera.options[camera.selectedIndex].value
const addImageBtn = document.getElementById('add-image')

const fetchPhotos = async () => {
    let roverName = 'curiosity'
    let roverCamera = 'CHEMCAM'
    try { 
        let res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&camera=CHEMCAM&api_key=DEMO_KEY`)
        let req = await res.json()
        console.log(req)
        return req
    }
    catch(error) {
        console.log(error.message)
    }
}
fetchPhotos()

addImageBtn.addEventListener('click', () => {
    console.log('worked')
})

// https://images-api.nasa.gov/search?q=planets&media_type=image