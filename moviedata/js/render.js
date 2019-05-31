(function(){
    "use strict";

    var columnMeta = {
        gross: {
            formatter: formatCurrency,
            styleClass: "text-right text-capitalize"
        },
        tickets: {
            formatter: formatNumber,
            styleClass: "text-right text-capitalize"
        },
        released: {
            formatter: formatDate,
            styleClass: "text-right text-capitalize"
        }
    }

    function formatCurrency(val) {
        return numeral(val).format("$0,0[.]00");
    }
    
    function formatNumber(val) {
        return numeral(val).format("0,0[.]00");
    }
    
    function formatDate(val) {
        return moment(val).format("ll");
    }
        
    function renderValue(elementType, value, styleClass) {
        var elem = document.createElement(elementType);
        elem.textContent = value;
        if (styleClass) {
            elem.className = styleClass;
        }
        return elem;
    }
    
    function renderError(err) {
        return renderValue("p", err.message, "text-danger");
    }
    
    function renderRow(obj) {
        var tr = document.createElement("tr");
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            var meta = columnMeta[key] || {};
            if (meta.formatter) {
                val = meta.formatter(val);
            }
            tr.appendChild(renderValue("td", val, meta.styleClass));
        });
        return tr;
    }

    function renderHeaders(obj) {
        var tr = document.createElement("tr");
        Object.keys(obj).forEach(function(key) {
            var meta = columnMeta[key] || {styleClass: "text-capitalize"};
            tr.appendChild(renderValue("th", key, meta.styleClass));
        });
        return tr;
    }

    function renderTable(objArray) {
        var table = document.createElement("table");
        //to get nice Bootstrap table formatting
        table.classList.add("table");
        var thead = table.appendChild(document.createElement("thead"));
        thead.appendChild(renderHeaders(objArray[0]))
        var tbody = table.appendChild(document.createElement("tbody"));
        objArray.forEach(function(obj) {
            tbody.appendChild(renderRow(obj));
        });
        return table;
    }

    function renderList(valArray) {
        var ul = document.createElement("ul");
        valArray.forEach(function(val) {
            var li = ul.appendChild(document.createElement("li"));
            li.textContent = val;
        });
        return ul;
    }
    
    function renderResults(results) {
        //check for null or undefined and report an error
        if (null === results || undefined === results) {
            throw new Error("your function must return a value, an object, or an array objects; you returned null or undefined")
        }
    
        var nodes;
        if (Array.isArray(results)) {
            if (results.length === 0) {
                throw new Error("your function returned a zero-length array");
            }
            if (typeof results[0] === "object") {
                return renderTable(results)
            } else {
                return renderList(results)
            }
        } else if (typeof results === "object") {
            return renderTable([results]);
        } else {
            //simple value
            if (Number.isInteger(results)) {
                results = formatNumber(results);
            }
            return renderValue("p", results);
        }
    }
    
    var reportNameElem = document.querySelector("#report-name");
    var resultsElem = document.querySelector("#results");
    var questionElems = document.querySelectorAll(".report")
    questionElems.forEach(function(qElem) {
        qElem.addEventListener("click", function() {
            //clear the previous results
            resultsElem.textContent = "";
            try {
                var funcName = qElem.getAttribute("data-func");
                if (!funcName) {
                    throw new Error("question element is missing the data-func attribute")
                }
                if (!window.hasOwnProperty(funcName)) {
                    throw new Error("the function " + funcName + "() is not defined");
                }
                var results = window[funcName](MOVIES);
                var renderedNodes = renderResults(results);
                resultsElem.appendChild(renderedNodes);
                reportNameElem.textContent = qElem.textContent;
            } catch(err) {
                resultsElem.appendChild(renderError(err));
                console.error("these results caused an error:", results);
            }
            //make this the active one
            questionElems.forEach(function(elem) {
                elem.classList.remove("active");
            });
            qElem.classList.add("active");
        });
    });    
}());

function _allMovies(moviesArray) {return moviesArray}