
//Generacion de fechas
function traducirDia(dia) {
  switch (dia) {
    case 'Mon':
      return 'Lunes';
    case 'Tue':
      return 'Martes';
    case 'Wed':
      return 'Miercoles';
    case 'Thu':
      return 'Jueves';
    case 'Fri':
      return 'Viernes';
    case 'Sat':
      return 'Sabado';
    case 'Sun':
      return 'Domingo';
    default:
      return dia;
  }
}

function traducirMes(mes) {
  switch (mes) {
    case 'Jan':
      return 'Enero';
    case 'Feb':
      return 'Febrero';
    case 'Mar':
      return 'Marzo';
    case 'Apr':
      return 'Abril';
    case 'May':
      return 'Mayo';
    case 'Jun':
      return 'Junio';
    case 'Jul':
      return 'Julio';
    case 'Aug':
      return 'Agosto';
    case 'Sep':
      return 'Septiembre';
    case 'Oct':
      return 'Octubre';
    case 'Nov':
      return 'Noviembre';
    case 'Dec':
      return 'Diciembre';
    default:
      console.log(mes);
      return mes;
  }
}

let servicios = [];
let fechasServicios = [];
let fechasServiciosFiltradas = [];

let fechaInicio;
let fechaFinal;
let fechasGeneradas = [];

function generarFechas(servicio) {
  const fechasGeneradas = [];
  const fechaInicio = new Date();
  // Incrementa la fecha de inicio en un día para comenzar desde mañana
  fechaInicio.setDate(fechaInicio.getDate() + 1);

  // Fecha final basada en los días disponibles del servicio
  const fechaFinal = new Date(fechaInicio);
  fechaFinal.setDate(fechaFinal.getDate() + servicio.diasDisponibles - 1);

  // Genera las fechas en el rango y las agrega al array
  for (let fecha = new Date(fechaInicio); fecha <= fechaFinal; fecha.setDate(fecha.getDate() + 1)) {
    fechasGeneradas.push(new Date(fecha));
  }

  return fechasGeneradas;
}
/*
function generarFechas(){
  fechasGeneradas = [];
  fechaInicio = new Date();
  // Incrementa la fecha de inicio en un día para comenzar desde mañana
  fechaInicio.setDate(fechaInicio.getDate() + 1);
  
  // Fecha final (30 días después de la fecha de inicio)
  fechaFinal = new Date(fechaInicio);
  fechaFinal.setDate(fechaFinal.getDate() + 6);
  
  // Genera las fechas en el rango y las agrega al array
  for (let fecha = new Date(fechaInicio); fecha <= fechaFinal; fecha.setDate(fecha.getDate() + 1)) {
    fechasGeneradas.push(new Date(fecha));
  }

}
*/


//Inputs
let userName = document.querySelector('.name-input');
let userEmail = document.querySelector('.email-input');
let selectHour = document.querySelector('.select-hour');

//Buttons and checkbox
  let reserveButton = document.querySelector('.reserve-button');
  let dayCheckbox = document.querySelectorAll('.day-checkbox-yoga');
  let dayCheckboxThai = document.querySelectorAll('.day-checkbox-thai');
  let dayCheckboxDay = document.querySelectorAll('.checkbox-text');
  let dayCheckboxDayThai = document.querySelectorAll('.checkbox-text-thai');




//variables
let dateText = document.querySelectorAll('.fecha');
let userReserveDay = document.querySelectorAll('.reserve-activity-day');
let userReserveHour = document.querySelectorAll('.reserve-activity-hour');
let userReserveActivity = document.querySelectorAll('.reserve-activity-text');
let reserveErrors = document.querySelector('.errores-en-reserva');


        //Inicializacion de firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6_jVx6GmhYqQXCPYSAO4wls-5P1pIyaw",
  authDomain: "prueba6-5-24.firebaseapp.com",
  databaseURL: "https://prueba6-5-24-default-rtdb.firebaseio.com",
  projectId: "prueba6-5-24",
  storageBucket: "prueba6-5-24.appspot.com",
  messagingSenderId: "302334828414",
  appId: "1:302334828414:web:505baa473fbc5115d59d2f"
};

const app = initializeApp(firebaseConfig);
import {getDatabase, ref, child, get, set, update, remove, push} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
const db = getDatabase();

/*
let daysFranja = {
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: [],
  domingo: [],
}

let horariosDeServicio = {
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: [],
  domingo: [],
}*/

const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];


//Set the avaible dates of yoga
let diasQueNo = [];
let diasQueNoThai = [];
let fechasGeneradasFilt = [];



