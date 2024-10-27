const preguntasPorTema = {
    1: { cantidad: 4, preguntas: [] },
    2: { cantidad: 3, preguntas: [] },
    3: { cantidad: 3, preguntas: [] },
    4: { cantidad: 4, preguntas: [] },
    5: { cantidad: 3, preguntas: [] },
    6: { cantidad: 3, preguntas: [] },
    7: { cantidad: 4, preguntas: [] }
};

const quizContainer = document.getElementById('quiz-container');

function cargarPreguntas() {
    fetch('preguntas.txt')
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

            const lineas = text.trim().split('\n');
            let temaActual = null;

            lineas.forEach(linea => {
                // Detectar el inicio de un tema
                if (linea.startsWith('# Tema')) {
                    const temaMatch = linea.match(/# Tema (\d+)/);
                    if (temaMatch) {
                        temaActual = parseInt(temaMatch[1]);
                    }
                } else if (temaActual && preguntasPorTema[temaActual]) {
                    // Procesar las preguntas solo si el tema es válido
                    const partes = linea.split('|');
                   
                    if (partes.length < 6) {
                        console.error("Formato incorrecto en la línea:", linea);
                        return;
                    }

                    const pregunta = {
                        id: partes[0].trim(),
                        texto: partes[1].trim(),
                        opciones: [
                            partes[2].trim(), // A) Opción 1
                            partes[3].trim(), // B) Opción 2
                            partes[4].trim()  // C) Opción 3
                        ],
                        respuestaCorrecta: partes[5].trim()
                    };

                    preguntasPorTema[temaActual].preguntas.push(pregunta);
                }
            });

            seleccionarPreguntasAleatorias();
            mostrarPreguntas();
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
            quizContainer.innerHTML = `<p>Error al cargar el test. Por favor, inténtalo más tarde.</p>`;
        });
}

function seleccionarPreguntasAleatorias() {
    Object.keys(preguntasPorTema).forEach(tema => {
        const temaData = preguntasPorTema[tema];
        const { preguntas, cantidad } = temaData;
       
        if (preguntas.length >= cantidad) {
            // Seleccionar `cantidad` de preguntas aleatorias del tema
            temaData.preguntasSeleccionadas = [];
            const indicesSeleccionados = new Set();
           
            while (indicesSeleccionados.size < cantidad) {
                const index = Math.floor(Math.random() * preguntas.length);
                if (!indicesSeleccionados.has(index)) {
                    indicesSeleccionados.add(index);
                    temaData.preguntasSeleccionadas.push(preguntas[index]);
                }
            }
        } else {
            console.warn(`No hay suficientes preguntas en el tema ${tema}.`);
            temaData.preguntasSeleccionadas = preguntas;
        }
    });
}

function mostrarPreguntas() {
    Object.values(preguntasPorTema).forEach(temaData => {
        temaData.preguntasSeleccionadas.forEach((pregunta, index) => {
            const preguntaDiv = document.createElement('div');
            preguntaDiv.classList.add('question');
           
            const preguntaTexto = document.createElement('p');
            preguntaTexto.textContent = `${pregunta.id}. ${pregunta.texto}`;
            preguntaDiv.appendChild(preguntaTexto);

            pregunta.opciones.forEach((opcion, i) => {
                const opcionLabel = document.createElement('label');
                const opcionInput = document.createElement('input');
                opcionInput.type = 'radio';
                opcionInput.name = `pregunta${pregunta.id}`;
                opcionInput.value = String.fromCharCode(65 + i); // Convertir 0 -> A, 1 -> B, 2 -> C
                opcionLabel.appendChild(opcionInput);
                opcionLabel.appendChild(document.createTextNode(opcion));
                preguntaDiv.appendChild(opcionLabel);
                preguntaDiv.appendChild(document.createElement('br'));
            });
           
            quizContainer.appendChild(preguntaDiv);
        });
    });
}

function verificarRespuestas() {
    let correctas = 0;
    const incorrectas = [];

    Object.values(preguntasPorTema).forEach(temaData => {
        temaData.preguntasSeleccionadas.forEach(pregunta => {
            const opciones = document.getElementsByName(`pregunta${pregunta.id}`);
            let respuestaSeleccionada = null;

            opciones.forEach(opcion => {
                if (opcion.checked) {
                    respuestaSeleccionada = opcion.value;
                }
            });

            if (respuestaSeleccionada === pregunta.respuestaCorrecta) {
                correctas++;
            } else {
                incorrectas.push({
                    pregunta: pregunta.texto,
                    respuestaSeleccionada,
                    respuestaCorrecta: pregunta.respuestaCorrecta
                });
            }
        });
    });

    const resultado = document.getElementById('resultado');
    resultado.textContent = `Obtuviste ${correctas} de 24 respuestas correctas.`;

    mostrarRespuestasIncorrectas(incorrectas);
}

function mostrarRespuestasIncorrectas(incorrectas) {
    const incorrectasContainer = document.getElementById('incorrectas');
    incorrectasContainer.innerHTML = "<h3>Respuestas Incorrectas</h3>";

    incorrectas.forEach(inc => {
        const incDiv = document.createElement('div');
        incDiv.classList.add('incorrect-answer');

        const preguntaTexto = document.createElement('p');
        preguntaTexto.innerHTML = `<strong>Pregunta:</strong> ${inc.pregunta}`;
       
        const respuestaSeleccionada = document.createElement('p');
        respuestaSeleccionada.innerHTML = `<strong>Tu respuesta:</strong> ${inc.respuestaSeleccionada || "No contestada"}`;
       
        const respuestaCorrecta = document.createElement('p');
        respuestaCorrecta.innerHTML = `<strong>Respuesta correcta:</strong> ${inc.respuestaCorrecta}`;

        incDiv.appendChild(preguntaTexto);
        incDiv.appendChild(respuestaSeleccionada);
        incDiv.appendChild(respuestaCorrecta);

        incorrectasContainer.appendChild(incDiv);
    });
}

window.onload = cargarPreguntas;
