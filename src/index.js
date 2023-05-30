const targetURL = "http://localhost:3000/toys"
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetch(targetURL)
  .then(response=>response.json())
  .then(toys=>{
    toys.forEach(toy=>createToy(toy))
  })
});
//const getForm = document.querySelector("#container")
const addToyButton = document.querySelector(`.add-toy-form`)
console.log(addToyButton)
addToyButton.addEventListener("submit", addNewToy)
function addNewToy(event) {
  event.preventDefault()
  const name = event.target.name.value
  const image = event.target.image.value
  const likes = 0
  const newToy = {name,image,likes}
  fetch(targetURL, {
    method:"POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify(newToy)
  })
  .then(response=>response.json())
  .then(addedToy=>createToy(addedToy))
  .catch(e=>alert(e.message))
}
function createToy(toy) {
  const toyCollection = document.body.querySelector('#toy-collection')
  const toyDiv = document.createElement("div")
  const toyDelButton = document.createElement("button")
  toyDelButton.textContent = 'x'
  toyDelButton.addEventListener("click", e => deleteToy(e, toy))
  const toyName = document.createElement("p")
  toyName.textContent = toy.name
  const toyImage = document.createElement("img")
  toyImage.src = toy.image
  const toyLikeButton = document.createElement("button")
  const toyLikes = document.createElement("span")
  toyLikes.classList.add("numOfLikes")
  toyLikes.textContent = `${toy.likes} likes`
  toyLikeButton.textContent = "Like ❤️"
  toyLikeButton.addEventListener("click", e => likeToy(e, toy))
  toyDiv.append(toyDelButton,toyName,toyImage,toyLikes,toyLikeButton)
  toyCollection.append(toyDiv)

}
function likeToy(e, toy) {
  toy.likes += 1
  const likesElement = e.target.parentNode.querySelector('span.numOfLikes')
  fetch(`${targetURL}/${toy.id}`, {
    method:"PATCH", 
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify(toy)
  })
  .then(response=>response.json())
  .then(updatedToy=>{
    likesElement.textContent = `${updatedToy.likes} likes`
}).catch(error=>alert(error.message))
}
function deleteToy(e, toy) {
  fetch(`${targetURL}/${toy.id}`, {
    method:"DELETE"
})
.then(response=>{
    if(response.ok) {
        e.target.parentNode.remove()
    }
    else {
        alert("Dog too powerful to delete")
    }
})
.catch(error=>alert(error.message))
}