// Obtención de los elementos del DOM
var modal = document.getElementById("input-modal");
var closeModalBtn = document.getElementById("close-button");

var alertElement = document.getElementsByClassName("alert")[0];
var alertTextMessageElement = document.getElementById("alert-message");

var nodesTextInput = document.getElementById("nodes-input");
var edgesTextArea = document.getElementById("edges-textarea");

// Variables globales para almacenar los nodos y la matriz de adyacencia
var nodes = [];
var adjacencyMatrix = [];

// Función que verifica si la relación es reflexiva
function isReflexive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        if (adjacencyMatrix[i][i] != 1) { // Comprueba si todos los elementos de la diagonal principal son 1
            return false;
        }
    }
    return true;
}

// Función que verifica si la relación es irreflexiva
function isIrreflexive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        if (adjacencyMatrix[i][i] == 1) { // Comprueba que ningún elemento de la diagonal principal sea 1
            return false;
        }
    }
    return true;
}

// Función que verifica si la relación es simétrica
function isSymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                if (adjacencyMatrix[j][i] != 1) { // Si hay una relación en una dirección, debe haber en la inversa
                    return false;
                }
            }
        }
    }
    return true;
}

// Función que verifica si la relación es asimétrica
function isAsymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                if (adjacencyMatrix[j][i] == 1) { // Si hay relaciones bidireccionales, no es asimétrica
                    return false;
                }
            }
        }
    }
    return true;
}

// Función que verifica si la relación es antisimétrica
function isAntisymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1 && adjacencyMatrix[j][i] == 1 &&  i != j ) { // La relación no puede ser bidireccional excepto en los bucles
                return false; 
            }
        }
    }
    return true;
}

