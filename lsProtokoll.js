/*
Script för sortering av data och dynamisk visning i html template för LS-Protokoll i Mobigo.

© Yuevia AB 2026-10-24

Version 1 - Sonny Andersson
*/ 

function returnSubPoint(list, name) {
    let value = "";
    
    list.forEach(l => {
        if (l.Name === name) {
            value = (l.Value === "1") ? " &#9745;" : " &#9744;";
        }
    });
    
    return value;
}

function getStatusCheckboxes(point){          //
    if (!point || !point.SubPoints) {
        return "";
    }

    const list = point.Subpoints;
    let result =  "";

    const options = [
        "Kontroll",
        "Justering",
        "Godkänt",
        "Ej Applicerbart",
        "Fel"
    ];

    options.forEach(optionName => {
        result += returnSubPoint(list, optionName);
    });

    return result;
}