//-------------------------------------------------------------------------Funciones para obtener los servicios desde firebase-------------------------------------------------------------------------
async function getServiciosFromFirebase() {

  const firebaseUrl = "https://prueba6-5-24-default-rtdb.firebaseio.com/";
  const firebaseEndpoint = `${firebaseUrl}/Servicios.json`;

  try {
    const response = await fetch(firebaseEndpoint);
    if (!response.ok) {
      throw new Error('Error al obtener los datos de Firebase. Código de estado: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los datos de Firebase:', error);
    return null;
  }
}


async function actualizarServicios() {
  const serviciosData = await getServiciosFromFirebase();
  if (serviciosData) {
    servicios = [];
    for (let key in serviciosData) {
      const servicio = serviciosData[key];
      servicios.push({
        nombre: servicio.nombre,
        duracion: servicio.duracion,
        diasDisponibles: servicio.diasDisponibles,
        esGrupal: servicio.esGrupal,
        horarios: servicio.horarios,
        diasQueNo: servicio.diasQueNo
      });
    }
    console.log('Servicios:', servicios);
  }
}

async function establecerServiciosAVariable() {
  await actualizarServicios();
  console.log('Servicios:', servicios);

  for (let i = 0; i < servicios.length; i++) {
    let fechasGeneradas = generarFechas(servicios[i]);
    let fechasFiltradas = filtrarFechas(fechasGeneradas);

    servicios[i].fechas = fechasFiltradas;
    console.log("fechas del servicio " + servicios[i].nombre + " : " + servicios[i].fechas)
  }

  

  agregarDivConEstructura()
}

establecerServiciosAVariable()

function filtrarFechas(fechasGeneradas) {
  let fechasGeneradasFilt = [];
  
  for (let fecha of fechasGeneradas) {
    const fechaFormateada = fecha.toString().split(' ').slice(0, 4).join(' ');
    fechasGeneradasFilt.push(fechaFormateada);
  }

  return fechasGeneradasFilt;
}
/*
function filtrarFechas(){   
  for (let fecha = new Date(fechaInicio); fecha <= fechaFinal; fecha.setDate(fecha.getDate() + 1)) {
    const fechaFormateada = fecha.toString().split(' ').slice(0, 4).join(' ');
    fechasGeneradasFilt.push(fechaFormateada);
  } 
}
*/


function agregarDivConEstructura() {
  // Crear un nuevo div
  
  for (let i = 0; i < servicios.length; i++) {
    let servicio = servicios[i];
    console.log("El servicio es: " + servicio.nombre); // Aquí deberías obtener el nombre del servicio
  

    // Filtrar las fechas
    let fechasFiltradas = servicio.fechas.filter(fecha => {
      let diaFechaServicioAdaptada = traducirDia(fecha.split(" ")[0]).toLowerCase();
      return Object.keys(servicio.horarios).some(keyFecha => keyFecha.includes(diaFechaServicioAdaptada));
    });

    servicio.fechas = fechasFiltradas;

  
  
    for (let fechaKey in servicio.horarios) {

      let fecha = servicio.horarios[fechaKey];
      for (let franjaKey in fecha){
        let franja = fecha[franjaKey]
          console.log(`Franja para ${fechaKey}: ${franja.de}  a  ${franja.a}`  );
          let deSegundos = timeToSeconds(franja.de);
          let aSegundos = timeToSeconds(franja.a);
          let tiempoTotalDeFranja = aSegundos - deSegundos;
          let tiempoDelServicioEnSegundos = servicio.duracion * 60;
          let horasDisponibles = [];
            
          for (let i = deSegundos; i < aSegundos; i += tiempoDelServicioEnSegundos) {
            horasDisponibles.push(secondsToTime(i) + "hs");
          }

        franja.horasDisponibles = horasDisponibles; 
      }
    }
      

    for (let i = 0; i < servicio.fechas.length; i++){       //For para traducir y crear las fechas de yoga para luego 
      let fechasEng = servicio.fechas[i].split(' ');
      let diaTrad = traducirDia(fechasEng[0]);
      let mesTrad = traducirMes(fechasEng[1]);
      let diaFinalTrad = diaTrad + " " + fechasEng[2] + " de " + mesTrad;
      servicio.fechas[i] = diaFinalTrad;
      
      for (let j = 0; j < servicio.diasQueNo.length; j++){
        if (servicio.fechas[i].toLowerCase() == servicio.diasQueNo[j].toLowerCase()){
          servicio.fechas[i] = "No disponible";
        }
      }

      console.log(`fecha traducida   ${servicio.fechas[i]}`);
    }

      console.log(`fechas para el servicio de ${servicio.nombre} son:  ${servicio.fechas}`);

      if (servicio.nombre == "Yoga"){
        for (let i = 0; i < servicio.fechas.length; i++){
          const nuevoDiv = document.createElement('label');
          let containerDivYoga = document.querySelectorAll(`.container-fechas-yoga`);

          nuevoDiv.className = "w-checkbox activity-checkbox";
          nuevoDiv.innerHTML = `
              <div class="checkbox-text checkbox-text-yoga">${servicio.fechas[i]}</div>
              <input type="checkbox" id="a1_vinyasa-budawild_18-00_mar-2" 
                     name="a1_vinyasa-budawild_18-00_mar-2" 
                     data-name="A 1 Vinyasa Budawild 18 00 Mar 2" 
                     add-act="a1_Free-Vinyasa_18:00_mar" 
                     class="w-checkbox-input checkbox day-checkbox-yoga">
              <span for="a1_vinyasa-budawild_18-00_mar-2" 
                    class="checkbox-label w-form-label">Checkbox 100</span>
            </label>
          `;
  
  // Añadir el nuevo div al body o a cualquier otro elemento contenedor
          containerDivYoga[0].appendChild(nuevoDiv);
        }
      }else{

        for (let i = 0; i < servicio.fechas.length; i++){
          const nuevoDiv = document.createElement('label');
          let containerDivThai = document.querySelectorAll(`.container-fechas-thai`);

          nuevoDiv.className = "w-checkbox activity-checkbox";
          nuevoDiv.innerHTML = `
              <div class="checkbox-text checkbox-text-thai">${servicio.fechas[i]}</div>
              <input type="checkbox" id="a1_vinyasa-budawild_18-00_mar-2" 
                     name="a1_vinyasa-budawild_18-00_mar-2" 
                     data-name="A 1 Vinyasa Budawild 18 00 Mar 2" 
                     add-act="a1_Free-Vinyasa_18:00_mar" 
                     class="w-checkbox-input checkbox day-checkbox-thai">
              <span for="a1_vinyasa-budawild_18-00_mar-2" 
                    class="checkbox-label w-form-label">Checkbox 100</span>
          `;
  
  // Añadir el nuevo div al body o a cualquier otro elemento contenedor
          containerDivThai[0].appendChild(nuevoDiv);
        }

      }

    }

  //console.log("SSSSSSS   " + servicios[1].horarios.martes.franja0.horasDisponibles)

  addCheckboxEventListeners();
}

  /*
  // Establecer el contenido HTML del div utilizando una plantilla de cadena de texto
  nuevoDiv.innerHTML = `
    <label class="w-checkbox activity-checkbox">
      <div class="checkbox-text checkbox-text-thai"></div>
      <input type="checkbox" id="a1_vinyasa-budawild_18-00_mar-2" 
             name="a1_vinyasa-budawild_18-00_mar-2" 
             data-name="A 1 Vinyasa Budawild 18 00 Mar 2" 
             add-act="a1_Free-Vinyasa_18:00_mar" 
             class="w-checkbox-input checkbox day-checkbox-thai">
      <span for="a1_vinyasa-budawild_18-00_mar-2" 
            class="checkbox-label w-form-label">Checkbox 100</span>
    </label>
  `;
  
  // Añadir el nuevo div al body o a cualquier otro elemento contenedor
  containerDivYoga[0].appendChild(nuevoDiv);
}

// Llamada a la función con una fecha de ejemplo





function readDataFiltroYoga() {
  const dbRef = ref(db);
  let promises = [];
  for (let i = 0; i < 4; i++) {
      let promise = get(child(dbRef, 'Días que no Yoga/' + i)).then((snapshot) => {
          if (snapshot.exists()) {
              let value = snapshot.val();
              console.log("Dato recibido: " + value);
              diasQueNo.unshift(value);
          } else {
              
          }
      }).catch((error) => {
          alert("Error al obtener datos");
          console.log(error);
      });
      promises.push(promise);
  }
  // Esperar a que todas las promesas se resuelvan
  return Promise.all(promises);
}



/*
const diasYoga = [];
for (const day in horariosDeServicio) {
  if (horariosDeServicio.hasOwnProperty(day) && horariosDeServicio[day].length !== 0) {
    diasThai.push(day);
  }
}

let fechasYogaCompletas = [];
fechasGeneradas.forEach(fecha => {
  const diaDeLaSemana = traducirDia(fecha.toString().split(' ')[0]); // Obtiene el día de la semana en inglés (por ejemplo, "Tue")
  for (let i = 0; i < diasThai.length; i++){
    if (diaDeLaSemana.toLowerCase() == diasThai[i]){
      //fechasThaiCompletas.push(fecha);
    }
  }
});

//Yoga date filter
const martesYJueves = fechasGeneradasFilt.filter(fecha => {
  const diaDeLaSemana = fecha.toString().split(' ')[0]; // Obtiene el día de la semana en inglés (por ejemplo, "Tue")
  return diaDeLaSemana === 'Tue' || diaDeLaSemana === 'Thu';
});

console.log("Dato actual:   " + martesYJueves[0]);
let martesYJuevesTrad = [];

readDataFiltroYoga().then(() => {
  setTimeout(function () {

    
    let diasQueNoTrad = [];
    
    for (let i = 0; i < martesYJueves.length; i++){       //For para traducir y crear las fechas de yoga para luego 
      let martesYJuevesEng = martesYJueves[i].split(' ');
      let diaTrad = traducirDia(martesYJuevesEng[0]);
      let mesTrad = traducirMes(martesYJuevesEng[1]);
      let diaFinalTrad = diaTrad + " " + martesYJuevesEng[2] + " de " + mesTrad;
      martesYJuevesTrad.push(diaFinalTrad);
    }


    //Seguir haciendo la parte sde la traducicon de los dias para luego compararlos con los dias que



    diasQueNo.forEach(dia => {
    martesYJuevesTrad.forEach((fecha, index) => {
        
        if (dia == fecha) {
          
          martesYJuevesTrad.splice(index, 1, "No disponible"); // Elimina la fecha del array
        }
        
      });
    });

    console.log("Objeto final:  " + martesYJuevesTrad);

  }, 1400);
});



setTimeout(function () {
  let fechaFormateada;
      
  martesYJuevesTrad.forEach((fecha, i) => {
    dayCheckboxDay[i].textContent = fecha;
    if (fecha == "No disponible"){
      dayCheckbox[i].disabled = true;
    }
  });
}, 2400);




setTimeout(function () {




  /*

  function readDataFiltroThai() {
  const dbRef = ref(db);
  let promises = [];
  for (let i = 0; i < 4; i++) {
      let promise = get(child(dbRef, 'Días que no Thai/' + i)).then((snapshot) => {
          if (snapshot.exists()) {
              let value = snapshot.val();
              console.log("Dato recibido: " + value);
              diasQueNoThai.unshift(value);
          } else {
              
          }
      }).catch((error) => {
          alert("Error al obtener datos");
          console.log(error);
      });
      promises.push(promise);
  }
  // Esperar a que todas las promesas se resuelvan
  return Promise.all(promises);
}




const diasThai = [];
for (const day in horariosDeServicio) {
  if (horariosDeServicio.hasOwnProperty(day) && horariosDeServicio[day].length !== 0) {
    diasThai.push(day);
  }
}

let fechasThaiCompletas = [];
fechasGeneradas.forEach(fecha => {
  const diaDeLaSemana = traducirDia(fecha.toString().split(' ')[0]); // Obtiene el día de la semana en inglés (por ejemplo, "Tue")
  for (let i = 0; i < diasThai.length; i++){
    if (diaDeLaSemana.toLowerCase() == diasThai[i]){
      fechasThaiCompletas.push(fecha);
    }
  }
});


let fechasThaiCompletasString = [];

readDataFiltroThai().then(() => {
  setTimeout(function () {

    fechasThaiCompletasString = fechasThaiCompletas.map(fecha => fecha.toString());
    
    
    diasQueNoThai.forEach(dia => {
      fechasThaiCompletasString.forEach((fecha, index) => {
        if (fecha.includes(dia)) {
          fechasThaiCompletasString.splice(index, 1, "No disponible"); // Elimina la fecha del array
        }
      });
    });
  }, 1200);

});





setTimeout(function () {
  let fechaFormateada;
      
  fechasThaiCompletasString.forEach((fecha, i) => {
    const diaDeLaSemana = traducirDia(fecha.split(' ')[0]);
    const mes = traducirMes(fecha.split(' ')[1]);
    fechaFormateada = diaDeLaSemana + " " + fecha.split(' ').slice(2, 3).join(' ') + " de " + mes; // Formato "MMM DD AAAA"
    console.log("fecccccc : " + fechaFormateada);


    dayCheckboxDayThai[i].textContent = fechaFormateada;
  });
}, 2400);

}, 2000);


*/


//Function of checkbox - active or desactive checksbox Yoga-Thai
function manejarCambio() {
  let dayCheckbox = document.querySelectorAll('.day-checkbox-yoga');
  let dayCheckboxThai = document.querySelectorAll('.day-checkbox-thai');
  let dayCheckboxDay = document.querySelectorAll('.checkbox-text-yoga');
  let dayCheckboxDayThai = document.querySelectorAll('.checkbox-text-thai');

  if ([...dayCheckbox].some(checkbox => checkbox.checked)) {
      dayCheckboxThai.forEach(checkbox => checkbox.disabled = true);
  } else {
      dayCheckboxThai.forEach(checkbox => checkbox.disabled = false);
      detectarNoDisponibles(dayCheckboxDayThai, dayCheckboxThai);
  }

  if ([...dayCheckboxThai].some(checkbox => checkbox.checked)) {
      dayCheckbox.forEach(checkbox => checkbox.disabled = true);
  } else {
      dayCheckbox.forEach(checkbox => checkbox.disabled = false);
      detectarNoDisponibles(dayCheckboxDay, dayCheckbox);
  }
}

// ------------------------------------------------Función para convertir de "HH:mm" a segundos
function timeToSeconds(timeStr) {
  // Divide la cadena en horas y minutos
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Calcula los segundos
  const seconds = (hours * 3600) + (minutes * 60);

  return seconds;
}

// --------------------------------------------------Función para convertir de segundos a "HH:mm"
function secondsToTime(seconds) {
  // Calcula las horas y los minutos
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Asegura que los valores tengan dos dígitos
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');

  return `${hoursStr}:${minutesStr}`;
}



/*
function recibirFranjas() {

  const dbRef = ref(db);
  let promises = [];

  days.forEach((dayy) => {
    for (let i = 0; i < 4; i++) {
      let promise = get(child(dbRef, 'Franja Thai/' + dayy + '/Franja' + i)).then((snapshot) => {
        if (snapshot.exists()) {
          let value = snapshot.val();
          console.log("Dato recibido : ", value);
          daysFranja[dayy].push(value);
        } else {
          console.log("dato vcio");
          
        }
      }).catch((error) => {
        console.error("Error al obtener datos", error);
        return null;
      });
      promises.push(promise);
    }
  });

  // Esperar a que todas las promesas se resuelvan
  return Promise.all(promises);
}

recibirFranjas().then(franjas => {
  console.log("Franjas recibidas:", daysFranja);
  // Aquí puedes manejar los datos recibidos, por ejemplo:

  for (const day in daysFranja) {
    if (daysFranja.hasOwnProperty(day)) {
      const franjas = daysFranja[day];
      if (franjas.length > 0) {
        console.log(`Franjas para ${day}:`);
        franjas.forEach((franja, index) => {
          let deSegundos = timeToSeconds(franja.de);
          let aSegundos = timeToSeconds(franja.a);
          let tiempoTotalDeFranja = aSegundos - deSegundos;
          let tiempoDelServicio = "01:00";
          let tiempoDelServicioSegundos = timeToSeconds(tiempoDelServicio);

          console.log(`Franja ${index}: De ${franja.de} a ${franja.a} ---- tiempo total en sec: ${tiempoTotalDeFranja} - tiempo total en string${secondsToTime(tiempoTotalDeFranja)}`);
          
          for (let i = deSegundos; i < aSegundos; i += tiempoDelServicioSegundos){
            horariosDeServicio[day].push(secondsToTime(i)+"hs");
          }
        });
      } else {
        
      }
    }
  }

  console.log(horariosDeServicio);




}).catch(error => {
  console.error("Error al recibir franjas:", error);
});
*/


function detectarNoDisponibles(checkboxDay, checkboxItem){
  for (let i = 0; i < checkboxItem.length; i++){         //For para detectar si algun checkbox de Yoga tiene
    checkboxDay[i].textContent == "No disponible" ? checkboxItem[i].disabled = true : checkboxItem[i].disabled = false;
  }
}

// console.log("SSSSSSS   " + servicios[0].horarios.martes.franja0.horasDisponibles)
function agregarHorariosSelect(day) {
  while (selectHour.firstChild) {
    selectHour.removeChild(selectHour.firstChild);
  }

  for (let i = 0; i < servicios.length; i++) {
    let horarios = servicios[i].horarios;
    
    if (horarios[day.toLowerCase()]) {  // Convertir el día a minúsculas para coincidir con las claves del objeto
      let horas = [];

      // Recorrer cada franja horaria del día
      for (let franjaKey in horarios[day.toLowerCase()]) {
        let franja = horarios[day.toLowerCase()][franjaKey];
        horas = horas.concat(franja.horasDisponibles);  // Agregar las horas disponibles a la lista
      }

      horas.sort().forEach(function(opcion) {
        // Crear un nuevo elemento option
        let nuevaOpcion = document.createElement('option');
        // Establecer el valor y el texto de la opción
        nuevaOpcion.value = opcion;
        nuevaOpcion.textContent = opcion;
        // Añadir la nueva opción al select
        selectHour.appendChild(nuevaOpcion);
      });
    }
  }
}


let checksActivos = [];
function alMenosDosCheckeados(checkboxes) {
  checksActivos = [];
  let contadorCheckeados = 0;

  checkboxes.forEach(function(checkbox ,index) {
    if (checkbox.checked) {
      contadorCheckeados++;
      checksActivos.push(index);
    }
  });

  return contadorCheckeados >= 2;
}
function alMenosUnoCheckeado(checkboxes) {
  checksActivos = [];
  let contadorCheckeados = 0;

  checkboxes.forEach(function(checkbox ,index) {
    if (checkbox.checked) {
      contadorCheckeados++;
      checksActivos.push(index);
    }
  });

  return contadorCheckeados == 1;
}
function opacityCheck100(){
  let checkboxGeneral = document.querySelectorAll('.checkbox');
  let checkbox100 = document.querySelectorAll('.checkbox-label')
  let barraReservas = document.querySelector('.arrow-link');
  let barraReservasArrow = document.querySelector('.arrow-link span');

  barraReservas.style.transition = 'all 0.7s ease';
  barraReservas.style.backgroundColor = 'rgb(239, 85, 84)';
  barraReservas.style.color = 'rgb(255,255,255)';
  barraReservasArrow.style.transition = 'all 0.7s ease';
  barraReservasArrow.style.color = 'rgb(255,255,255)';

  setTimeout(() => {
    barraReservas.style.backgroundColor = 'rgb(121, 231, 187)';
    barraReservas.style.color = 'rgb(0,0,0)';
    barraReservasArrow.style.color = 'rgb(0,0,0)';
  }, 1000);


  for(let i = 0; i < checkboxGeneral.length; i++){
    if (checkboxGeneral[i].checked){
      checkbox100[i].style.transition = 'all 0.3s ease';
      checkbox100[i].style.opacity = '0';
    }else{
      checkbox100[i].style.transition = 'all 0.3s ease';
      checkbox100[i].style.opacity = '1';
    }
  }
}



//Select day of yoga
function addCheckboxEventListeners() {
  let dayCheckbox = document.querySelectorAll('.day-checkbox-yoga');
  let dayCheckboxThai = document.querySelectorAll('.day-checkbox-thai');

  let dayCheckboxDay = document.querySelectorAll('.checkbox-text-yoga');
  let dayCheckboxDayThai = document.querySelectorAll('.checkbox-text-thai');

  
  dayCheckbox.forEach(function(checkbox, index) {
    detectarNoDisponibles(dayCheckboxDay, dayCheckbox);
    checkbox.addEventListener('change', function() {
      manejarCambio();
      detectarNoDisponibles(dayCheckboxDay, dayCheckbox);

      userReserveHour[0].innerText = '18:00hs';
      userReserveActivity[0].innerText = 'Free Vinyasa';

      opacityCheck100();

      if (alMenosDosCheckeados(dayCheckbox)) {
        userReserveDay[0].textContent = 'Seleccione un día a la vez';
      } else if (alMenosUnoCheckeado(dayCheckbox)){
        userReserveDay[0].textContent = '';
        userReserveDay[0].textContent = dayCheckboxDay[checksActivos[0]].textContent;           
      }else{
        userReserveHour[0].innerText = '';
        userReserveActivity[0].innerText = '';
        userReserveDay[0].textContent = '';
        checksActivos = [];
      }
/*
      for (let i = 0; i < dayCheckbox.length; i++){
        let i1 = i + 1;

        

        if (alMenosDosCheckeados(dayCheckbox)) {
          console.log("Al m+enos dos checkboxes han sido checkeados.");
        } else {
          console.log("No hay al menos dos checkboxes checkeados.");
        }

        if (dayCheckbox[0].checked && dayCheckbox[1].checked) {
          let day1 = dayCheckbox[0].textContent.split(' ');
          let day2 = dayCheckbox[1].textContent.split(' ');
          userReserveDay[0].textContent = day1.slice(0, 4).join(' ') + " - " + day2.slice(0, 4).join(' ');
  
        } else if (dayCheckbox[0].checked) {
          let day = dayCheckboxDay[0].textContent.split(' ');
          userReserveDay[0].textContent = day.slice(0, 4).join(' ');
  
        } else if (dayCheckbox[1].checked) {
          let day = dayCheckboxDay[1].textContent.split(' ');
          userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        } else {
          userReserveHour[0].innerText = '';
          userReserveActivity[0].innerText = '';
          userReserveDay[0].textContent = '';
        }
      }
*/
      
    });
  });

  dayCheckboxThai.forEach(function(checkbox, index) {
    detectarNoDisponibles(dayCheckboxDayThai, dayCheckboxThai);
    checkbox.addEventListener('change', function() {
      manejarCambio();

      userReserveHour[0].innerText = '';
      userReserveActivity[0].innerText = 'Buda Thai';

      while (selectHour.firstChild) {
        selectHour.removeChild(selectHour.firstChild);
      }

      opacityCheck100();

      if (alMenosDosCheckeados(dayCheckboxThai)) {
        userReserveDay[0].textContent = 'Seleccione un día a la vez';
      } else if (alMenosUnoCheckeado(dayCheckboxThai)){
        let day = dayCheckboxDayThai[checksActivos[0]].textContent.split(' ');
        userReserveDay[0].textContent = '';
        userReserveDay[0].textContent = dayCheckboxDayThai[checksActivos[0]].textContent;    
        
        agregarHorariosSelect(day.slice(0, 1).toString());
        manejarCambioCheckbox(dayCheckboxDayThai[checksActivos[0]].textContent);
        userReserveHour[0].textContent = selectHour.value;       
      }else{
        userReserveHour[0].innerText = '';
        userReserveActivity[0].innerText = '';
        userReserveDay[0].textContent = '';
        checksActivos = [];
      }
/*
      if ((dayCheckboxThai[0].checked && dayCheckboxThai[1].checked && dayCheckboxThai[2].checked) || 
          (dayCheckboxThai[0].checked && dayCheckboxThai[1].checked) || 
          (dayCheckboxThai[0].checked && dayCheckboxThai[2].checked) || 
          (dayCheckboxThai[1].checked && dayCheckboxThai[2].checked)) {
        userReserveDay[0].textContent = 'Selecciona un día a la vez';
        while (selectHour.firstChild) {
          selectHour.removeChild(selectHour.firstChild);
        }

      } else if (dayCheckboxThai[0].checked) {
        let day = dayCheckboxDayThai[0].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;

      } else if (dayCheckboxThai[1].checked) {
        let day = dayCheckboxDayThai[1].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;

      } else if (dayCheckboxThai[2].checked) {
        let day = dayCheckboxDayThai[2].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;

      } else {
        userReserveHour[0].innerText = '';
        userReserveActivity[0].innerText = '';
        userReserveDay[0].textContent = '';
        while (selectHour.firstChild) {
          selectHour.removeChild(selectHour.firstChild);
        }
      }
        */
    });
  });
}


/*
document.addEventListener('DOMContentLoaded', function() {
  dayCheckbox.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      alert("hola")
      
      manejarCambio();
      detectarNoDisponibles(dayCheckboxDay, dayCheckbox);

      userReserveHour[0].innerText = '19:00hs';
      userReserveActivity[0].innerText = 'Free Vinyasa';

      if (dayCheckbox[0].checked && dayCheckbox[1].checked){
        let day1 = dayCheckboxDay[0].textContent.split(' ');
        let day2 = dayCheckboxDay[1].textContent.split(' ');
        userReserveDay[0].textContent = day1.slice(0, 4).join(' ') + " - " + day2.slice(0, 4).join(' ');

      } else if (dayCheckbox[0].checked){
        let day = dayCheckboxDay[0].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        
      } else if (dayCheckbox[1].checked){
        let day = dayCheckboxDay[1].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
      }
      else{
        userReserveHour[0].innerText = '';
        userReserveActivity[0].innerText = '';
        userReserveDay[0].textContent = '';

      }

      
    });
  });


  //function designed to add hours to the selectHour
  function agregarHorariosSelect(day){

    while (selectHour.firstChild) {
      selectHour.removeChild(selectHour.firstChild);
    }

    switch (day) {  
      case 'Lunes':
        horariosDeServicio.lunes.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
      case 'Martes':
        horariosDeServicio.martes.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
      case 'Miercoles':
        horariosDeServicio.miercoles.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });
        
      break;
      case 'Jueves':
        horariosDeServicio.jueves.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
      case 'Viernes':
        horariosDeServicio.viernes.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });
        
      break;
      case 'Sabado':
        horariosDeServicio.sabado.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
      case 'Domingo':
        horariosDeServicio.domingo.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
    
    }
  }

  dayCheckboxThai.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      manejarCambio();
      userReserveHour[0].innerText = '';
      userReserveActivity[0].innerText = 'Buda Thai';

      if ((dayCheckboxThai[0].checked && dayCheckboxThai[1].checked && dayCheckboxThai[2].checked) || (dayCheckboxThai[0].checked && dayCheckboxThai[1].checked) || (dayCheckboxThai[0].checked && dayCheckboxThai[2].checked) || (dayCheckboxThai[1].checked && dayCheckboxThai[2].checked)){
        userReserveDay[0].textContent = 'Selecciona un día a la vez';
        while (selectHour.firstChild) {
          selectHour.removeChild(selectHour.firstChild);
        }

      } else if (dayCheckboxThai[0].checked){
        let day = dayCheckboxDayThai[0].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;
        
      } else if (dayCheckboxThai[1].checked){
        let day = dayCheckboxDayThai[1].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;

      } else if (dayCheckboxThai[2].checked){
        let day = dayCheckboxDayThai[2].textContent.split(' ');
        userReserveDay[0].textContent = day.slice(0, 4).join(' ');
        agregarHorariosSelect(day.slice(0, 1).toString());
        userReserveHour[0].textContent = selectHour.value;

      }
      else{
        userReserveHour[0].innerText = '';
        userReserveActivity[0].innerText = '';
        userReserveDay[0].textContent = '';
        while (selectHour.firstChild) {
          selectHour.removeChild(selectHour.firstChild);
        }
      };

    });
  });

});

*/



//-----------------------------------------check the reserved hours thai and refresh select--------------------------------------------

// Array para almacenar las horas reservadas de los días seleccionados
let horasReservadasArray = [];

function obtenerHorasReservadasParaDia(dia) {
  const horasReservadasRef = child(ref(db), `Horas ya reservadas Thai/${dia}`);
  return get(horasReservadasRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Extraer las horas de los IDs
      Object.values(data).forEach(hora => horasReservadasArray.push(hora));
      return Object.values(data);
    } else {
      return [];
    }
  });
}


