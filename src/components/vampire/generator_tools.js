import { Clans, Predations, Skills, Specializations, ClansDisciplines, Disciplines, Powers, Origins } from './vampire_enum';
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

export async function cg_vampire_clan(...args) {
    var locked = args[2];
    var newCgObj = args[3];
    if (locked.length == 0) {
        var generatedValue = Clans[Math.floor(Math.random() * Object.keys(Clans).length)]['id'];
        newCgObj.clan = generatedValue;
    }
    return await newCgObj;
}

export async function cg_vampire_predation() {
    return await Predations[Math.floor(Math.random() * Object.keys(Predations).length)]
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

export async function cg_vampire_name_by_origin(origin) {
    const response = await axios.get(prefix + '/cg/v1/RandomName?origin=' + origin);
    return response.data["name"];
}

export async function cg_vampire_name() {
    const response = await axios.get(prefix + '/cg/v1/RandomName');
    return response.data["name"];
}

export async function cg_vampire_origin(...args) {
    let lockedElements = args[2];
    let newCgObj = args[3];
    let newName = "";
    let newOrigin = newCgObj.origin;
    let generateNewName = true;
    let generateOrigin = true;

    if (lockedElements.length == 2) {
        newName = lockedElements[1];
        generateNewName = false;
    }
    else if (lockedElements.length != 0 && lockedElements[0] != "checkbox") {
        newName = lockedElements[0];
        generateNewName = false;
    }

    if (lockedElements.length != 0 && lockedElements[0] == "checkbox") {
        generateOrigin = false;
    }

    if (generateOrigin) {
        newOrigin = Math.floor(Math.random() * Origins.length)
        newCgObj.origin = newOrigin;
    }

    console.log(newOrigin)

    if (generateNewName) {
        newName = await cg_vampire_name_by_origin(Origins[newCgObj.origin].name)
    }

    return await {
        'name': newName,
        'cgObj': newCgObj
    };
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
        case 0:
            points = ["2", "2", "1", "1", "1", "1", "1", "1", "1"];
            break;
        case 1:
            points = ["3", "3", "2", "2", "2", "1", "1", "1", "1"];
            break;
        case 2:
            points = ["4", "3", "3", "2", "2", "1", "1", "1", "1"];
            break;
        case 3:
            points = ["5", "5", "4", "4", "3", "3", "2", "2", "2"];
            break;
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

export async function cg_vampire_skills(...args) {
    let difficulty = args[1];
    let lockedSkills = args[2];
    let cgObj = args[3];
    let newSkills = cgObj['skills'];
    let skillList = [];
    let points = [];
    let maxSkills = 0;
    let maxSpecs = 0;

    switch (difficulty) {
        case 0:
            maxSkills = 8;
            maxSpecs = 0;
            points = ["2", "2", "2", "1", "1", "1", "1", "1"];
            break;
        case 1:
            maxSkills = 12;
            maxSpecs = 0;
            points = ["3", "3", "3", "2", "2", "2", "2", "1", "1", "1", "1", "1"];
            break;
        case 2:
            maxSkills = 14;
            maxSpecs = 1;
            points = ["4", "4", "3", "3", "3", "3", "2", "2", "2", "2", "1", "1", "1", "1"];
            break;
        case 3:
            maxSkills = 15;
            maxSpecs = 3;
            points = ["5", "4", "4", "4", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2"];
            break;
        case 4:
            maxSkills = 14;
            maxSpecs = 1;
            points = ["4", "4", "3", "3", "3", "2", "2", "2", "2", "1", "1", "1", "1", "1"];
            break;
        case 5:
            maxSkills = 15;
            maxSpecs = 3;
            points = ["5", "4", "4", "4", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2"];
            break;
        case 6:
            maxSkills = 22;
            maxSpecs = 5;
            points = ["5", "5", "4", "4", "4", "4", "4", "3", "3", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2", "2", "2"];
            break;
        case 7:
            maxSkills = 27;
            maxSpecs = 8;
            points = ["5", "5", "5", "5", "4", "4", "4", "4", "4", "4", "4", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "2", "2", "2", "2", "2", "2"];
            break;
    }

    maxSkills -= lockedSkills.length;

    for (var skill of Skills) {
        skillList.push(String(skill['id']));
    }

    // Removes all locked skills from generation
    for (var lockedSkill of lockedSkills) {
        if (skillList.includes(lockedSkill)) {
            let index = skillList.indexOf(lockedSkill);
            skillList.splice(index, 1);
        }
    }

    // Remove all locked and attributed points from generation 
    for (var lockedSkill of lockedSkills) {
        let value = newSkills[lockedSkill];
        let index = points.indexOf(value)
        if (index != -1)
            points.splice(index, 1);
    }

    // Randomly attributes all skills
    for (var i = 0; i < maxSkills; i++) {
        let skillToTarget = skillList[Math.floor(Math.random() * skillList.length)];
        let pointToAttribute = points[Math.floor(Math.random() * points.length)];
        newSkills[skillToTarget] = pointToAttribute;
        // Remove from lists
        let compIndex = skillList.indexOf(skillToTarget);
        skillList.splice(compIndex, 1);
        let pointIndex = points.indexOf(pointToAttribute);
        points.splice(pointIndex, 1);
    }

    cgObj["skills"] = newSkills;

    // Get skills that are allowed to have a spec
    let specsAvailableForSkill = []
    for (var skill of Object.keys(newSkills)) {
        if (parseInt(newSkills[skill]) > 0)
            // Push the skill as many times as it has points
            for (var skillLvl = 0; skillLvl < newSkills[skill]; skillLvl++) {
                specsAvailableForSkill.push(skill)
            }
    }

    var specializationsCopy = JSON.parse(
        JSON.stringify(Specializations),
    );
    var newSpecs = [];

    for (var i = 0; i < maxSpecs; i++) {
        var skill = specsAvailableForSkill[Math.floor(Math.random() * specsAvailableForSkill.length)];
        var spec = specializationsCopy[skill][Math.floor(Math.random() * specializationsCopy[skill].length)];
        newSpecs.push({
            'comp': parseInt(skill),
            "spec": spec
        });

        var indexComp = specsAvailableForSkill.indexOf(skill);
        specsAvailableForSkill.splice(indexComp, 1);
        var indexSpec = specializationsCopy[skill].indexOf(spec);
        specializationsCopy[skill].splice(indexSpec, 1);
    }

    cgObj['specs'] = newSpecs;

    console.log(cgObj);

    return await cgObj;
}

export async function cg_vampire_disciplines(...args) {
    let difficulty = args[1];
    let lockedDisciplines = args[2];
    let cgObj = args[3];
    let newDiscs = [];
    let clan = cgObj.clan;
    let allDisciplines = [...Disciplines]
    // Sorts disciplines in order to remove them effectively later
    let clanDisciplines = [...ClansDisciplines[clan]].sort(function (a, b) { return a - b });
    let powersLvl = []
    let startingDiscWeight = 6;
    let maxDiscs = 0;
    let allPowers = JSON.parse(
        JSON.stringify(Powers),
    );

    if (clanDisciplines.length == 0) {
        for (var i = 0; i < 3; i++) {
            let value = Math.floor(Math.random() * allDisciplines.length);
            allDisciplines.splice(value, 1)
            clanDisciplines.push(value)
        }
    }

    // Remove forced disciplines
    for (var i = 0; i < 3; i++) {
        allDisciplines.splice(clanDisciplines[i] - i, 1)
    }

    let loopLength = 0

    switch (difficulty) {
        case 4:
            maxDiscs = 2;
            powersLvl = [2, 1];
            // Remove 1 discipline
            clanDisciplines.splice(Math.floor(Math.random() * clanDisciplines.length), 1)
            break;
        case 5:
            maxDiscs = 3;
            powersLvl = [3, 2, 2];
            break;
        case 6:
            maxDiscs = 4;
            powersLvl = [4, 3, 2, 2];
            // Adds one discipline
            loopLength = clanDisciplines.length;
            for (var i = 0; i < startingDiscWeight; i++) {
                for (var ind = 0; ind < loopLength; ind++) {
                    clanDisciplines.push(clanDisciplines[ind])
                }
            }
            clanDisciplines.push(allDisciplines[Math.floor(Math.random() * allDisciplines.length)]["id"])
            break;
        case 7:
            maxDiscs = 6;
            powersLvl = [5, 4, 4, 3, 2, 2];
            loopLength = clanDisciplines.length;
            for (var i = 0; i < startingDiscWeight; i++) {
                for (var ind = 0; ind < loopLength; ind++) {
                    clanDisciplines.push(clanDisciplines[ind])
                }
            }
            // Adds two disciplines
            var index = Math.floor(Math.random() * allDisciplines.length);
            clanDisciplines.push(allDisciplines[index]["id"]);
            allDisciplines.splice(index, 1);
            index = Math.floor(Math.random() * allDisciplines.length)
            clanDisciplines.push(allDisciplines[index]["id"])
            allDisciplines.splice(index, 1);
            clanDisciplines.push(allDisciplines[Math.floor(Math.random() * allDisciplines.length)]["id"])
            break;
        default:
            maxDiscs = 1;
            powersLvl = [1];
            break;
    }

    console.log(clanDisciplines)
    let characterDisc = [...clanDisciplines];

    for (var i = 0; i < maxDiscs; i++) {
        var lvlInd = 0//Math.floor(Math.random() * powersLvl.length);
        var lvl = powersLvl[lvlInd];
        var discInd = Math.floor(Math.random() * clanDisciplines.length)
        var disc = clanDisciplines[discInd];
        powersLvl.splice(lvlInd, 1);
        clanDisciplines.splice(discInd, 1);
        clanDisciplines = clanDisciplines.filter(a => a != disc);

        newDiscs.push({
            id: disc,
            level: lvl,
            name: Disciplines[disc]['name'],
            powers: ["", "", "", "", ""]
        });
    }

    var availablePowers = {};
    for (var disc of newDiscs) {
        availablePowers[disc.id] = allPowers[disc.id];
    }

    var waitingForPre = []

    // First we check if any discipline lvl will grant us future powers
    for (var disc of newDiscs) {
        for (var amalgame of allPowers[disc.id]["amalgames"]) {
            if (disc.level >= amalgame.level) {
                if (characterDisc.includes(amalgame.disc)) {
                    if (Object.keys(amalgame).includes("need")) {
                        waitingForPre.push(amalgame.need);
                    }
                    else {
                        availablePowers[amalgame.disc][amalgame.power_level].push(amalgame.name)
                    }
                }
            }
        }
    }

    console.log(availablePowers);

    // Attributions powers to disciplines, lvl by lvl
    for (var discLvl = 1; discLvl < 6; discLvl++) {
        for (var disc of newDiscs) {
            if (disc.level >= discLvl) {
                var powersAtLvl = availablePowers[disc.id][discLvl];
                var powerInd = Math.floor(Math.random() * powersAtLvl.length);
                var powerName = availablePowers[disc.id][discLvl][powerInd]
                disc.powers[discLvl - 1] = powerName;
                availablePowers[disc.id][discLvl].splice(powerInd, 1);
                for (var pre of allPowers[disc.id]["prerequisites"]) {
                    if (pre.need == powerName) {
                        if (Object.keys(amalgame).includes("amalgame") && waitingForPre.includes(powerName)) {
                            availablePowers[disc.id][pre.power_level].push(pre.name)
                        }
                        else {
                            availablePowers[disc.id][pre.power_level].push(pre.name)
                        }
                    }
                }
            }
        }
    }

    cgObj.disciplines = newDiscs;

    return await cgObj;
}