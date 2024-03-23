import { Clans, Predations, Skills, Specializations } from './vampire_enum';
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


    return await cgObj;
}