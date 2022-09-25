const apiKey = "eBVrkSXzYRtSr9Ui1OK5DBx6GNL2W0PG";
const thumbs = document.getElementById("thumbs");
const recentSearches = document.getElementById("recent_searches");
const searchError = document.getElementById("search_error");
let input = document.getElementById("searchInput");
let offset = 20;
let searches = [];

main(trendingGifs);

function main(searchType) {
  searchType(input.value).then((result) => {
    if (result.pagination.total_count === 0) {
      searchError.style.display = "block";
      setTimeout(() => {
        searchError.style.display = "none";
      }, 3000);
    } else {
      result.data.forEach((data) => {
        let img = new Image();
        img.src = data.images.downsized_medium.url;
        appendImage(img);
      });
    }
  });
}

function trendingGifs() {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20`;

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(url, requestOptions).then((response) => response.json());
}

function appendImage(img) {
  let parentDiv = document.createElement("div");
  parentDiv.classList.add("img-wrapper");
  let childDiv = document.createElement("div");
  childDiv.classList.add("inner");

  childDiv.appendChild(img);
  parentDiv.appendChild(childDiv);
  thumbs.appendChild(parentDiv);
}

if (input.value === "") {
  window.addEventListener("scroll", handleTrendingScroll);
}

function handleTrendingScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    main(trendingScroll);
  }
}

function trendingScroll() {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10&offset=${offset}`;

  offset += 10;
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(url, requestOptions).then((response) => response.json());
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  cleanArray(thumbs);
  main(giphySearch);
});

function cleanArray(parent) {
  let first = parent.firstElementChild;
  while (first) {
    first.remove();
    first = parent.firstElementChild;
  }
}

function giphySearch(keyword) {
  offset = 20;

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=20`;

  addToRecentSearches(keyword);
  window.removeEventListener("scroll", handleTrendingScroll);
  window.addEventListener("scroll", handleInfiniteScroll);

  return fetch(url, requestOptions).then((response) => response.json());
}

function addToRecentSearches(keyword) {
  searches.push(keyword);
  if (searches.length > 3) {
    searches.shift();
  }
  localStorage.setItem("searches", JSON.stringify(searches));
  cleanArray(recentSearches);
  displayRecentSearches();
}

function displayRecentSearches() {
  let searchesArray = JSON.parse(localStorage.getItem("searches"));
  if (!searchesArray) {
    return;
  }
  searchesArray.map((value) => {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "");
    anchor.innerText = value + " ";

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = value;
      cleanArray(thumbs);
      main(giphySearch);
    });

    recentSearches.appendChild(anchor);
  });
}

displayRecentSearches();

function handleInfiniteScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    main(infiniteScrollSearch);
  }
}

function infiniteScrollSearch() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${input.value}&limit=10&offset=${offset}`;

  offset += 10;
  return fetch(url, requestOptions).then((response) => response.json());
}
