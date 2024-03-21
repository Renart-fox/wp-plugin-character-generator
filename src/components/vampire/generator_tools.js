import { Clan, Predation, Specializations } from './vampire_enum';
import axios from 'axios';
const prefix = window.location.href.includes('localhost') ? '/wordpress/wp-json' : '/wp-json';

export async function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return await context[func].apply(context, args);
}

export async function cg_vampire_clan() {
    return await Clan[Math.floor(Math.random() * Object.keys(Clan).length)]
}

export async function cg_vampire_predation() {
    return await Predation[Math.floor(Math.random() * Object.keys(Predation).length)]
}

export async function cg_vampire_generation(...args) {
    let difficulty = args[1];
    let min = 4;
    let max = 0;
    switch (difficulty) {
        // Between 12 & 13
        case 4:
            min = 12;
            max = 2;
            break;
        // 11
        case 5:
            min = 11;
            break;
        // 10
        case 6:
            min = 10;
            break;
        // Between 6 & 9
        case 7:
            min = 6;
            max = 4;
            break;
    }
    return await min + Math.floor(Math.random() * max) + ""
}

export async function cg_vampire_sire() {
    return await cg_vampire_name();
}

export async function cg_vampire_name() {
    const response = await axios.get(prefix + '/cg/v1/RandomName?system=3');
    return response.data["name"];
}

export async function cg_vampire_blood(...args) {
    let difficulty = args[1];
    let blood = 0
    switch (difficulty) {
        case 4:
            blood = "1";
            break;
        case 5:
            blood = "3";
            break;
        case 6:
            blood = "4";
            break;
        case 7:
            blood = "6";
            break;
    }
    return await blood;
}

export async function cg_vampire_attributes(...args) {
    let difficulty = args[1];
    let lockedAttributes = args[2];
    let newCgObj = args[3];
    let newAttributes = newCgObj['attributes'];
    let attributesList = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'composure', 'intelligence', 'cunning', 'resolve'];
    let points = [];
    switch (difficulty) {
        case 4:
            points = ["4", "3", "3", "2", "2", "1", "1", "1", "1"];
            break;
        case 5:
            points = ["5", "5", "4", "4", "3", "3", "2", "2", "2"];
            break;
        case 6:
            points = ["5", "5", "5", "4", "4", "4", "3", "3", "3"];
            break;
        case 7:
            points = ["5", "5", "5", "5", "4", "4", "4", "4", "3"];
            break;
    }
    for (var lockedAttribute of lockedAttributes) {
        if (attributesList.includes(lockedAttribute)) {
            let index = attributesList.indexOf(lockedAttribute);
            attributesList.splice(index, 1);
        }
    }

    for (var lockedAttr of lockedAttributes) {
        let value = newAttributes[lockedAttr];
        let index = points.indexOf(value)
        if (index != -1)
            points.splice(index, 1);
    }

    let startingSize = attributesList.length;
    for (var i = 0; i < startingSize; i++) {
        let attributeToTarget = attributesList[Math.floor(Math.random() * attributesList.length)];
        let pointToAttribute = points[Math.floor(Math.random() * points.length)];
        newAttributes[attributeToTarget] = pointToAttribute;
        // Remove from lists
        let attrIndex = attributesList.indexOf(attributeToTarget);
        attributesList.splice(attrIndex, 1);
        let pointIndex = points.indexOf(pointToAttribute);
        points.splice(pointIndex, 1);
    }

    newCgObj['attributes'] = newAttributes;
    return await newCgObj;
}

export async function cg_vampire_comps(...args) {
    let difficulty = args[1];
    let lockedComps = args[2];
    let cgObj = args[3];
    let newComps = cgObj['comps']
    let compList = [
        'gun',
        'animals',
        'erudition',
        'craft',
        'command',
        'finance',
        'athletism',
        'empathy',
        'investigation',
        'brawl',
        'etiquette',
        'medicine',
        'drive',
        'night',
        'occult',
        'stealth',
        'intimidation',
        'politic',
        'sleight',
        'representation',
        'science',
        'melee',
        'persuasion',
        'tech',
        'survival',
        'subterfuge',
        'vigilance',
    ];
    let points = [];
    let maxComps = 0;
    let specs = 0;

    switch (difficulty) {
        case 4:
            maxComps = 14;
            specs = 1;
            points = ["4", "4", "3", "3", "3", "2", "2", "2", "2", "1", "1", "1", "1", "1"];
            break;
        case 5:
            maxComps = 15;
            specs = 3;
            points = ["5", "4", "4", "4", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2"];
            break;
        case 6:
            maxComps = 22;
            specs = 5;
            points = ["5", "5", "4", "4", "4", "4", "4", "3", "3", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2", "2", "2"];
            break;
        case 7:
            maxComps = 27;
            specs = 8;
            points = ["5", "5", "5", "5", "4", "4", "4", "4", "4", "4", "4", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2"];
            break;
    }

    maxComps -= lockedComps.length;

    for (var lockedComp of lockedComps) {
        if (compList.includes(lockedComp)) {
            let index = compList.indexOf(lockedComp);
            compList.splice(index, 1);
        }
    }

    for (var lockedComp of lockedComps) {
        let value = newComps[lockedComp];
        let index = points.indexOf(value)
        if (index != -1)
            points.splice(index, 1);
    }

    for (var i = 0; i < maxComps; i++) {
        let compToTarget = compList[Math.floor(Math.random() * compList.length)];
        let pointToAttribute = points[Math.floor(Math.random() * points.length)];
        newComps[compToTarget] = pointToAttribute;
        // Remove from lists
        let compIndex = compList.indexOf(compToTarget);
        compList.splice(compIndex, 1);
        let pointIndex = points.indexOf(pointToAttribute);
        points.splice(pointIndex, 1);
    }

    cgObj["comps"] = newComps;

    let specsAvailableForComp = []
    for (var comp of Object.keys(newComps)) {
        if (parseInt(newComps[comp]) > 0)
            specsAvailableForComp.push(comp)
    }

    var specializationsCopy = JSON.parse(
        JSON.stringify(Specializations),
    );
    console.log(specsAvailableForComp);
    var newSpecs = [];

    for (var i = 0; i < specs; i++) {
        var comp = specsAvailableForComp[Math.floor(Math.random() * specsAvailableForComp.length)];
        var spec = specializationsCopy[comp][Math.floor(Math.random() * specializationsCopy[comp].length)];
        newSpecs.push({
            'Comp': comp,
            "Spec": spec
        });

        var indexComp = specsAvailableForComp.indexOf(comp);
        specsAvailableForComp.splice(indexComp, 1);
        var indexSpec = specializationsCopy[comp].indexOf(spec);
        specializationsCopy[comp].splice(indexSpec, 1);
    }

    cgObj['specs'] = newSpecs;

    return await cgObj;
}