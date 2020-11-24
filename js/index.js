const searchButton = document.getElementById('searchButton');

const searchField = document.getElementById('searchField');

searchField.addEventListener('keypress', (e) => e.key === 'Enter' ? searchMovie():'');

searchButton.addEventListener('click', searchMovie);

function searchMovie () {
  window.location = `/pages/search.html?movie=${searchField.value}`;
}

const hamburguerWrapper = document.getElementById("hamburguer");
const hamburguerButton = document.getElementById("hamburguer_icon");
const labels = document.getElementById("hamburguer_labels");

let isMenuActivated = false;

function checkSize() {
  if(window.innerWidth < 950){
    labels.style.display = "none";
    hamburguerButton.style.display = "flex";
    labels.classList.add("compress");
  } 
  else {
    labels.style.display = "flex";
    hamburguerButton.style.display = "none";
    labels.classList.remove("compress");
  }
}

window.onresize = checkSize;

document.addEventListener('DOMContentLoaded', checkSize);

function toggleHamburguer() {
  isMenuActivated = !isMenuActivated;

  if(isMenuActivated){
    labels.style.display = "flex";
  } else {
    labels.style.display = "none";
  }
}

hamburguerButton.onclick = toggleHamburguer;

const lancamentoButton = document.getElementById("rd_lancamento");
const lancamentoSection = document.getElementById("lancamento");
lancamentoButton.onclick = () => lancamentoSection.scrollIntoView();

const destaqueButton = document.getElementById("rd_emdestaque");
const destaqueSection = document.getElementById("emdestaque");
destaqueButton.onclick = () => destaqueSection.scrollIntoView();

const avaliacaoButton = document.getElementById("rd_avaliacoes");
const avaliacaoSection = document.getElementById("avaliacoes");
avaliacaoButton.onclick = () => avaliacaoSection.scrollIntoView();

const entrevistaButton = document.getElementById("rd_entrevista");
const entrevistaSection = document.getElementById("entrevista");
entrevistaButton.onclick = () => entrevistaSection.scrollIntoView();

const novidadesButton = document.getElementById("rd_novidades");
const novidadesSection = document.getElementById("novidades");
novidadesButton.onclick = () => novidadesSection.scrollIntoView();

const key = "0c44ec8e26aea5702eb3cb2e20f8938d";
const TMDBBaseURL = "https://api.themoviedb.org/3/";
const YoutubeBaseURL = "https://www.youtube.com/"

let dotsSlider = [];
let slides = [];

document.addEventListener('DOMContentLoaded', () => {  
  fetch(`${TMDBBaseURL}movie/upcoming?api_key=${key}&language=pt-BR`)
    .then(response => response.json())
    .then((dataVec) => {
      const contentWrapper = document.getElementById("slide-wrapper");

      dataVec.results.map((data) => {
        fetch(`${TMDBBaseURL}movie/${data.id}/videos?api_key=${key}&language=pt-BR`)
          .then(result => result.json())
          .then(videos => {
            let video, hasFind = false;
            const content = document.createElement("div");
            
            for(let i=0; i<videos.results.length; i++){
              if(videos.results[i].site === "YouTube" && videos.results[i].type === "Trailer"){
                video = videos.results[i].key;
                hasFind = true;
                break;
              }
            }
            
            if(hasFind){
              const videoWrapper = document.createElement("div");
              videoWrapper.classList.add("w_iframe");

              const videoElement = document.createElement("iframe");
              videoElement.height = "315";
              videoElement.src = `${YoutubeBaseURL}embed/${video}`;
              videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
              videoElement.allowFullscreen = true;
              videoWrapper.appendChild(videoElement);
              content.appendChild(videoWrapper);
            } else {
              const img = document.createElement("img");
              img.src = data.poster_path ? `https://image.tmdb.org/t/p/w200${data.poster_path}`:'/imagens/not_image.png';
              img.alt = `Capa de ${data.title}`;
              content.appendChild(img);
            }

            const textContent = document.createElement("div");
            textContent.className = "textContent";
      
            const originalTitle = document.createElement("h2");
            originalTitle.append(data.original_title);
            textContent.appendChild(originalTitle);
      
            textContent.appendChild(document.createElement("hr"));
      
            const originalLanguage = document.createElement("p");
              const bold1 = document.createElement("span");
              bold1.className = "bold";
              bold1.append("Língua original: ");
              originalLanguage.appendChild(bold1);
              originalLanguage.append(data.original_language);
            textContent.appendChild(originalLanguage);
      
            const aval = document.createElement("p");
              const bold2 = document.createElement("span");
              bold2.className = "bold";
              bold2.append("Avaliação: ");
              aval.appendChild(bold2);
              aval.append(`${data.vote_average} / 10`);
            textContent.appendChild(aval);
      
            const releaseDate = document.createElement("p");
              const bold3 = document.createElement("span");
              bold3.className = "bold";
              bold3.append("Data de estreia: ");
              releaseDate.appendChild(bold3);
              releaseDate.append(`${data.release_date.slice(8,10)}/${data.release_date.slice(5,7)}/${data.release_date.slice(0,4)}`);
            textContent.appendChild(releaseDate);
      
            const description = document.createElement("p");
            description.id = "description";
            description.append(data.overview);
            textContent.appendChild(description);
            
            content.appendChild(textContent);
            content.classList.add("conteudo");
            content.classList.add("fade");
    
            slides.push(content);
            contentWrapper.appendChild(content);

            changeSlideTo(0);
          })
      })
      
      const dotWrapper = document.getElementById("dot-wrapper");

      for(let i=0; i<Math.min(dataVec.total_results, 20); i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.onclick = () => changeSlideTo(i);

        dotWrapper.appendChild(dot);
        dotsSlider.push(dot);
      }

    })
})

