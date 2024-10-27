// Seleccionamos el contenedor donde aparecerán las preguntas
const quizContainer = document.getElementById('quiz-container');

// Variable global para almacenar las preguntas cargadas
let preguntas = [];

// Función para cargar preguntas desde preguntas.txt
function cargarPreguntas() {
    fetch('preguntas.txt') // Cambia la ruta si es necesario
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo de preguntas.");
            }
            return response.text();
        })
        .then(text => {
            // Dividimos el texto en líneas para obtener cada pregunta
            const lineas = text.trim().split('\n');
           
            // Procesamos cada línea para extraer las preguntas y opciones
            lineas.forEach(linea => {
                const [id, preguntaTexto, opciones, respuestaCorrecta] = linea.split('|');
               
                // Creamos una pregunta con opciones en formato de objeto
                const pregunta = {
                    id: id.trim(),
                    texto: preguntaTexto.trim(),
                    opciones: opciones.split('.').map(op => op.trim()),
                    respuestaCorrecta: respuestaCorrecta.trim()
                };
               
                // Agregamos la pregunta al array de preguntas
                preguntas.push(pregunta);
            });

            // Llamamos a la función para mostrar el test una vez cargadas las preguntas
            mostrarPreguntas();
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
            quizContainer.innerHTML = `<p>Error al cargar el test. Por favor, inténtalo más tarde.</p>`;
        });
}

// Función para mostrar las preguntas en la página
function mostrarPreguntas() {
    quizContainer.innerHTML = ''; // Limpiamos el contenedor
   
    // Iteramos sobre cada pregunta y creamos el HTML correspondiente
    preguntas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('pregunta');
       
        // Título de la pregunta
        const preguntaTexto = document.createElement('p');
        preguntaTexto.innerText = `${index + 1}. ${pregunta.texto}`;
        preguntaDiv.appendChild(preguntaTexto);
       
        // Opciones de respuesta
        pregunta.opciones.forEach((opcion, i) => {
            const opcionLabel = document.createElement('label');
            const opcionInput = document.createElement('input');
           
            opcionInput.type = 'radio';
            opcionInput.name = `pregunta${index}`;
            opcionInput.value = opcion[0]; // Guardamos "A", "B" o "C" como valor
            opcionLabel.appendChild(opcionInput);
            opcionLabel.append(` ${opcion}`);
           
            preguntaDiv.appendChild(opcionLabel);
            preguntaDiv.appendChild(document.createElement('br'));
        });
       
        quizContainer.appendChild(preguntaDiv);
    });
   
    // Botón para comprobar respuestas
    const botonComprobar = document.createElement('button');
    botonComprobar.innerText = 'Comprobar Respuestas';
    botonComprobar.onclick = comprobarRespuestas;
    quizContainer.appendChild(botonComprobar);
}

// Función para comprobar las respuestas del usuario
function comprobarRespuestas() {
    let correctas = 0;

    preguntas.forEach((pregunta, index) => {
        const opciones = document.getElementsByName(`pregunta${index}`);
        let respuestaSeleccionada = '';

        // Encontramos la opción seleccionada
        opciones.forEach(opcion => {
            if (opcion.checked) {
                respuestaSeleccionada = opcion.value;
            }
        });

        // Comprobamos si la respuesta es correcta
        if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
            correctas++;
        }
    });

    // Mostramos el resultado al usuario
    alert(`Has acertado ${correctas} de ${preguntas.length} preguntas.`);
}

// Llamamos a la función para cargar las preguntas al cargar la página
cargarPreguntas();
