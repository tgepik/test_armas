// Fetch the questions file
fetch('preguntas.txt')
    .then(response => response.text())
    .then(text => {
        const questions = text.split('\n');
        const container = document.getElementById('questions-container');

        questions.forEach(line => {
            if (line.trim() !== '') { // Ignora líneas vacías
                const [id, question, optionA, optionB, optionC, correctAnswer] = line.split('|');
               
                // Crear el contenedor para la pregunta
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
               
                // Añadir la pregunta
                const questionText = document.createElement('p');
                questionText.textContent = `${id}. ${question}`;
                questionDiv.appendChild(questionText);
               
                // Crear opciones de respuesta
                [optionA, optionB, optionC].forEach((option, index) => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `question-${id}`;
                    input.value = option[0]; // A, B, o C
                    label.appendChild(input);
                    label.append(option.slice(2)); // Muestra la opción sin el identificador
                   
                    questionDiv.appendChild(label);
                    questionDiv.appendChild(document.createElement('br')); // Salto de línea
                });

                container.appendChild(questionDiv);
            }
        });
    })
    .catch(error => console.error('Error al cargar las preguntas:', error));

