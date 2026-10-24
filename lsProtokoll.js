/*
Script för sortering av data och dynamisk visning i html template för LS-Protokoll i Mobigo.

© Yuevia AB 2026-10-24

Version 1 - Sonny Andersson
*/ 

function returnSubPoint(list, name) {       //Skapar tomma checkrutor vid värde === 0; annars ifylld checkruta vid värde === 1;
    let value = "";
    
    list.forEach(l => {
        if (l.Name === name) {
            value = (l.Value === "1") ? " &#9745;" : " &#9744;";
        }
    });
    
    return value;
}

function getStatusCheckboxes(point){          //Skapar checkrutorna med hjälp av returnSubPoint()
    if (!point || !point.SubPoints) {
        return "";
    }

    const list = point.SubPoints;
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

function getPointStatus(point) {
    // Failsafe för att inte krascha PDF-generatorn
    if (!point || !point.SubPoints) {        
        return [];
    }

    const list = point.SubPoints;
    
    const targetValues = [
        "Laddspänning",
        "Nätspänning",
    ];

    let isChecked = false;

    list.forEach(item => {
        if (targetValues.includes(item.Name) && item.Value === "1") {
            isChecked = true;
        }
    });

    return isChecked ? ["1"] : [];
}

const testPoint = {
    SubPoints: [
        { Name: "Laddspänning", Value: "1" },
        { Name: "Nätspänning", Value: "0" },
        { Name: "1 min", Value: "1" }
    ]
};

function checkDischargeTest(section) {
    if (!section || !section.Points) {
        return false;
    }
    
    let isSelected = false;
    
    const targetValues = [
        "1 min", 
        "5 min", 
        "10 min", 
        "15 min"
    ];

    section.Points.forEach(point => {
        if (point.SubPoints) {
            point.SubPoints.forEach(sub => {
                if (targetValues.includes(sub.Name) && sub.Value === "1") {
                    isSelected = true;
                }
            });
        }
    });
    
    return isSelected;
}

function isDischargeTestSelected(section) {
    return checkDischargeTest(section) ? ["1"] : [];
}

function isDischargeTestNotSelected(section) {
    return !checkDischargeTest(section) ? ["1"] : [];
}

function getAllNotes(document) {
    if (!document || !document.Sections) {
        return [];
    }

    const notes = [];
    const sectionsToScan = [
        { index: 0, label: "Kontrollschema" },
        { index: 1, label: "Urladdningsprov" },
        { index: 2, label: "Efter prov" }
    ];

    sectionsToScan.forEach(sec => {
        const section = document.Sections[sec.index];
        if (section && section.Points) {
            section.Points.forEach(point => {
                if (point.Note && point.Note.length > 0) {
                    notes.push([sec.label, point.Name, point.Note]);
                }
            });
        }
    });

    return notes;
}

return {
    getPointStatus,
    isDischargeTestNotSelected,
    isDischargeTestSelected,
    getAllNotes
}