function changeSlideTo(newSlide) {
  slides.forEach(slide => slide.style.display = "none");
  dotsSlider.forEach(dot => dot.classList.remove("active"));

  slides[newSlide].style.display = "flex";
  dotsSlider[newSlide].classList.add("active");
}

const genres = document.getElementById("barra_pesquisa_id");

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${TMDBBaseURL}genre/movie/list?api_key=${key}&language=pt-BR`)
    .then(result => result.json())
    .then(data => {
      data.genres.map((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.append(genre.name);

        genres.appendChild(option);
      })
    })
});

genres.onchange = resetMovies;

let startMovies = 0, finalMovies = 6;

function resetMovies() {
  startMovies = 0;
  finalMovies = 6;
  espacoCapas.innerHTML = '';
  avals.innerHTML = '';
  loadMore();
}

let mostPopular = [];
let mostPopularTotalPages;
let mostPopularPage = 1;

async function loadPopulars() {
  fetch(`${TMDBBaseURL}movie/popular?api_key=${key}&language=pt-BR&page=${mostPopularPage}`)
    .then(result => result.json())
    .then(data => {
      data.results.map((result) => {

        const capa = document.createElement("div");
        capa.classList.add("capa");

        const capaImg = document.createElement("img");
        capaImg.onclick= () => window.location = `/pages/movie.html?id=${result.id}`;
        capaImg.src = result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}`:'/imagens/not_image.png';
        capaImg.alt = `Capa de ${result.title}`;
        capaImg.style.cursor = "pointer";
        result.genre_ids.map((genre) => {
          capa.classList.add(genre);
        })

        capa.id = String(result.id);
        capa.appendChild(capaImg);

        mostPopular.push(capa);
      })

      mostPopularTotalPages = data.total_pages;

      loadMore();
    })
  
}

const espacoCapas = document.getElementById("espaco_capas");
const avals = document.getElementById("avals");

async function addCapa(index) {
  espacoCapas.appendChild(mostPopular[index]);

  fetch(`${TMDBBaseURL}movie/${mostPopular[index].id}/reviews?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      if(data.total_results > 0){
        data.results.map(review => {
          
          const ava = document.createElement("div");
          ava.classList.add("ava");
  
          const profileImg = document.createElement("img");
          if(review.author_details.avatar_path.search("http") != -1) profileImg.src = review.author_details.avatar_path.slice(1);
          else profileImg.src = `https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}`;
          profileImg.alt = `Imagem de ${review.author}`;
  
          ava.appendChild(profileImg);
  
          const reviewWrapper = document.createElement("div");
          reviewWrapper.classList.add("review-wrapper");
  
          const textWrapper = document.createElement("div");
          textWrapper.classList.add("text");
  
          const profileTitle = document.createElement("h2");
          profileTitle.append(review.author);
          textWrapper.appendChild(profileTitle);
  
          const boldAval = document.createElement("span");
          const boldOfAval = document.createElement("b");
          boldOfAval.append("Avaliação: ");
          boldAval.appendChild(boldOfAval);
          textWrapper.appendChild(boldAval);
  
          const reviewText = document.createElement("span");
          reviewText.append(review.content);
          textWrapper.appendChild(reviewText);
  
          reviewWrapper.appendChild(textWrapper);
  
          const lastLine = document.createElement("div");
          lastLine.classList.add("last-line");

          const rating = document.createElement("div");
          rating.classList.add("avalia");
          for (let i = 0; i < 5; i++) {
            const star = document.createElement("span");
  
            if(i < review.author_details.rating) star.append("★");
            else star.append("☆");
            
            rating.appendChild(star);
          }
          lastLine.appendChild(rating);

          const date = document.createElement("span");
          const Str = review.created_at;
          date.append(`${Str.slice(8,10)}/${Str.slice(5,7)}/${Str.slice(0,4)}`);

          lastLine.appendChild(date);

          reviewWrapper.appendChild(lastLine);
          ava.appendChild(reviewWrapper);
  
          avals.appendChild(ava);
        })
      }
    });
}

async function loadMore() {
  let foundItems = 0;

  for(let i=startMovies; i<finalMovies; i++) {

    if(i >= mostPopular.length) {

      if(mostPopularPage === mostPopularTotalPages){
        loadMoreButton.onclick = () => {};
        return;
      }

      startMovies = finalMovies + foundItems - 6;

      mostPopularPage++;
      return loadPopulars();
    }

    if(genres.value != "all") {
      if (mostPopular[i].classList.contains(genres.value)) { 
        await addCapa(i);
        foundItems++;
      }
      else { 
        finalMovies++;
      }
    } else {
      await addCapa(i);
    }
  }

  startMovies = finalMovies;
  finalMovies += 6;
}

document.addEventListener('DOMContentLoaded', loadPopulars);

const loadMoreButton = document.getElementById("botao_filmes");

loadMoreButton.onclick = () => {
  espacoCapas.innerHTML = '';
  avals.innerHTML = '';
  loadMore()
};