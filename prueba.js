
//Generacion de fechas
function traducirDia(dia) {
  switch (dia) {
    case 'Mon':
      return 'Lunes';
    case 'Tue':
      return 'Martes';
    case 'Wed':
      return 'Miércoles';
    case 'Thu':
      return 'Jueves';
    case 'Fri':
      return 'Viernes';
    case 'Sat':
      return 'Sábado';
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


let fechaInicio;
let fechaFinal;
let fechasGeneradas = [];

function generarFechas(){
  fechasGeneradas = [];
  fechaInicio = new Date();
  // Incrementa la fecha de inicio en un día para comenzar desde mañana
  fechaInicio.setDate(fechaInicio.getDate() + 1);
  
  // Fecha final (30 días después de la fecha de inicio)
  fechaFinal = new Date();
  fechaFinal.setDate(fechaInicio.getDate() + 6);
  
  // Genera las fechas en el rango y las agrega al array
  for (let fecha = new Date(fechaInicio); fecha <= fechaFinal; fecha.setDate(fecha.getDate() + 1)) {
    fechasGeneradas.push(new Date(fecha));
  }
}



//Inputs
let userName = document.querySelector('.name-input');
let userEmail = document.querySelector('.email-input');
let selectHour = document.querySelector('.select-hour');
let selectHourBlock = document.querySelector('.input-block-hour');

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

selectHourBlock.style.display = 'none';



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


//Set the avaible dates of yoga
let diasQueNo = [];
let diasQueNoThai = [];
let fechasGeneradasFilt = [];


function filtrarFechas(){   
  for (let fecha = new Date(fechaInicio); fecha <= fechaFinal; fecha.setDate(fecha.getDate() + 1)) {
    const fechaFormateada = fecha.toString().split(' ').slice(0, 4).join(' ');
    fechasGeneradasFilt.push(fechaFormateada);
  } 
}



function readDataFiltroYoga() {
  const dbRef = ref(db);
  let promises = [];
  for (let i = 0; i < 4; i++) {
      let promise = get(child(dbRef, 'Días que no Yoga/' + 'Fecha' + i)).then((snapshot) => {
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


function readDataFiltroThai() {
  const dbRef = ref(db);
  let promises = [];
  for (let i = 0; i < 4; i++) {
      let promise = get(child(dbRef, 'Días que no Thai/' + 'Fecha' + i)).then((snapshot) => {
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



generarFechas();
filtrarFechas();

//Yoga date filter
const martesYJueves = fechasGeneradasFilt.filter(fecha => {
  const diaDeLaSemana = fecha.toString().split(' ')[0]; // Obtiene el día de la semana en inglés (por ejemplo, "Tue")
  return diaDeLaSemana === 'Tue' || diaDeLaSemana === 'Thu';
});

let martesYJuevesString = [];

readDataFiltroYoga().then(() => {
  setTimeout(function () {

    martesYJuevesString = martesYJueves.map(fecha => fecha.toString());
    console.log(martesYJuevesString);
    
    diasQueNo.forEach(dia => {
      martesYJuevesString.forEach((fecha, index) => {
        if (fecha.includes(dia)) {
          martesYJuevesString.splice(index, 1, "No disponible"); // Elimina la fecha del array
        }
      });
    });
  }, 1200);
});



setTimeout(function () {
  let fechaFormateada;
      
  martesYJuevesString.forEach((fecha, i) => {
    const diaDeLaSemana = traducirDia(fecha.split(' ')[0]);
    const mes = traducirMes(fecha.split(' ')[1]);
    fechaFormateada = diaDeLaSemana + " " + fecha.split(' ').slice(2, 3).join(' ') + " de " + mes; // Formato "MMM DD AAAA"
    console.log(fechaFormateada);

    dayCheckboxDay[i].textContent = fechaFormateada;
  });
}, 2400);






//Thai date filter
const luMieVie = fechasGeneradas.filter(fecha => {
  const diaDeLaSemana = fecha.toString().split(' ')[0]; // Obtiene el día de la semana en inglés (por ejemplo, "Tue")
  return diaDeLaSemana === 'Mon' || diaDeLaSemana === 'Wed' || diaDeLaSemana === 'Fri';
});

let luMieJueString = [];

readDataFiltroThai().then(() => {
  setTimeout(function () {

    luMieJueString = luMieVie.map(fecha => fecha.toString());
    console.log(luMieJueString);
    
    diasQueNoThai.forEach(dia => {
      luMieJueString.forEach((fecha, index) => {
        if (fecha.includes(dia)) {
          luMieJueString.splice(index, 1, "No disponible"); // Elimina la fecha del array
        }
      });
    });
  }, 1200);

});



setTimeout(function () {
  let fechaFormateada;
      
  luMieJueString.forEach((fecha, i) => {
    const diaDeLaSemana = traducirDia(fecha.split(' ')[0]);
    const mes = traducirMes(fecha.split(' ')[1]);
    fechaFormateada = diaDeLaSemana + " " + fecha.split(' ').slice(2, 3).join(' ') + " de " + mes; // Formato "MMM DD AAAA"
    console.log(fechaFormateada);

    dayCheckboxDayThai[i].textContent = fechaFormateada;
  });
}, 2400);



let hoursDmtMon= [];
let hoursDmtWed= [];
let hoursDmtFri = [];
  
let hoursNoDmtMon = [];
let hoursNoDmtWed= [];
let hoursNoDmtFri = [];
const dbRef = ref(db);


    //--------Recibir datos
function recibirHorarios(valueOfI, firstValue, secondValue, thirdValue, day){
  let promises = [];
  for (let i = 0; i < valueOfI; i++) {
      let promise = get(child(dbRef, firstValue + secondValue + thirdValue +  i)).then((snapshot) => {
          if (snapshot.exists()) {
              let value = snapshot.val();
              console.log("Dato recibido: " + value);
              day.unshift(value);
          } else {
              
          }
      }).catch((error) => {
          alert("Error al obtener datos");
          console.log(error);
      });
  }
  return Promise.all(promises);
}

setTimeout(function () {
  recibirHorarios(5, 'Horarios Thai/', 'Lu/', 'Hora', hoursDmtMon);
  recibirHorarios(5, 'Horarios Thai/', 'Mie/', 'Hora', hoursDmtWed);
  recibirHorarios(5, 'Horarios Thai/', 'Vie/', 'Hora', hoursDmtFri);
}, 1200);


setTimeout(function () {
  console.log("Hora de thai: " + hoursDmtMon.sort());
  console.log("Hora de thai: " + hoursDmtWed.sort());
  console.log("Hora de thai: " + hoursDmtFri.sort());


}, 2000);


//Function of checkbox - active or desactive checksbox Yoga-Thai
function manejarCambio() {
  if ([...dayCheckbox].some(checkbox => checkbox.checked)) {
      dayCheckboxThai.forEach(checkbox => checkbox.disabled = true);
  } else {
      dayCheckboxThai.forEach(checkbox => checkbox.disabled = false);
  }

  if ([...dayCheckboxThai].some(checkbox => checkbox.checked)) {
      dayCheckbox.forEach(checkbox => checkbox.disabled = true);
  } else {
      dayCheckbox.forEach(checkbox => checkbox.disabled = false);
  }
}



//Select day of yoga

document.addEventListener('DOMContentLoaded', function() {
  dayCheckbox.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      manejarCambio();
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
        hoursDmtMon.sort().forEach(function(opcion) {
          // Crea un nuevo elemento option
          let nuevaOpcion = document.createElement('option');
          // Establece el valor y el texto de la opción
          nuevaOpcion.value = opcion;
          nuevaOpcion.textContent = opcion;
          // Añade la nueva opción al select
          selectHour.appendChild(nuevaOpcion);
        });

      break;
      case 'Miércoles':
        hoursDmtWed.sort().forEach(function(opcion) {
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
        hoursDmtFri.sort().forEach(function(opcion) {
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
      selectHourBlock.style.display = 'block';

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
        selectHourBlock.style.display = 'none';
      };

    });
  });

});





//-----------------------------------------check the inputs content--------------------------------------------




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
      email: userEmail.value
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
      hora: selectHour.value
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