// Función que verifica si la relación es transitiva
function isTransitive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    if (adjacencyMatrix[j][k] == 1 && adjacencyMatrix[i][k] != 1) { // Si existe una relación indirecta, debe haber una directa
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

// Función que determina si es una relación de orden parcial
function isPartialOrder(isReflexive, isAntisymmetric, isTransitive) {
    return isReflexive && isAntisymmetric && isTransitive; // Debe cumplir con reflexividad, antisimetría y transitividad
}

// Función que determina si es una relación de equivalencia
function isEquivalence(isReflexive, isSymmetric, isTransitive) {
    return isReflexive && isSymmetric && isTransitive; // Debe cumplir con reflexividad, simetría y transitividad
}

// Función principal que se ejecuta al presionar el botón "Procesar"
function check() {
    // Resetear alertas y matrices
    alertElement.style.display = "none";

    nodes = [];
    adjacencyMatrix = [];

    // Capturar los nodos y eliminar espacios en blanco
    var rawNodes = nodesTextInput.value.replace(/\s/g, "");

    // Validar que no sea un conjunto vacío
    if (!rawNodes) {
        alertTextMessageElement.innerText = "[ERROR] El conjunto vacío no está permitido.";

        alertElement.style.display = "block"; // Mostrar error

        return;
    }

    // Crear la lista de nodos
    nodes = rawNodes.split(",");

    // Inicializar la matriz de adyacencia
    for (var i = 0; i < nodes.length; i++) {
        var row = [];

        for (var j = 0; j < nodes.length; j++) {
            row.push(0); // Inicializar con ceros
        }

        adjacencyMatrix.push(row);
    }

    // Capturar los pares ordenados y eliminar espacios
    var rawEdges = edgesTextArea.value.replace(/\s/g, "");

    var edges = rawEdges.split((/[()]+,*/)).filter(function(e) { return e });
    
    // Llenar la matriz de adyacencia con los pares ordenados
    for (let edge of edges) {
        var pair = edge.split(",");

        if (pair.length != 2) {
            alertTextMessageElement.innerText = `[ERROR] El par ordenado (${edge}) no cuenta con el formato adecuado.`;

            alertElement.style.display = "block";            

            return;
        }

        // Convertir los pares a índices de la matriz
        var from = pair[0];
        var to = pair[1];

        var row = nodes.indexOf(from);
        var column = nodes.indexOf(to);

        // Validar si los nodos existen
        if (row == -1 || column == -1) {
            alertTextMessageElement.innerText = `[ERROR] El par ordenado (${edge}) tiene un elemento que no se encuentra en A.`;

            alertElement.style.display = "block";            

            return;
        }

        adjacencyMatrix[row][column] = 1; // Asignar 1 en la matriz para el par
    }  

    modal.style.display = "none";

    // Verificar las propiedades de la relación
    verifyProperties();

    // Mostrar el panel correspondiente si no es ninguna relación válida
    var panelNone = document.querySelector(".panel-none");
    var panelPartialOrder = document.querySelector(".panel-partial-order");
    var panelEquivalence = document.querySelector(".panel-equivalence");

    if (panelPartialOrder.style.display === "none" && panelEquivalence.style.display === "none") {
        // Si ninguna relación es válida, mostrar el panel de "ninguna relación"
        panelNone.style.display = "block";
    } else {
        panelNone.style.display = "none";
    }
}

// Función que verifica y muestra las propiedades
function verifyProperties() {
    // Verificación de reflexividad
    var isAdjMatrixReflexive = isReflexive(adjacencyMatrix);
    if (isAdjMatrixReflexive) {
        var isReflexiveListItem = document.getElementById("isReflexive");
        document.getElementById("isReflexive").style.color = "green";
        isReflexiveListItem.classList.add("checked");
    } else {
        document.getElementById("isReflexive").style.color = "red";
    }

    // Repetir la lógica para las demás propiedades: irreflexiva, simétrica, asimétrica, antisimétrica, transitiva
    var isAdjMatrixIrreflexive = isIrreflexive(adjacencyMatrix);
    if (isAdjMatrixIrreflexive) {
        var isIrreflexiveListItem = document.getElementById("isIrreflexive");
        document.getElementById("isIrreflexive").style.color = "green";
        isIrreflexiveListItem.classList.add("checked");
    } else {
        document.getElementById("isIrreflexive").style.color = "red";
    }

    var isAdjMatrixSymmetric = isSymmetric(adjacencyMatrix);
    if (isAdjMatrixSymmetric) {
        var isSymmetricListItem = document.getElementById("isSymmetric");
        document.getElementById("isSymmetric").style.color = "green";
        isSymmetricListItem.classList.add("checked");
    } else {
        document.getElementById("isSymmetric").style.color = "red";
    }

    var isAdjMatrixAsymmetric = isAsymmetric(adjacencyMatrix)
    if (isAdjMatrixAsymmetric) {
        var isAsymmetricListItem = document.getElementById("isAsymmetric");
        document.getElementById("isAsymmetric").style.color = "green";
        isAsymmetricListItem.classList.add("checked");
    } else {
        document.getElementById("isAsymmetric").style.color = "red";
    }

    var isAdjMatrixAntisymmetric = isAntisymmetric(adjacencyMatrix)
    if (isAdjMatrixAntisymmetric) {
        var isAntisymmetricListItem = document.getElementById("isAntisymmetric");
        document.getElementById("isAntisymmetric").style.color = "green";
        isAntisymmetricListItem.classList.add("checked");
    } else {
        document.getElementById("isAntisymmetric").style.color = "red";
    }

    var isAdjMatrixTransitive = isTransitive(adjacencyMatrix);
    if (isAdjMatrixTransitive) {
        var isTransitiveListItem = document.getElementById("isTransitive");
        document.getElementById("isTransitive").style.color = "green"
        isTransitiveListItem.classList.add("checked");
    } else {
        document.getElementById("isTransitive").style.color = "red";
    }

    // Dibujar matriz de adyacencia y grafo
    drawGraphAndMatrix();
    // Verificar si es relación de equivalencia o de orden parcial
    verifyIfEquivalence(isAdjMatrixReflexive, isAdjMatrixSymmetric, isAdjMatrixTransitive);
    verifyIfPartialOrder(isAdjMatrixReflexive, isAdjMatrixAntisymmetric, isAdjMatrixTransitive);
}

function drawGraphAndMatrix() {
    var graphRawNodes = []; // Lista para los nodos del grafo
    var graphRawEdges = []; // Lista para las aristas del grafo

    // Obtener el elemento de la tabla de la matriz de adyacencia
    var adjacencyMatrixTableElement = document.getElementById("adjacencyMatrixTable");

    var headers = document.getElementById("adjacencyMatrixTableHeaders");
    // Crear encabezados de la tabla (los nombres de los nodos)
    headers.appendChild(document.createElement("th")); // Crear un encabezado vacío para la esquina superior izquierda
    
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var th = document.createElement("th");
        
        th.innerText = nodes[i]; // Asignar el nombre del nodo al encabezado
        headers.appendChild(th);

        // Agregar nodos al grafo
        graphRawNodes.push({id: i + 1, label: nodes[i]});
    }

    // Crear filas de la tabla (los valores de la matriz de adyacencia)
    var tbody = adjacencyMatrixTableElement.getElementsByTagName("tbody")[0];
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var tr = document.createElement("tr"); // Crear una nueva fila para cada nodo

        // Crear la primera columna con el nombre del nodo
        var node = document.createElement("th")
        node.innerText = nodes[i];

        tr.appendChild(node);
        // Llenar la fila con los valores de la matriz de adyacencia
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            var td = document.createElement("td");

            td.innerText = adjacencyMatrix[i][j]; // Colocar el valor de la relación (0 o 1)
            tr.appendChild(td);

            // Si existe una relación (valor 1), agregar una arista al grafo
            if (adjacencyMatrix[i][j] == 1) {
                graphRawEdges.push({from: i + 1, to: j + 1}); // Definir la dirección de la arista
            }
        }

        tbody.appendChild(tr); // Añadir la fila completa a la tabla
    }

    // Crear el grafo visual usando la biblioteca vis.js
    var graphNodes = new vis.DataSet(graphRawNodes); // Crear conjunto de nodos
    var graphEdges = new vis.DataSet(graphRawEdges); // Crear conjunto de aristas

    var container = document.getElementById('graph-canvas'); // Obtener el contenedor para el grafo

    // Definir los datos del grafo
    var data = {
        nodes: graphNodes,
        edges: graphEdges
    };

    // Opciones del grafo, como mostrar flechas en las aristas
    var options = {
        edges: {
            arrows: {
                to: {
                    enabled: true   // Activar flechas en las aristas
                }
            }
        },
        interaction: {
            navigationButtons: true, // Botones de navegación para interactuar con el grafo
            keyboard: true, // Habilitar interacción con teclado
        },
    };

    // Crear el grafo dentro del contenedor usando vis.js
    var network = new vis.Network(container, data, options);
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

