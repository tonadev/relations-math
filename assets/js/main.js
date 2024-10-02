var modal = document.getElementById("input-modal");
var closeModalBtn = document.getElementById("close-button");

var alertElement = document.getElementsByClassName("alert")[0];
var alertTextMessageElement = document.getElementById("alert-message");

var nodesTextInput = document.getElementById("nodes-input");
var edgesTextArea = document.getElementById("edges-textarea");

var nodes = [];
var adjacencyMatrix = [];

function isReflexive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        if (adjacencyMatrix[i][i] != 1) {
            return false;
        }
    }
    return true;
}

function isIrreflexive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        if (adjacencyMatrix[i][i] == 1) {
            return false;
        }
    }
    return true;
}

function isSymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                if (adjacencyMatrix[j][i] != 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isAsymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                if (adjacencyMatrix[j][i] == 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isAntisymmetric(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1 && adjacencyMatrix[j][i] == 1 &&  i != j ) {
                return false;
            }
        }
    }
    return true;
}

function isTransitive(adjacencyMatrix) {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    if (adjacencyMatrix[j][k] == 1 && adjacencyMatrix[i][k] != 1) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function isPartialOrder(isReflexive, isAntisymmetric, isTransitive) {
    return isReflexive && isAntisymmetric && isTransitive;
}

function isEquivalence(isReflexive, isSymmetric, isTransitive) {
    return isReflexive && isSymmetric && isTransitive;
}

function check() {
    alertElement.style.display = "none";

    nodes = [];
    adjacencyMatrix = [];

    var rawNodes = nodesTextInput.value.replace(/\s/g, "");

    if (!rawNodes) {
        alertTextMessageElement.innerText = "[ERROR] El conjunto vacío no está permitido.";

        alertElement.style.display = "block";

        return;
    }

    nodes = rawNodes.split(",");

    for (var i = 0; i < nodes.length; i++) {
        var row = [];

        for (var j = 0; j < nodes.length; j++) {
            row.push(0);
        }

        adjacencyMatrix.push(row);
    }

    var rawEdges = edgesTextArea.value.replace(/\s/g, "");

    var edges = rawEdges.split((/[()]+,*/)).filter(function(e) { return e });
    
    for (let edge of edges) {
        var pair = edge.split(",");

        if (pair.length != 2) {
            alertTextMessageElement.innerText = `[ERROR] El par ordenado (${edge}) no cuenta con el formato adecuado.`;

            alertElement.style.display = "block";            

            return;
        }

        var from = pair[0];
        var to = pair[1];

        var row = nodes.indexOf(from);
        var column = nodes.indexOf(to);

        if (row == -1 || column == -1) {
            alertTextMessageElement.innerText = `[ERROR] El par ordenado (${edge}) tiene un elemento que no se encuentra en A.`;

            alertElement.style.display = "block";            

            return;
        }

        adjacencyMatrix[row][column] = 1;
    }  

    modal.style.display = "none";

    verifyProperties();

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

function verifyProperties() {
    var isAdjMatrixReflexive = isReflexive(adjacencyMatrix);
    if (isAdjMatrixReflexive) {
        var isReflexiveListItem = document.getElementById("isReflexive");
        document.getElementById("isReflexive").style.color = "green";
        isReflexiveListItem.classList.add("checked");
    } else {
        document.getElementById("isReflexive").style.color = "red";
    }

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

    
    drawGraphAndMatrix();
    verifyIfEquivalence(isAdjMatrixReflexive, isAdjMatrixSymmetric, isAdjMatrixTransitive);
    verifyIfPartialOrder(isAdjMatrixReflexive, isAdjMatrixAntisymmetric, isAdjMatrixTransitive);
}

function drawGraphAndMatrix() {
    var graphRawNodes = [];
    var graphRawEdges = [];

    var adjacencyMatrixTableElement = document.getElementById("adjacencyMatrixTable");

    var headers = document.getElementById("adjacencyMatrixTableHeaders");
    headers.appendChild(document.createElement("th"));
    
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var th = document.createElement("th");
        
        th.innerText = nodes[i];
        headers.appendChild(th);

        graphRawNodes.push({id: i + 1, label: nodes[i]});
    }

    var tbody = adjacencyMatrixTableElement.getElementsByTagName("tbody")[0];
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var tr = document.createElement("tr");

        var node = document.createElement("th")
        node.innerText = nodes[i];

        tr.appendChild(node);
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            var td = document.createElement("td");

            td.innerText = adjacencyMatrix[i][j];
            tr.appendChild(td);

            if (adjacencyMatrix[i][j] == 1) {
                graphRawEdges.push({from: i + 1, to: j + 1});
            }
        }

        tbody.appendChild(tr);
    }

    var graphNodes = new vis.DataSet(graphRawNodes);
    var graphEdges = new vis.DataSet(graphRawEdges);

    var container = document.getElementById('graph-canvas');

    var data = {
        nodes: graphNodes,
        edges: graphEdges
    };

    var options = {
        edges: {
            arrows: {
                to: {
                    enabled: true
                }
            }
        },
        interaction: {
            navigationButtons: true,
            keyboard: true,
        },
    };

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
    var equivalenceParagraphElement = document.getElementById("equivalence-paragraph");
    
    var panelEquivalence = document.querySelector(".panel-equivalence");

    var isAnEquivalenceRelation = isEquivalence(isReflexive, isSymmetric, isTransitive);
    
    if (!isAnEquivalenceRelation) {
        equivalenceParagraphElement.innerText = "No es una relación de equivalencia.";
        panelEquivalence.style.display = "none";
        
        return;
    }  else {
        panelEquivalence.style.display = "block";
    }
    
    equivalenceParagraphElement.innerText = "Sí es una relación de equivalencia.";
    
    var equivalenceClassListElement = document.getElementById("equivalence-class-list");
    var equivalenceClassContainer = document.getElementById("equivalence-class-container");
    var equivalencePartitionsContainer = document.getElementById("equivalence-partitions-container");
    var equivalencePartitionsParagraphElement = document.getElementById("equivalence-partitions-paragraph");

    equivalenceClassContainer.style.display = 'block';
    equivalencePartitionsContainer.style.display = 'block';

    var partitions = []
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        var equivalents = []
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                equivalents.push(nodes[j]);
            }
        }

        partitions.push(equivalents);

        var li = document.createElement("li");
        li.innerText = `[${nodes[i]}] = {${equivalents.toString()}}`;

        equivalenceClassListElement.appendChild(li);
    }
    
    partitions = multiDimensionalUnique(partitions);

    var partitionsStr = '';
    for (var i = 0; i < partitions.length; i++) {
        partitionsStr += `{${partitions[i].toString()}}, `;
    }
    partitionsStr = '{' + partitionsStr.substring(0, partitionsStr.length - 2) + '}';

    equivalencePartitionsParagraphElement.innerText = partitionsStr;
}

