const symbolsDictionary = {
    "conditional": ["então", "→"],
    "bi-conditional": ["se e somente se", "↔"],
    "denial": ["não", "∼"],
    "conjuction": ["e", "^"],
    "disjunction": ["ou", "v"],
    "ifToExclude": ["se", ""]
};
const symbols = ["^", "v", "→", "↔", "(", ")"];

let propositionLetters = "pqrst";
let propositionsDictionary = {};

function evaluateExpression(expression){
    let propositionsList = [];
    let element = "";

    expression = replaceSymbols(expression);
    
    for (let i = 0; i < expression.length; i++) {
        let char = expression.charAt(i);
        if(isSymbol(char)) {
            if(element)
                propositionsList.push(element.trim());
            propositionsList.push(char.trim());
            element = "";
        }
        else if(i == expression.length - 1){
            element += char;
            propositionsList.push(element.trim());
            element = "";
        }
        else{
            element += char
        }
    }

    propositionsList = propositionsList.filter(proposition => proposition != '');
    propositionsList.forEach(proposition => {
        if(!isSymbol(proposition)){
            if(proposition.includes('∼'))
                propositionsDictionary[proposition] = ['∼' + propositionLetters[0]];
            else
                propositionsDictionary[proposition] = [propositionLetters[0]];
            propositionLetters = propositionLetters.slice(1);
        }
    })

    for (const [key, value] of Object.entries(propositionsDictionary)){
        let truthValue = prompt(`Qual o valor verdade da proposição ${key}?`)
        if(truthValue.toLowerCase() == "verdade" || truthValue.toLowerCase() == "v"){
            truthValue = true
        }
        else
            truthValue = false
        
        if(propositionsDictionary[key][0].includes('∼'))
            propositionsDictionary[key].push(!truthValue);
        else
            propositionsDictionary[key].push(truthValue);
    }

    for (let i = 0; i < propositionsList.length; i++) {
        if (propositionsList[i] == '('){
            let auxList = propositionsList.slice(i+1, propositionsList.indexOf(')'));
            auxList = evaluateFirstPrecedence(auxList)
            auxList = evaluateSecondPrecedence(auxList)
            propositionsList[i] = auxList[0];
            propositionsList.splice(i+1, propositionsList.indexOf(')'));
        }
    }
    
    propositionsList = evaluateFirstPrecedence(propositionsList);
    propositionsList = evaluateSecondPrecedence(propositionsList);

    document.getElementById("result").innerHTML = propositionsList[0];
    propositionsDictionary = {};
    propositionLetters = "pqrst";
    return propositionsList[0];
}


function isSymbol(char){
    return symbols.includes(char);
}

function replaceSymbols(expression){
    for (const [key, value] of Object.entries(symbolsDictionary)) {
        let regExp = new RegExp(`\\b${value[0]}\\b`, "gi")
        expression = expression.replace(regExp, value[1]);
    }
    return expression;
}

function replacePropositions(expression, dictionary){
    for (const [key, value] of Object.entries(dictionary)){
        expression = expression.replace(key, value) 
    }
    return expression;
}

function getPrecedences(expression){
    let propositionsPrecedence = [];
    let auxString = "";
    let inParenthesis = false;

    for (let i = 0; i < expression.length; i++){
        
        if(expression[i] == '(')
            inParenthesis = true;
        else if(expression[i] == ')'){
            propositionsPrecedence.push(auxString);
            auxString = "";
            inParenthesis = false;
        }
        
        if (inParenthesis && expression[i] != '('){
            auxString += expression[i];
        }
    }

    return propositionsPrecedence;
}

function evaluateFirstPrecedence(list){
    for (let i = 0; i < list.length; i++){
        if(list[i] == symbols[0])
            list = evaluateAnd(list);
        else if(list[i] == symbols[1])
            list = evaluateOr(list);
    }

    return list;
}

function evaluateSecondPrecedence(list){
    for (let i = 0; i < list.length; i++){
        if(list[i] == symbols[2])
            list = evaluateConditional(list);
        else if(list[i] == symbols[3])
            list = evaluateBiConditional(list);
    }

    return list;
}

function evaluateAnd(list){
    let andIndex = list.indexOf(symbols[0]);
    let firstValue = getBooleanValue(list, andIndex-1); 
    let secondValue = getBooleanValue(list, andIndex+1);

    let comparison =  firstValue && secondValue;
    list[andIndex -1] = comparison;
    list.splice(andIndex, 2);

    return list;
}

function evaluateOr(list){
    let orIndex = list.indexOf(symbols[1]);
    let firstValue = getBooleanValue(list, orIndex-1); 
    let secondValue = getBooleanValue(list, orIndex+1);
    
    let comparison = firstValue || secondValue;
    list[orIndex -1] = comparison;
    list.splice(orIndex, 2);

    return list;
}

function evaluateConditional(list){
    let ifIndex = list.indexOf(symbols[2]);
    let firstValue = getBooleanValue(list, ifIndex-1);
    let secondValue = getBooleanValue(list, ifIndex+1);
    let comparison;

    if (firstValue == true && secondValue == false)
        comparison = false;
    else
        comparison = true;
    list[ifIndex - 1] = comparison;
    list.splice(ifIndex, 2);

    return list;
}

function evaluateBiConditional(list){
    let biIfIndex = list.indexOf(symbols[2]);
    let firstValue = getBooleanValue(list, biIfIndex-1); 
    let secondValue = getBooleanValue(list, biIfIndex+1);

    let comparison;
    if (firstValue == secondValue)
        comparison = true;
    else
        comparison = false;

    list[biIfIndex -1] = comparison;
    list.splice(biIfIndex, 2);

    return list;
}

function getBooleanValue(list, index){
    let value;
    if(typeof(list[index]) == "boolean")
        value = list[index]
    else
        value = propositionsDictionary[list[index]][1]

    if(typeof(list[index]) == "boolean")
        value = list[index]
    else
        value = propositionsDictionary[list[index]][1]

    return value;
}