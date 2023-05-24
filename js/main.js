
// CREAMOS NAV
const nav = document.getElementById("navBar");
const navBar = document.createElement("div");
navBar.classList.add("container-fluid");
navBar.innerHTML = `
    <a href="index.html"><img class="logoResto" src="img/logo2.png"></a>
        <button class="navbar-toggler" type="button"></button>
        <ul class="navbar-nav">
            <li class="nav-item">
          <button class="buttonNav" id = "botonFiltrar">Filtrar Juego
          </button>
          <button class="buttonNav" id = "botonVerCarrito">Ver carrito
          </button>
          <button class="buttonNav" id = "botonVaciarCarrito">Vaciar carrito
          </button>
          <button class="buttonNav" id = "botonFinalizarCompra">Finalizar compra
          </button>
          <button class="buttonNav" id = "botonModo">Modo claro/oscuro
          </button>
        </li>
      </ul>
      `
nav.appendChild(navBar);

class Producto {
  constructor(id, nombre, descripcion, precio, img, cantidad) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.img = img;
      this.cantidad = cantidad;
  }
}
//Obtener datos desde la API estatita simulada con produntos.json en la carpeta data
const obtenerDatosAPI = async () => {
  const response = await fetch("./data/productos.json");
  const datos = await response.json();
  return datos;
 };
 //creo el araay donde se van a guardar despues los datos 
const arrayProductos = [];
// Agragar los datos de la API simulada en arrayProductos
const agregarDatosAPI = async () => {
  const datos = await obtenerDatosAPI();
  arrayProductos.push(...datos);
  const mostramosJuegos = document.getElementById("mostrarProductos");
//Ver productos
const verProductos = () => {
  arrayProductos.forEach(producto => {
    const cardBs = document.createElement("div");
    cardBs.classList.add("col-xl-3", "col-md-6");
    cardBs.innerHTML =
      `<div class="card cardProductos">
        <img src= ${producto.img} alt= ${producto.nombre}>
        <div class="card-body">
        <h2 class="card-title">${producto.nombre}</h2>
        <p class="card-text">${producto.descripcion} </p>
        <p class="card-text">$ ${producto.precio} </p></div>
        <button class="btn btn-dark buttonCard" id = "boton${producto.id}">Añadir al Carrito</button>
        </div>`

    mostramosJuegos.appendChild(cardBs);

    const boton = document.getElementById(`boton${producto.id}`);
    boton.addEventListener("click", () => {
      agregar(producto.id);
    })
  })
}
  verProductos();
 };
 
 agregarDatosAPI();


let carrito = [];

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"))
}


// AGREGAR UN PRODUCTO AL CARRITO
const agregar = (id) => {
  const enCarrito = carrito.find(producto => producto.id === id);
  if (enCarrito) {
    enCarrito.cantidad++;
    vemosCarrito();
    costo();
    Swal.fire('Producto Agregado')
  } else {
    const producto = arrayProductos.find(producto => producto.id === id);
    carrito.push(producto);
    vemosCarrito();
    costo();
    Swal.fire('Producto Agregado')
  }
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

// MOSTRAMOS Y ELIMINAMOS PRODUCTOS EN CARRITO 

const carritoMostrarDom = document.getElementById("mostrarCarrito");
const verCarrito = document.getElementById("botonVerCarrito"); /*Recordar boton creado en el NAV.*/


verCarrito.addEventListener("click", () => {
  vemosCarrito();
  costo();
})

// TITULO CARRITO
const titulo = document.getElementById("tituloCarrito");

const etiquetaTitulo = document.createElement("div");
etiquetaTitulo.innerHTML = `<div class="divTitulo"><p class="tituloCarrito">Carrito de Compras</p></div>`
titulo.appendChild(etiquetaTitulo);

//funcion ver carrito
const vemosCarrito = () => {
  carritoMostrarDom.innerHTML = [];
  carrito.forEach(producto => {
    const cardBs = document.createElement("div");
    cardBs.classList.add("col-xl-3", "col-md-6");
    cardBs.innerHTML =
      ` 
          <div class="card cardProductos">
          <img src= ${producto.img} alt= ${producto.nombre}>
          <div class="card-body">
          <h2 class="card-title">${producto.nombre}</h2>
          <p> Cantidad: ${producto.cantidad} </p>
          <p class="card-text">$ ${producto.precio}</p></div>
          <button class="btn btn-dark" id ="botonEliminar${producto.id}">Eliminar del carrito</button>
          </div>`;

    carritoMostrarDom.appendChild(cardBs)

    const botonEliminar = document.getElementById(`botonEliminar${producto.id}`);
    botonEliminar.addEventListener("click", () => {
      eliminamosProducto(producto.id);
    })
  })
}
//funcion elimanar producto
const eliminamosProducto = (id) => {
  const productoEliminado = carrito.find(producto => producto.id === id);
  const indice = carrito.indexOf(productoEliminado);
  carrito.splice(indice, 1);
  vemosCarrito();
  costo()

  localStorage.setItem("carrito", JSON.stringify(carrito))

}

const vaciar = document.getElementById("botonVaciarCarrito");

vaciar.addEventListener("click", () => {
  if(carrito.length==0){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Carrito Vacio!',
    })
  }
  else{
  Swal.fire({
    title: 'Eliminar Carrito?',
    text: "Esta operación no se puede deshacer!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!'
  }).then((result) => {
    if (result.isConfirmed) {
      eliminamosTodo();
      Swal.fire(
        'Eliminado!',
        'El carrito se eliminó.',
        'success'
      )
    }
  })
}
});
//funcion eliminar todo
const eliminamosTodo = () => {
  carrito = [];
  vemosCarrito();
  costo();

  localStorage.clear();
}

