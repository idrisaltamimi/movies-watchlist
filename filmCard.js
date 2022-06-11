const cardsContainer = document.querySelector(".cards-container")
const cardsTemplates = document.querySelector(".cards-template")
const clipboard = document.querySelector(".clipboard")
const explore = document.querySelector(".explore")
const exploreNoResultes = document.querySelector(".explore-no-result")

export let watchlistFilms = JSON.parse(localStorage.getItem("watchlist")) ?? []


export function filmCard(data) {
   data?.forEach(item => {
      explore.style.display = "none"
      exploreNoResultes.style.display = "none"
      const { Poster, Title, imdbRating, Runtime, Genre, Plot } = item
      const filmCard = cardsTemplates.content.cloneNode(true).children[0]
      const getHtml = (className) => filmCard.querySelector(`.movie-${className}`)
      const poster = Poster === "N/A" ? "img/iconfilm.svg" : Poster
      const runtime = Runtime === "N/A" ? "" : Runtime
      const posterClass = Poster === "N/A" ? "movie-poster-nan" : "movie-poster"
      if (Runtime === "N/A") {
         getHtml("stats-container").className = "movie-stats-container-nan"
      }
      getHtml("poster").src = poster
      getHtml("poster").alt = Title + " movie poster"
      getHtml("poster").className = posterClass
      getHtml("title").textContent = Title === "N/A" ? "" : Title
      getHtml("rating").textContent = imdbRating === "N/A" ? "" : imdbRating
      getHtml("runtime").textContent = runtime
      getHtml("genre").textContent = Genre === "N/A" ? "" : Genre



      const watchlistBtn = watchlistFilms.some(i => i.imdbID === item.imdbID) ?
         "./img/iconremove.svg" : "./img/iconadd.svg"
      getHtml("watchlist-btn").src = watchlistBtn

      getHtml("watchlist-btn").src = watchlistBtn

      const plotHtml = getHtml("plot")
      const readmoreHtml = getHtml("readmore-btn")
      const showlessHtml = getHtml("showless-btn")
      if (Plot?.length < 134) {
         readmoreHtml.style.display = "none"
         plotHtml.textContent = Plot === "N/A" ? "" : Plot
      } else if((Plot?.length >= 134) {
         let displayText = Plot?.slice(0, 132)
         let moreText = Plot?.slice(132)
         plotHtml.textContent = displayText.concat("...")

         readmoreHtml.addEventListener("click", () => showmoreLess(moreText, "none", "block"))
         showlessHtml.addEventListener("click", () => showmoreLess("...", "inline", "none"))
         function showmoreLess(concat, more, less) {
            plotHtml.textContent = displayText.concat(concat)
            readmoreHtml.style.display = more
            showlessHtml.style.display = less
         }
      }

      getHtml("watchlist-btn").addEventListener('click', () => {
         if (watchlistFilms.some(i => i.imdbID === item.imdbID)) {
            const index = watchlistFilms.findIndex(object => {
               return object.imdbID === item.imdbID
            })
            const newArray = [...watchlistFilms]
            if (index !== -1) {
               newArray.splice(index, 1)
            }
            watchlistFilms = newArray
            getHtml("watchlist-btn").src = "./img/iconadd.svg"
            handleClipboard("movie removed")
         } else {
            watchlistFilms.push(item)
            getHtml("watchlist-btn").src = "./img/iconremove.svg"
            handleClipboard("movie added")
         }
         localStorage.setItem("watchlist", JSON.stringify(watchlistFilms))
      })

      cardsContainer.append(filmCard)
   })
}

function handleClipboard(text) {
   clipboard.textContent = ""
   const addRemoveMessage = document.createElement("span")
   addRemoveMessage.className = "clipboard-content"
   addRemoveMessage.textContent = text
   clipboard.appendChild(addRemoveMessage)

   setTimeout(() => {
      addRemoveMessage.remove()
   }, 2000)
}