function verifyIfPartialOrder(isReflexive, isAntisymmetric, isTransitive) {
    var partialOrderParagraphElement = document.getElementById("partial-order-paragraph");

    var panelPartialOrder = document.querySelector(".panel-partial-order");

    var isAPartialOrderRelation = isPartialOrder(isReflexive, isAntisymmetric, isTransitive);

    if (!isAPartialOrderRelation) {
        partialOrderParagraphElement.innerText = "No es un orden parcial.";
        panelPartialOrder.style.display = "none";

        return;
    } else {
        panelPartialOrder.style.display = "block";
    }

    partialOrderParagraphElement.innerText = "Sí es un orden parcial.";
    
    var networkCanvasDiv = document.getElementById("hasseDiagramCanvas");
    networkCanvasDiv.style.display = "block";

    var rawHasseDiagramNodes = [];
    var rawHasseDiagramEdges = [];

    for (var i = 0; i < nodes.length; i++) {
        rawHasseDiagramNodes.push({id: i + 1, label: nodes[i]});
    }

    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] == 1) {
                var addEdge = true;

                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    if (i == k || j == k) { continue; }

                    if (adjacencyMatrix[i][k] == 1 && adjacencyMatrix[k][j] == 1) {
                        addEdge = false;
                    }
                }

                if (addEdge && i != j) {
                    rawHasseDiagramEdges.push({from: i + 1, to: j + 1});
                }
            }
        }
    }

    var hasseDiagramEdges = new vis.DataSet(rawHasseDiagramEdges);
    var hasseDiagramNodes = new vis.DataSet(rawHasseDiagramNodes);

    var data = {
        nodes: hasseDiagramNodes,
        edges: hasseDiagramEdges
    };

    var options = {
        interaction: {
            navigationButtons: true,
            keyboard: true,
        }
    };

    var network = new vis.Network(networkCanvasDiv, data, options);


    var isAdjMatrixALattice = isLattice();

    var isLatticeParagraph = document.createElement("p");
    if (!isAdjMatrixALattice) {
        isLatticeParagraph.innerText = "No es una retícula.";
        partialOrderParagraphElement.parentElement.appendChild(isLatticeParagraph);
        
        return;
    }
    
    isLatticeParagraph.innerText = "Sí es una retícula.";
    partialOrderParagraphElement.parentElement.appendChild(isLatticeParagraph);
}

