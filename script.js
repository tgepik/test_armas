const preguntas = [];
const quizContainer = document.getElementById('quiz-container');

function cargarPreguntas() {
    fetch('preguntas.txt') // Ruta del archivo
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo de preguntas.");
            }
            return response.text();
        })
        .then(text => {
            if (!text) {
                throw new Error("El archivo de preguntas está vacío o no se cargó correctamente.");
            }
           
            // Dividir el contenido en líneas
            const lineas = text.trim().split('\n');
           
            // Procesar cada línea
            lineas.forEach(linea => {
                // Dividir cada línea en partes usando '|' como separador
                const partes = linea.split('|');
               
                if (partes.length < 6) {
                    console.error("Formato incorrecto en la línea:", linea);
                    return;
                }

                const id = partes[0].trim();
                const preguntaTexto = partes[1].trim();
                const opciones = [
                    partes[2].trim(), // A) Opción 1
                    partes[3].trim(), // B) Opción 2
                    partes[4].trim()  // C) Opción 3
                ];
                const respuestaCorrecta = partes[5].trim(); // Respuesta correcta (e.g., "A")
               
                const pregunta = {
                    id: id,
                    texto: preguntaTexto,
                    opciones: opciones,
                    respuestaCorrecta: respuestaCorrecta
                };
               
                preguntas.push(pregunta);
            });
           
            // Llamar a la función para mostrar las preguntas
            mostrarPreguntas();
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
            quizContainer.innerHTML = `<p>Error al cargar el test. Por favor, inténtalo más tarde.</p>`;
        });
}

function mostrarPreguntas() {
    preguntas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('question');
       
        // Añadir el texto de la pregunta
        const preguntaTexto = document.createElement('p');
        preguntaTexto.textContent = `${index + 1}. ${pregunta.texto}`;
        preguntaDiv.appendChild(preguntaTexto);
       
        // Añadir las opciones como botones de radio
        pregunta.opciones.forEach((opcion, i) => {
            const opcionLabel = document.createElement('label');
            const opcionInput = document.createElement('input');
            opcionInput.type = 'radio';
            opcionInput.name = `pregunta${index}`;
            opcionInput.value = String.fromCharCode(65 + i); // Convertir 0 -> A, 1 -> B, 2 -> C
            opcionLabel.appendChild(opcionInput);
            opcionLabel.appendChild(document.createTextNode(opcion));
            preguntaDiv.appendChild(opcionLabel);
            preguntaDiv.appendChild(document.createElement('br'));
        });
       
        quizContainer.appendChild(preguntaDiv);
    });
}

function verificarRespuestas() {
    let correctas = 0;
   
    preguntas.forEach((pregunta, index) => {
        const opciones = document.getElementsByName(`pregunta${index}`);
        let respuestaSeleccionada = null;
       
        opciones.forEach(opcion => {
            if (opcion.checked) {
                respuestaSeleccionada = opcion.value;
            }
        });
       
        if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
            correctas++;
        }
    });
   
    const resultado = document.getElementById('resultado');
    resultado.textContent = `Obtuviste ${correctas} de ${preguntas.length} respuestas correctas.`;
}

// Cargar las preguntas al cargar la página
window.onload = cargarPreguntas;