function verifyIfEquivalence(isReflexive, isSymmetric, isTransitive) {
    var equivalenceParagraphElement = document.getElementById("equivalence-paragraph"); // Elemento para mostrar el resultado de equivalencia
    
    var panelEquivalence = document.querySelector(".panel-equivalence"); // Panel para mostrar los detalles de equivalencia

    // Verificar si la relación cumple con las propiedades de equivalencia
    var isAnEquivalenceRelation = isEquivalence(isReflexive, isSymmetric, isTransitive);
    
    if (!isAnEquivalenceRelation) {
        equivalenceParagraphElement.innerText = "No es una relación de equivalencia.";
        panelEquivalence.style.display = "none"; // Ocultar el panel si no es relación de equivalencia
        
        return;
    }  else {
        panelEquivalence.style.display = "block"; // Mostrar el panel si es relación de equivalencia
    }
    
    equivalenceParagraphElement.innerText = "Sí es una relación de equivalencia.";
    
    var equivalenceClassListElement = document.getElementById("equivalence-class-list");
    var equivalenceClassContainer = document.getElementById("equivalence-class-container");
    var equivalencePartitionsContainer = document.getElementById("equivalence-partitions-container");
    var equivalencePartitionsParagraphElement = document.getElementById("equivalence-partitions-paragraph");

    equivalenceClassContainer.style.display = 'block';
    equivalencePartitionsContainer.style.display = 'block';

    // Crear clases de equivalencia
    var partitions = []
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var equivalents = []
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                equivalents.push(nodes[j]); // Encontrar nodos equivalentes
            }
        }

        partitions.push(equivalents); // Agregar la clase de equivalencia

        var li = document.createElement("li");
        li.innerText = `[${nodes[i]}] = {${equivalents.toString()}}`; // Mostrar la clase de equivalencia

        equivalenceClassListElement.appendChild(li);
    }
    
    partitions = multiDimensionalUnique(partitions); // Eliminar clases duplicadas

    // Mostrar las particiones de la relación de equivalencia
    var partitionsStr = '';
    for (var i = 0; i < partitions.length; i++) {
        partitionsStr += `{${partitions[i].toString()}}, `;
    }
    partitionsStr = '{' + partitionsStr.substring(0, partitionsStr.length - 2) + '}';

    equivalencePartitionsParagraphElement.innerText = partitionsStr; // Mostrar las particiones
}

