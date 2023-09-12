// Y7TljzN9C9lPVQLPc2jciINTKFyp4cSaSZGPZ4sapIRnZcKuplqguYRv

const images = document.querySelector(".imagenes")
const cargarImagenes = document.querySelector(".cargar-mas")
const searchImages = document.querySelector(".search-box input")
const ventanaEmergente = document.querySelector(".ventana-emergente")
const cerrarVentana = document.querySelector(".exit")
const downloadVentana = document.querySelector(".download")

// sacando el apikey para conectranos a la API
const ApiKey = "Y7TljzN9C9lPVQLPc2jciINTKFyp4cSaSZGPZ4sapIRnZcKuplqguYRv";
// cantidad de imagenes por peticion que se haga a la api
const perPage = 15;
let currentPage = 1;
let searchterm = null

// funcion para descargar imagen
const downloadImg = (imgUrl) =>{
    fetch(imgUrl).then ((res) => {
        return res.blob()
    }).then((file) =>{
        const a = document.createElement("a")
        a.href= URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click()
    }).catch((error) =>{
        console.log("Hubo un error al descargar la imagen")
    })
}

// funcion para poder mostrar la pantalla emergente cuando haces click a una imagen
const mostrarEmergente = (name, img) =>{
    ventanaEmergente.querySelector("img").src = img
    // descargar ventana emergente
    downloadVentana.setAttribute("data-img", img)
    ventanaEmergente.querySelector("span").textContent = name
    ventanaEmergente.classList.add("mostrar")
}
// funcion para poder pintar las imagenes en documento HTML5
const fotosPexel = (imageness) => {
    console.log(imageness)

    // recorremos con el metodo map cada uno de las imagenes que traemos desde la API de pexel
    images.innerHTML += imageness.map((img) => {
        return `<li class="card" onclick = "mostrarEmergente('${img.photographer}', '${img.src.large2x}' )">
                <img src=${img.src.large2x} alt="imagen">
                <div class="informacion-foto">
                    <div class="fotografo">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick = "downloadImg('${img.src.large2x}')"><i class="uil uil-import"></i></button>
                </div>
            </li>
        `
    }).join("");

}
// consumiendo la api, con fetch
const getImagenes = (apiURL) => {
    // cambiamos el boton a cargando mientras va trayendo la data de la API
    cargarImagenes.textContent = "cargando..."
    cargarImagenes.classList.add("disabled")
    fetch(apiURL, {
        headers: { Authorization: ApiKey }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        fotosPexel(data.photos)
        // cuando ya haya cargado ponemos el boton en normal
        cargarImagenes.textContent = "cargar mas"
        cargarImagenes.classList.remove("disabled")
    })
}

// cargando mas imagenes con el boton cargar mas para ello agregamos el evento click
const loadImages = () =>{
    currentPage++
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchterm ? `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImagenes(apiURL)
} 

// funcion para poder buscar las imagenes
const loadSearchImages = (e) =>{
    if (e.key == "Enter") {
        currentPage = 1
        searchterm = e.target.value
        images.innerHTML = " "
        getImagenes(`https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}`)

    }
} 

// funcion para cerra la ventana emergente
const exitVentana = () =>{
    ventanaEmergente.classList.remove("mostrar")
}

getImagenes(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
// eventos JS
cargarImagenes.addEventListener("click", loadImages)
searchImages.addEventListener("keyup", loadSearchImages)
cerrarVentana.addEventListener("click", exitVentana)
downloadVentana.addEventListener("click", (e) =>{
    downloadImg(e.target.dataset.img)
} )

