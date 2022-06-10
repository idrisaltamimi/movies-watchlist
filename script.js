import { filmCard } from "./filmCard.js"
const a = 1.125
const b = 1.125

console.log((.5 * a) + a)
console.log((.25 * b) + b)
const searchBtn = document.querySelector(".search-btn")
const searchInput = document.querySelector(".search-input")
const explore = document.querySelector(".explore")
const exploreNoResultes = document.querySelector(".explore-no-result")
const cardsContainer = document.querySelector(".cards-container")

localStorage.setItem("prevValue", "")

function fetchData(value) {
   const fetchFilmId = async () => {
      const res = await fetch(`https://www.omdbapi.com/?s=${value}&apikey=f9d32e02`)
      const id = await res.json()
      if (id.Response === "False") {
         if (value === "") {
            explore.style.display = "flex"
         } else {
            explore.style.display = "none"
            exploreNoResultes.style.display = "flex"
         }
      } else {
         const cards = id?.Search?.map(async item => {
            const response = await fetch(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=f9d32e02`)
            const data = await response.json()
            return data
         })
         return await cards && Promise.all(cards)
      }
   }
   return fetchFilmId()
}

const handleClick = (e) => {
   e.target.blur()
   getCardsHtml()
}

const handleChange = (e) => {
   if (e.keyCode === 13) {
      getCardsHtml()
   }
}

export async function getCardsHtml() {
   cardsContainer.textContent = ""
   const value = searchInput.value.trim().replace(/ /g, "+").toLowerCase()
   const prevValue = value !== "" ? value : localStorage.getItem("prevValue")
   localStorage.setItem("prevValue", prevValue)
   const currentValue = (value === "" && prevValue !== "") ? prevValue : value

   const data = await fetchData(currentValue)
   searchInput.value = ""
   filmCard(data)
}

searchBtn.addEventListener("click", handleClick)
searchInput.addEventListener("keyup", handleChange)