function inhabilitarHorasEnSelect(horasReservadas) {
  
  // Habilitar todas las opciones del select primero
  for (let i = 0; i < selectHour.options.length; i++) {
    selectHour.options[i].disabled = false;
  }
  
  // Deshabilitar las opciones que coinciden con las horas reservadas
  horasReservadas.forEach(hora => {
    for (let i = 0; i < selectHour.options.length; i++) {
      if (selectHour.options[i].value === hora) {
        selectHour.options[i].disabled = true; // Deshabilitar la opción
        selectHour.options[i].textContent += " No disponible";
      }
    }
  });
}



// Función para manejar el cambio de los checkboxes
function manejarCambioCheckbox(dia) {
  
  // Reiniciar el array de horas reservadas
  horasReservadasArray = [];

  // Array para almacenar las promesas de obtener las horas reservadas
  const promesas = [];

  console.log("Dia que se va a comparar::   " + dia)
  
  // Obtener las horas reservadas para el día y añadir la promesa al array de promesas
  const promesa = obtenerHorasReservadasParaDia(dia)
    .then(() => {
      // Las horas ya se han añadido a horasReservadasArray dentro de obtenerHorasReservadasParaDia
    });
  
  // Añadir la promesa al array de promesas
  promesas.push(promesa);


  // Esperar a que todas las promesas se resuelvan
  Promise.all(promesas)
    .then(() => {
      // Imprimir las horas reservadas para depuración
      console.log('Horas reservadas:', horasReservadasArray);
      
      // Inhabilitar las horas reservadas en el select
      inhabilitarHorasEnSelect(horasReservadasArray);
    })
    .catch((error) => {
      // Manejar cualquier error ocurrido durante la obtención de horas reservadas
      console.error('Error al obtener las horas reservadas:', error);
    });
}