function verifyIfPartialOrder(isReflexive, isAntisymmetric, isTransitive) {
    var partialOrderParagraphElement = document.getElementById("partial-order-paragraph"); // Elemento para mostrar el resultado de orden parcial

    var panelPartialOrder = document.querySelector(".panel-partial-order"); // Panel para mostrar los detalles de orden parcial

    // Verificar si la relación cumple con las propiedades de orden parcial
    var isAPartialOrderRelation = isPartialOrder(isReflexive, isAntisymmetric, isTransitive);

    if (!isAPartialOrderRelation) {
        partialOrderParagraphElement.innerText = "No es un orden parcial.";
        panelPartialOrder.style.display = "none"; // Ocultar el panel si no es relación de orden parcial

        return;
    } else {
        panelPartialOrder.style.display = "block"; // Mostrar el panel si es relación de orden parcial
    }

    partialOrderParagraphElement.innerText = "Sí es un orden parcial."; 
    
    var networkCanvasDiv = document.getElementById("hasseDiagramCanvas");
    networkCanvasDiv.style.display = "block";

    // Construir el grafo para el diagrama de Hasse (simplificado)
    var rawHasseDiagramNodes = [];
    var rawHasseDiagramEdges = [];

    // Añadir nodos al diagrama de Hasse
    for (var i = 0; i < nodes.length; i++) {
        rawHasseDiagramNodes.push({id: i + 1, label: nodes[i]}); // Agrega los nodos con sus etiquetas (id y label)
    }

    // Crear las aristas (edges) del Diagrama de Hasse
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) { // Si hay una relación entre dos nodos
                var addEdge = true;

                // Eliminar las aristas transitivas (aquellas que se pueden inferir a partir de otras relaciones)
                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    if (i == k || j == k) { continue; } // Saltar el nodo si es el mismo

                    if (adjacencyMatrix[i][k] == 1 && adjacencyMatrix[k][j] == 1) {
                        addEdge = false; // Si existe una relación intermedia, no agregar la arista directa
                    }
                }

                // Si no es transitiva, añadir la arista al diagrama de Hasse
                if (addEdge && i != j) {
                    rawHasseDiagramEdges.push({from: i + 1, to: j + 1});
                }
            }
        }
    }

    // Crear conjuntos de nodos y aristas para el Diagrama de Hasse
    var hasseDiagramEdges = new vis.DataSet(rawHasseDiagramEdges);
    var hasseDiagramNodes = new vis.DataSet(rawHasseDiagramNodes);

    var data = {
        nodes: hasseDiagramNodes,
        edges: hasseDiagramEdges
    };

    var options = {
        interaction: {
            navigationButtons: true, // Permitir la navegación (interacción con el diagrama)
            keyboard: true, // Permitir interacción usando el teclado
        }
    };

    // Dibujar el Diagrama de Hasse dentro del contenedor usando vis.js
    var network = new vis.Network(networkCanvasDiv, data, options);

     // Verificar si es una retícula
    var isAdjMatrixALattice = isLattice(); 

    var isLatticeParagraph = document.createElement("p");
    if (!isAdjMatrixALattice) {
        isLatticeParagraph.innerText = "No es una retícula."; // Si no es una retícula, mostrar el mensaje
        partialOrderParagraphElement.parentElement.appendChild(isLatticeParagraph);
        
        return;
    }
    
    isLatticeParagraph.innerText = "Sí es una retícula."; // Si es una retícula, mostrar el mensaje
    partialOrderParagraphElement.parentElement.appendChild(isLatticeParagraph);
}