function isLattice() {
    for (var i = 0; i < adjacencyMatrix.length; i++) {
        for (var j = 0; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] != 1) {
                lower_bounds = [];
                upper_bounds = [];

                for (var k = 0; k < adjacencyMatrix.length; k++) {
                    if (adjacencyMatrix[k][i] == 1 && adjacencyMatrix[k][j] == 1) {
                        lower_bounds.push(k);
                    }
                    if (adjacencyMatrix[i][k] == 1 && adjacencyMatrix[j][k] == 1) {
                        upper_bounds.push(k)
                    }
                }


                var infimum_idx = -1;

                if (lower_bounds.length == 0) { return false; }
                for (var l = 0; l < lower_bounds.length; l++) {
                    var infimum_candidate_idx = lower_bounds[l];
                    var isInfimum = true;

                    for (var m = 0; m < lower_bounds.length; m++) {
                        var lower_bound_idx = lower_bounds[m];
                        
                        if (adjacencyMatrix[lower_bound_idx][infimum_candidate_idx] != 1) {
                            isInfimum = false;
                            break;
                        }
                    }

                    if (isInfimum) {
                        infimum_idx = infimum_candidate_idx;
                    }
                }
                if (infimum_idx == -1) { return false; }

                var supremum_idx = -1;

                if (upper_bounds.length == 0) { return false; }
                for (var l = 0; l < upper_bounds.length; l++) {
                    var supremum_candidate_idx = upper_bounds[l];
                    var isSupremum = true;

                    for (var m = 0; m < upper_bounds.length; m++) {
                        var upper_bound_idx = upper_bounds[m]

                        if (adjacencyMatrix[supremum_candidate_idx][upper_bound_idx] != 1) {
                            isSupremum = false;
                            break;
                        }
                    }

                    if (isSupremum) {
                        supremum_idx = supremum_candidate_idx;
                    }
                }
                if (supremum_idx == -1) { return false; }

            }
        }
    }
    return true;
}

document.getElementById('submit-btn').addEventListener('click', function() {
    // Obtener los valores del input y textarea
    let nodes = document.getElementById('nodes-input').value;
    let edges = document.getElementById('edges-textarea').value;

    // Pasar los valores a los elementos <p>
    document.getElementById('nodes-result').textContent = `Nodos: ${nodes}`;
    document.getElementById('edges-result').textContent = `Pares ordenados: ${edges}`;
});
