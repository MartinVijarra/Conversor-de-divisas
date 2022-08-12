'use strict'

//Datos de inputs
const primerDivisa = document.getElementById('primer-divisa')
const segundaDivisa = document.getElementById('segunda-divisa')
const primerValor = document.getElementById('primer-valor')
const segundoValor = document.getElementById('segundo-valor')
const infoDeCambio = document.getElementById('informacion-de-cambio')
const botonConvertir = document.getElementById('convertir')
const botonDeCambio = document.getElementById('taza')
const ul = document.querySelector('.lista-resultados')

//Resultados almacenados
let operacion = ''
let objeto = ''
let almacenarEnLocal = [] // <= ARREGLO QUE IRA AL LOCALSTORAGE
let divisa = document.querySelector('.divisa')

function calcular() {
  const primerMonedaIngresada = primerDivisa.value 
  const segundaMonedaIngresada = segundaDivisa.value

  fetch(`https://v6.exchangerate-api.com/v6/58f679169d6ab2828a7dcda0/latest/${primerMonedaIngresada}`)
  .then(res => res.json())
  .then(data => {
    const taza = data.conversion_rates[segundaMonedaIngresada]
    infoDeCambio.innerHTML = `<b>1 ${primerMonedaIngresada}</b> es igual a: <b>${taza.toFixed(2)} ${segundaMonedaIngresada}</b>`
    segundoValor.value = (primerValor.value * taza).toFixed(2)

    botonConvertir.addEventListener('click', botonClick)
  })
}

function botonClick() { //MOSTRAR CONTENIDO EN EL DOM
  const li = document.createElement('li')
  li.classList = 'lista'
  const agregarEnLista = ul

  li.innerHTML = `La conversión de <b>$${primerValor.value} ${primerDivisa.value}</b> es igual a: <b>$${segundoValor.value} ${segundaDivisa.value}</b>`

  agregarEnLista.appendChild(li)
  li.appendChild(borrarResultados())
  almacenarEnLocal.push(li.innerHTML)

  almacenarResultados()
}

//AGREGAR CONTENIDO AL LOCALSTORAGE
function almacenarResultados() {
  let resultados = JSON.stringify(almacenarEnLocal)
  localStorage.setItem("Conversiones", resultados) // <= ARREGLO ALMACENADO EN EL LOCALSTORAGE
}
  
//EVENTOS
primerDivisa.addEventListener('change', calcular)
segundaDivisa.addEventListener('change', calcular)
primerValor.addEventListener('input', calcular)
segundoValor.addEventListener('input', calcular)
taza.addEventListener('click', () =>{ //BOTON PARA INVERTIR LAS DIVISAS
  const temp = primerDivisa.value
  primerDivisa.value = segundaDivisa.value
  segundaDivisa.value = temp
  calcular()
}) 

calcular()

document.addEventListener('DOMContentLoaded', function() { //RECUPERAR DATOS DEL LOCALSTORAGE
  const obtenerLista = JSON.parse(localStorage.getItem("Conversiones"))

  obtenerLista.forEach( function(elementoLista) {
    botonClick(elementoLista)
    console.log(elementoLista);
  })
})

function borrarResultados() { //ELIMINAR CONTENIDO DEL DOM
  const botonBorrar = document.createElement('button')

  botonBorrar.textContent = 'X'
  botonBorrar.classList = 'boton-borrar'

  botonBorrar.addEventListener('click', (e) => {
    const item = e.target.parentElement
    const borrarDeLista = ul
    borrarDeLista.removeChild(item)
    botonClick()

    Toastify({
      text: 'Conversion eliminada',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function(){}
    }).showToast();
  })
  return botonBorrar
}