function isLattice() {
    // Recorrer la matriz de adyacencia para evaluar todas las combinaciones de nodos (i, j)
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            // Si los nodos (i, j) no están relacionados (no tienen valor 1 en la matriz)
            if (adjacencyMatrix[i][j] != 1) {
                lower_bounds = []; // Lista para almacenar los ínfimos (lower bounds) de los nodos i y j
                upper_bounds = []; // Lista para almacenar los supremos (upper bounds) de los nodos i y j

                // Buscar los ínfimos (lower bounds) y supremos (upper bounds)
                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    // Si k está relacionado con tanto i como j, es un ínfimo potencial
                    if (adjacencyMatrix[k][i] == 1 && adjacencyMatrix[k][j] == 1) {
                        lower_bounds.push(k); // Guardar el ínfimo en la lista
                    }
                    // Si tanto i como j están relacionados con k, es un supremo potencial
                    if (adjacencyMatrix[i][k] == 1 && adjacencyMatrix[j][k] == 1) {
                        upper_bounds.push(k) // Guardar el supremo en la lista
                    }
                }

                // Verificar si se encontró al menos un ínfimo
                var infimum_idx = -1;

                if (lower_bounds.length == 0) { return false; } // Si no hay ínfimos, no es una retícula
                // Buscar el ínfimo común a todos los lower bounds
                for (var l = 0; l < lower_bounds.length; l++) {
                    var infimum_candidate_idx = lower_bounds[l]; // Candidato a ínfimo
                    var isInfimum = true; // Asumimos que es un ínfimo

                    // Verificar si este candidato es mayor que todos los demás ínfimos
                    for (var m = 0; m < lower_bounds.length; m++) {
                        var lower_bound_idx = lower_bounds[m];
                        
                        // Si no es mayor o igual que todos los otros ínfimos, no es el ínfimo
                        if (adjacencyMatrix[lower_bound_idx][infimum_candidate_idx] != 1) {
                            isInfimum = false;
                            break;
                        }
                    }

                    // Si se encontró un ínfimo válido, guardar su índice
                    if (isInfimum) {
                        infimum_idx = infimum_candidate_idx;
                    }
                }
                if (infimum_idx == -1) { return false; } // Si no se encontró un ínfimo válido, no es una retícula

                // Verificar si se encontró al menos un supremo
                var supremum_idx = -1;

                if (upper_bounds.length == 0) { return false; } // Si no hay supremos, no es una retícula
                // Buscar el supremo común a todos los upper bounds
                for (var l = 0; l < upper_bounds.length; l++) {
                    var supremum_candidate_idx = upper_bounds[l];
                    var isSupremum = true; // Asumimos que es un supremo

                    // Verificar si este candidato es menor que todos los demás supremos
                    for (var m = 0; m < upper_bounds.length; m++) {
                        var upper_bound_idx = upper_bounds[m]

                        // Si no es menor o igual que todos los otros supremos, no es el supremo
                        if (adjacencyMatrix[supremum_candidate_idx][upper_bound_idx] != 1) {
                            isSupremum = false;
                            break;
                        }
                    }

                    // Si se encontró un supremo válido, guardar su índice
                    if (isSupremum) {
                        supremum_idx = supremum_candidate_idx;
                    }
                }
                if (supremum_idx == -1) { return false; } // Si no se encontró un supremo válido, no es una retícula
            }
        }
    }
    return true; // Si para todos los pares (i, j) se encuentran ínfimos y supremos, es una retícula
}

document.getElementById('submit-btn').addEventListener('click', function() {
    // Obtener los valores del input y textarea
    let nodes = document.getElementById('nodes-input').value;
    let edges = document.getElementById('edges-textarea').value;

    // Pasar los valores a los elementos <p>
    document.getElementById('nodes-result').textContent = `Nodos: ${nodes}`;
    document.getElementById('edges-result').textContent = `Pares ordenados: ${edges}`;
});