// Agregar evento 'change' a cada checkbox para manejar los cambios
dayCheckboxThai.forEach(checkbox => {
  setTimeout(checkbox.addEventListener('change', manejarCambioCheckbox), 500);
});



/////////////////////////////////////////////Sigueinte paso, lograr poner disponible la hora cuando el admin elimine una reserva.


function agregarCeroDelante(numero) {
  return (numero < 10 ? '0' : '') + numero;
}

function obtenerFechaHoraActual() {
  var fechaActual = new Date();
  
  // Obtener día, mes y año
  var dia = agregarCeroDelante(fechaActual.getDate());
  var mes = agregarCeroDelante(fechaActual.getMonth() + 1); // Se suma 1 porque los meses van de 0 a 11
  var año = fechaActual.getFullYear();
  
  // Obtener hora, minutos y segundos
  var hora = agregarCeroDelante(fechaActual.getHours());
  var minutos = agregarCeroDelante(fechaActual.getMinutes());
  var segundos = agregarCeroDelante(fechaActual.getSeconds());
  
  // Formatear la fecha y hora
  var fechaHoraFormateada = dia + '/' + mes + '/' + año + ' ' + hora + ':' + minutos + ':' + segundos;
  
  return fechaHoraFormateada;
}


//--------------------------------------------------ADD data---------------------------------------------------
function AddData(){

  reserveErrors.textContent = "";
  let infoSumbitReserve = [];
  if (!userName.value.includes(" ") || userName.value === ""){
    reserveErrors.innerHTML = `Ingrese Nombre y Apellido.`
    //infoSumbitReserve.unshift("Ingrese Nombre y Apellido.");   //temporal
  };

  if (!userEmail.value.includes("@") || userName.value === "" || userEmail.value.includes(" ")){
    //infoSumbitReserve.unshift("Ingrese un Email correcto.");    //temporal
    reserveErrors.innerHTML = reserveErrors.textContent + `<br>Ingrese un Email correcto.`;
  };

  if (!userEmail.value.includes("@") || userEmail.value === "" || userEmail.value.includes(" ") || !userName.value.includes(" ") || userName.value === ""){
   
  };

  infoSumbitReserve = [];


if (reserveErrors.textContent === ""){

  if (userReserveActivity[0].innerText == 'Free Vinyasa') {
    const reserveDay = userReserveDay[0].textContent;
    const reservePath = 'Agenda Yoga/' + reserveDay; // Ruta base para el día específico
    
    // Obtener una referencia a la base de datos
    const dbRef = ref(db);

    // Construir la ruta completa de la reserva
    const reservaRef = child(dbRef, reservePath);

    // Generar un nuevo UID para la reserva
    const newReserveRef = push(reservaRef);

    set(newReserveRef, {
      nombre: userName.value,
      email: userEmail.value,
      timestamp: obtenerFechaHoraActual()  // Agregar marca de tiempo
    })
    .then(() => {
      alert("Reserva realizada! Muchas gracias.");
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch((error) => {
      alert("Error al realizar la reserva.");
      console.log(error);
    });
    


  }else if (userReserveActivity[0].innerText == 'Buda Thai') {
    
    const reserveDay = userReserveDay[0].textContent;
    const reservePath = 'Agenda Thai/' + reserveDay; // Ruta base para el día específico
    const reservedHoursPath = 'Horas ya reservadas Thai/' + reserveDay; // Ruta para las horas reservadas
    
    // Obtener una referencia a la base de datos
    const dbRef = ref(db);

    // Construir la ruta completa de la reserva
    const reservaRef = child(dbRef, reservePath);

    // Generar un nuevo UID para la reserva
    const newReserveRef = push(reservaRef);
    
        // Añadir la nueva reserva a la base de datos
    set(newReserveRef, {
      nombre: userName.value,
      email: userEmail.value,
      hora: selectHour.value,
      timestamp: obtenerFechaHoraActual()
    })
    .then(() => {

      const reservedHoursRef = child(dbRef, reservedHoursPath);

      push(reservedHoursRef, selectHour.value)
      .then(() =>{
        alert("Reserva realizada! Muchas gracias.");
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        alert("Error al añadir la hora reservada.");
        console.error("Error al añadir la hora reservada: ", error);
      });

    })
    .catch((error) => {
      alert("Error al realizar la reserva.");
      console.log(error);
    });
    }



  }
}




setTimeout(function() {
    reserveButton.addEventListener('click', AddData);
  
  }, 200); 


//---------------------agregar hora a texto de resumen de cita---------------
selectHour.addEventListener('change', ()=>{
  userReserveHour[0].textContent = selectHour.value;
})



//<script src="http://127.0.0.1:5500/reserve.js" type="module"></script>




//<!--<script type="text/javascript" src="https://unpkg.com/budabai"> </script>-->