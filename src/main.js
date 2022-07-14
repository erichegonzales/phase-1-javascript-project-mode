const dateInput = document.getElementById('dateInput')
const addImageBtn = document.getElementById('add-image')
const imageContainer = document.getElementById('image-container')
const footer = document.getElementById('footer')

let todayMonth = new Date().getMonth().toString()
let todayDay = new Date().getDate().toString()
if (todayMonth.length === 1) todayMonth = todayMonth.padStart(2, '0')
if (todayDay.length === 1) todayDay = todayDay.padStart(2, '0')
const todayYear = new Date().getFullYear().toString()
dateInput.setAttribute('max', `${todayYear}-${todayMonth}-${todayDay}`)

let date
let day
let month
let year
let key = '5x8jye659ANN9AhcRH6efnk0lMastohE8JxFLFV1'

const fetchImages = async () => {
    let res = await fetch(`https://api.nasa.gov/planetary/apod?date=${year}-${month}-${day}&api_key=${key}`)
    // console.log(res)
    let req = await res.json()
    return req
}

const fetchData = async () => {
    let res = await fetch(`http://localhost:3000/images`)
    let req = await res.json()
    return req
}

const postImage = async () => {
    let object = await fetchImages()
    let res = await fetch(`http://localhost:3000/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'date': object.date,
            'title': object.title,
            'url': object.url,
            'explanation': object.explanation,
            'likes': '0'
        })
    })
    let req = await res.json()
    newImage = await renderImage(req)
    imageContainer.append(newImage)
    imageContainer.lastChild.children[5].scrollIntoView()
}

dateInput.addEventListener('change', () => {
    date = new Date(dateInput.value);
    day = date.getDate() + 1;
    month = date.getMonth() + 1;
    year = date.getUTCFullYear();
})

const randomImageBtn = document.getElementById('random-image')
randomImageBtn.addEventListener('click', (event) => {
    // Math.floor(Math.random() * (max - min + 1)) + min;
    month = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
    day = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
    year = Math.floor(Math.random() * (2022 - 1995 + 1)) + 1995;

    day = day.toString()
    month = month.toString()
    year = year.toString()

    if (day.length === 1) day = day.padStart(2, '0')
    if (month.length === 1) month = month.padStart(2, '0')
    
    date = new Date(`${year}-${month}-${day}T03:24:00`)
    
    day = date.getDate() + 1;
    month = date.getMonth() + 1;
    year = date.getUTCFullYear();
    
    day = day.toString()
    month = month.toString()
    year = year.toString()

    if (day === '32') day = '1'
    if (month === '12') month = '1'
    if (day.length === 1) day = day.padStart(2, '0')
    if (month.length === 1) month = month.padStart(2, '0')

    console.log(date)
    console.log(month, day, year)
    postImage()
    dateInput.value = ''
    day, month, year = '', '', ''
})

addImageBtn.addEventListener('click', (event) => {
    if (day === undefined) window.alert('Please enter a date.')

    day = day.toString()
    month = month.toString()
    year = year.toString()

    if (day === '32') day = '1'
    if (month === '12') month = '1'
    if (day.length === 1) day = day.padStart(2, '0')
    if (month.length === 1) month = month.padStart(2, '0')

    console.log(month, day, year)
    postImage()
    dateInput.value = ''
    day, month, year = '', '', ''
})

const renderImage = async (input) => {
    const image = await input
    const div = document.createElement('div')
    const h1 = document.createElement('h2')
    const h2 = document.createElement('h2')
    const img = document.createElement('img')
    const br = document.createElement('br')
    const p = document.createElement('p')
    
    div.setAttribute('class', 'card')
    div.addEventListener('click', () => {
        div.classList.add('animate__animated')
        div.classList.add('animate__shakeX')
    })

    h1.innerText = image.date
    h2.innerText = image.title
    img.src = image.url
    p.innerText = image.explanation

    const icons = document.createElement('div')
    const likeIcon = document.createElement('i')
    const deleteIcon = document.createElement('i')
    const dislikeIcon = document.createElement('i')
    icons.append(likeIcon, deleteIcon, dislikeIcon)
    likeIcon.setAttribute('class', 'fa fa-heart')
    deleteIcon.setAttribute('class', 'fa-solid fa-trash-can')
    dislikeIcon.setAttribute('class', 'fa-solid fa-heart-crack')
    likeIcon.innerText = ` ${input.likes}`

    likeIcon.addEventListener('click', () => {
        likeIcon.innerText = ` ${++input.likes}`
        updateLikes(input)
    })
    deleteIcon.addEventListener('click', () => {
        div.remove()
        deleteObject(input);
    })
    dislikeIcon.addEventListener('click', () => {
        likeIcon.innerText = ` ${--input.likes}`
        updateLikes(input)
    })

    div.append(h1, h2, img, br, p, icons)
    return div
}

const deleteObject = (object) => {
    try {
        fetch(`http://localhost:3000/images/${object.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application / json'
            }
        })
    }
    catch (error) { console.log(error.message) }
}

const updateLikes = (object) => {
    try {
        
        fetch(`http://localhost:3000/images/${object.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application / json'
            },
            body: JSON.stringify({
                likes: `${object.likes}`
            })
        })
    }
    catch (error) { console.log(error.message) }
}

const getImages = async () => {
    let imageObj = await fetchData()
    imageObj.forEach(async (image) => {
        let newImage = await renderImage(image)
        imageContainer.append(newImage)
    })
}
getImages()