// COSTO TOTAL COMPRA 
const costoCompra = document.getElementById("costo");

const costo = () => {
  let total = carrito.reduce((acumulador, producto) => acumulador + (producto.cantidad * producto.precio), 0);
  console.log(total);
  costoCompra.innerHTML = `<p class="compra">Total de la compra: $${total}</p>`;
}

// FINALIZAR COMPRA
const finalizar = document.getElementById("botonFinalizarCompra"); /*Recordar boton creado en el NAV.*/

finalizar.addEventListener("click", () => {
  if(carrito.length==0){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Carrito Vacio!',
    })
  }
  else{
  Swal.fire({
    title: 'Finalizar Compra?',
    text: "Cancela si desea seguir comprando juegos",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Finalizar Compra'
  }).then((result) => {
    if (result.isConfirmed) {
      vemosCarrito();
      const formFinalizar = document.createElement("div");
      formFinalizar.innerHTML = `<form class="mb-3 contenedorForm formFianlizar" id= "formEnviar">
          <label for="exampleInputEmail1" class="labelForm">Ingrese su nombre</label>
          <input id = "inputNombre" type="text" class="form-control textInput" id="exampleInputEmail1" aria-describedby="emailHelp">
          <label for="exampleInputEmail1" class="labelForm">Email</label>
          <input id = "inputMail" type="email" class="form-control textInput" id="exampleInputEmail1" aria-describedby="emailHelp">
          <label for="exampleInput" class="labelForm">Ingrese dirección para enviar pedido.</label>
          <input id = "inputDir" type="text" class="form-control textInput" id="exampleInputEmail1" aria-describedby="emailHelp">
          <p>El pago se realiza cuando el pedido se entrega</p>
          <button class="btn btn-warning">Enviar</button>
          <button id = "botonSalir" class="btn btn-warning">Salir</button>
        `;
      carritoMostrarDom.appendChild(formFinalizar);
    
      // FUNCION Y BOTON PARA SALIR
      const botonSalir = document.getElementById("botonSalir");
      console.log(botonSalir);
      botonSalir.addEventListener("click", () => {
        eliminamosTodo();
      })
    
      //  BOTON ENVIAR
      const inputNombre = document.getElementById("inputNombre");
      console.log(inputNombre);
      const inputMail = document.getElementById("inputMail");
      console.log(inputMail);
      const inputDir = document.getElementById("inputDir");
      console.log(inputDir);
    
      // MENSAJE FORM
      const mensajeForm = document.getElementById("mensajeFinalizar")
      console.log(mensajeForm);
      carritoMostrarDom.appendChild(mensajeForm)
    
      
      const botonEnviar = document.getElementById("formEnviar");
      console.log(botonEnviar);
      botonEnviar.addEventListener("submit", (e) => {
        e.preventDefault()
        if (inputNombre.value == "" || inputMail.value == "" || inputDir.value == "") {
          mensajeForm.innerHTML = `<h3>No ingreso datos para envio</h3>`
          setTimeout(() => {
            mensajeForm.innerHTML = '';
          }, 3000);
        } else {
          Swal.fire({
            title: 'Tus juesgos están en camino!',
            text: 'Serán entregados en la dirección que especificaste.',
            imageUrl: 'https://st.depositphotos.com/29688696/57556/v/600/depositphotos_575564402-stock-illustration-motorbike-for-food-delivery-service.jpg',
            imageWidth: 300,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
          eliminamosTodo();
        }
      });
      Swal.fire(
        'Compra Finalizada!',
        'Por favor Completa el formalario de entrega.',
        'success'
      )
    }
  })
  }
});

// BOTON MODO /*Recordar boton creado en el NAV.*/
const botonModo = document.getElementById("botonModo");

botonModo.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
  if (document.body.classList.contains("oscuro")) {
    localStorage.setItem("botonModo", "oscuro");
  } else {
    localStorage.setItem("botonModo", "claro")
  }
})

const modoClaroOscuro = localStorage.getItem("botonModo")

if (modoClaroOscuro === "oscuro") {
  document.body.classList.add("oscuro")
} else {
  document.body.classList.remove("oscuro");
}
//funcion filtrar juegos
function filtrarProductos(){
  Swal.fire({
      title: 'Ingresa el producto que deseas buscar',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Buscar',
      showLoaderOnConfirm: true,



      preConfirm: (palabraClave) => {
          palabraClave = palabraClave.trim().toUpperCase()
          let resultado = arrayProductos.filter((producto)=> producto.nombre.toUpperCase().includes(palabraClave))


           if (resultado.length > 0){
              console.table(resultado)


              
              Swal.fire({
                  title: 'Resultados de búsqueda',
                  html: '<table><tr><th>Nombre</th><th>Precio</th></tr>' +
                        resultado.map(producto => `<tr><td>${producto.nombre}</td><td>${producto.precio}</td></tr>`).join('') +
                        '</table>',
                  confirmButtonText: 'OK'
              })
              
          } else {
              Swal.fire({
                  title: 'No se encontraron coincidencias',
                  icon: 'error',
                  confirmButtonText: 'OK'
              })
          }
      }
  });
}

const filtrarJuego = document.getElementById("botonFiltrar"); 


filtrarJuego.addEventListener("click", () => {
  filtrarProductos();
})

function newFunction() {
  console.log(arrayProductos);
}

