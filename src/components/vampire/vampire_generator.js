const { Component, render } = wp.element;

import { useState, useEffect } from 'react';

import { Clan, Predation } from './vampire_enum';

import { Grid, TextField, MenuItem } from '@mui/material';
import CgCheckbox from '../checkbox/cg_checkbox';
import * as cgUtils from './generator_tools'
import axios from 'axios';

const prefix = window.location.href.includes('localhost') ? '/wordpress/wp-json' : '/wp-json';

export default function VampireGenerator({ signal, update, startingCgObj }) {

    const [cgObj, setCgObj] = React.useState({
        'type': 1,
        'predation': "",
        'clan': "",
        'sire': "",
        'generation': "",
        'difficulty': 0,
        'blood': "",
        'attributes': {
            'strength': 0,
            'dexterity': 0,
            'stamina': 0,
            'charisma': 0,
            'manipulation': 0,
            'composure': 0,
            'intelligence': 0,
            'cunning': 0,
            'resolve': 0
        },
        'comps': {
            'gun': "0",
            'animals': "0",
            'erudition': "0",
            'craft': "0",
            'command': "0",
            'finance': "0",
            'athletism': "0",
            'empathy': "0",
            'investigation': "0",
            'brawl': "0",
            'etiquette': "0",
            'medicine': "0",
            'drive': "0",
            'night': "0",
            'occult': "0",
            'stealth': "0",
            'intimidation': "0",
            'politic': "0",
            'sleight': "0",
            'representation': "0",
            'science': "0",
            'melee': "0",
            'persuasion': "0",
            'tech': "0",
            'survival': "0",
            'subterfuge': "0",
            'vigilance': "0",
        }
    })

    const [setup, setSetup] = React.useState(false);

    const charTypes = [
        {
            id: 0,
            type: 'Mortel'
        },
        {
            id: 1,
            type: 'Vampire'
        }
    ]

    const mortalDifficulties = [
        {
            id: 0,
            type: 'Faible'
        },
        {
            id: 1,
            type: 'Moyen'
        },
        {
            id: 2,
            type: 'Doué'
        },
        {
            id: 3,
            type: 'Redoutable'
        },
    ]

    const vampireDifficulties = [
        {
            id: 4,
            type: 'Nouveau né'
        },
        {
            id: 5,
            type: 'Ancilla'
        },
        {
            id: 6,
            type: 'Ancilla Redoutable'
        },
        {
            id: 7,
            type: 'Ancien'
        }
    ]

    const getRandomName = async () => {
        const response = await axios.get(prefix + '/cg/v1/RandomName?system=3');
        return response.data["name"];
    }

    useEffect(() => {
        if (signal != null) {
            generate()
        }
    }, [signal])

    useEffect(() => {
        if (setup == false && Object.keys(startingCgObj).length != 0) {
            console.log(startingCgObj)
            setCgObj({ ...startingCgObj })
        }
        setSetup(true)

    }, [startingCgObj])

    useEffect(() => {
        if (Object.keys(cgObj).length != 0 && cgObj != startingCgObj)
            update(cgObj);
    }, [cgObj])

    const generate = async () => {
        let elementsToGenerate = document.querySelectorAll('[id^="cg_field_"]')
        let newCgObj = cgObj;
        for (var element of elementsToGenerate) {
            if (element.tagName == 'INPUT') {
                let simpleName = element.id.split('cg_field_')[1];
                let associatedCheckboxChecked = document.querySelector('[value="' + simpleName + '_checkbox"]').checked

                if (associatedCheckboxChecked == false) {
                    let name = `cg_vampire_${simpleName}`;

                    let res = await cgUtils.executeFunctionByName(name, cgUtils, cgObj.type, cgObj.difficulty);
                    newCgObj[simpleName] = res;
                }
            }
            else if (element.tagName == 'DIV') {
                let simpleName = element.id.split('cg_field_')[1];
                let name = `cg_vampire_${simpleName}`;
                let lockedElements = [];
                let associatedCheckboxesChecked = document.querySelectorAll('[value^="' + simpleName + '_"]');
                for (var checkbox of associatedCheckboxesChecked) {
                    if (checkbox.checked) {
                        let cName = checkbox.value.split('_')[1]
                        lockedElements.push(cName);
                    }
                }
                let valuesToSend = null;
                switch (simpleName) {
                    case 'attributes':
                        valuesToSend = cgObj.attributes;
                        break;
                    case 'comps':
                        valuesToSend = cgObj.comps;
                        break;
                }
                let res = await cgUtils.executeFunctionByName(name, cgUtils, cgObj.type, cgObj.difficulty, lockedElements, valuesToSend);
                newCgObj[simpleName] = res;
            }
        }
        setCgObj({ ...newCgObj });
    }

    return (
        setup == true && <>
            <TextField
                id="cg-vampire-type"
                select
                label="Type"
                value={cgObj.type}
                onChange={(e) => { setCgObj({ ...cgObj, type: e.target.value }); }}
                sx={{ minWidth: '50ch', m: 2 }}
            >
                {charTypes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.type}
                    </MenuItem>
                ))}
            </TextField>
            {
                cgObj.type == 0 && <Grid id="generator" container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <TextField
                            id="cg-vampire-difficulty"
                            select
                            label="Difficulté"
                            value={cgObj.difficulty}
                            onChange={(e) => { setCgObj({ ...cgObj, difficulty: e.target.value }); }}
                            sx={{ minWidth: '50ch', m: 2 }}
                        >
                            {mortalDifficulties.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            }
            {
                cgObj.type == 1 && <Grid id="generator" container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <TextField
                            id="cg-vampire-difficulty"
                            select
                            label="Difficulté"
                            value={cgObj.difficulty}
                            onChange={(e) => { setCgObj({ ...cgObj, difficulty: e.target.value }); }}
                            sx={{ minWidth: '50ch', m: 2 }}
                        >
                            {vampireDifficulties.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}><h2>Concept</h2></Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="predation" />
                        <TextField label="Style de prédation" variant='outlined' id="cg_field_predation" type="" value={cgObj.predation || ''} onChange={(e) => setCgObj({ ...cgObj, predation: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="clan" />
                        <TextField label="Clan" variant='outlined' id="cg_field_clan" type="" value={cgObj.clan || ''} onChange={(e) => setCgObj({ ...cgObj, clan: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="sire" />
                        <TextField label="Sire" variant='outlined' id="cg_field_sire" type="" value={cgObj.sire || ''} onChange={(e) => setCgObj({ ...cgObj, sire: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="generation" />
                        <TextField label="Génération" variant='outlined' id="cg_field_generation" type="" value={cgObj.generation || ''} onChange={(e) => setCgObj({ ...cgObj, generation: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="blood" />
                        <TextField label="Points de Sang" variant='outlined' id="cg_field_blood" type="" value={cgObj.blood || ''} onChange={(e) => setCgObj({ ...cgObj, blood: e.target.value })}></TextField>
                    </Grid>
                    <div hidden id='cg_field_attributes' />
                    <Grid item xs={12}><h2>Attributs</h2></Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_strength" />
                        <TextField label="Force" variant='outlined' type="" value={cgObj.attributes.strength || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, strength: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_charisma" />
                        <TextField label="Charisme" variant='outlined' type="" value={cgObj.attributes.charisma || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, charisma: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_intelligence" />
                        <TextField label="Intelligence" variant='outlined' type="" value={cgObj.attributes.intelligence || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, intelligence: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_dexterity" />
                        <TextField label="Dextérité" variant='outlined' type="" value={cgObj.attributes.dexterity || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, dexterity: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_manipulation" />
                        <TextField label="Manipulation" variant='outlined' type="" value={cgObj.attributes.manipulation || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, manipulation: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_cunning" />
                        <TextField label="Astuce" variant='outlined' type="" value={cgObj.attributes.cunning || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, cunning: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_stamina" />
                        <TextField label="Vigueur" variant='outlined' type="" value={cgObj.attributes.stamina || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, stamina: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_composure" />
                        <TextField label="Sang-Froid" variant='outlined' type="" value={cgObj.attributes.composure || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, composure: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="attributes_resolve" />
                        <TextField label="Résolution" variant='outlined' type="" value={cgObj.attributes.resolve || ''} onChange={(e) => setCgObj({ ...cgObj, attributes: { ...cgObj.attributes, resolve: e.target.value } })}></TextField>
                    </Grid>
                    <div hidden id='cg_field_comps' />
                    <Grid item xs={12}><h2>Compétences</h2></Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_gun" />
                        <TextField label="Armes à feu" variant='outlined' type="" value={cgObj.comps.gun || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, gun: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_animal" />
                        <TextField label="Animaux" variant='outlined' type="" value={cgObj.comps.animals || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, animals: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_erudition" />
                        <TextField label="Érudition" variant='outlined' type="" value={cgObj.comps.erudition || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, erudition: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_craft" />
                        <TextField label="Artisanat" variant='outlined' type="" value={cgObj.comps.craft || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, craft: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_command" />
                        <TextField label="Commandement" variant='outlined' type="" value={cgObj.comps.command || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, command: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_finance" />
                        <TextField label="Finances" variant='outlined' type="" value={cgObj.comps.finance || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, finance: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_athletism" />
                        <TextField label="Athlétisme" variant='outlined' type="" value={cgObj.comps.athletism || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, athletism: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_empathy" />
                        <TextField label="Empathie" variant='outlined' type="" value={cgObj.comps.empathy || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, empathy: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_investigation" />
                        <TextField label="Investigation" variant='outlined' type="" value={cgObj.comps.investigation || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, investigation: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_brawl" />
                        <TextField label="Bagarre" variant='outlined' type="" value={cgObj.comps.brawl || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, brawl: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_etiquette" />
                        <TextField label="Étiquette" variant='outlined' type="" value={cgObj.comps.etiquette || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, etiquette: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_medicine" />
                        <TextField label="Médecine" variant='outlined' type="" value={cgObj.comps.medicine || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, medicine: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_drive" />
                        <TextField label="Conduite" variant='outlined' type="" value={cgObj.comps.drive || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, drive: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_night" />
                        <TextField label="Expérience de la rue" variant='outlined' type="" value={cgObj.comps.night || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, night: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_occult" />
                        <TextField label="Occultisme" variant='outlined' type="" value={cgObj.comps.occult || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, occult: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_stealth" />
                        <TextField label="Furtivité" variant='outlined' type="" value={cgObj.comps.stealth || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, stealth: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_intimidation" />
                        <TextField label="Intimidation" variant='outlined' type="" value={cgObj.comps.intimidation || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, intimidation: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_politic" />
                        <TextField label="Politique" variant='outlined' type="" value={cgObj.comps.politic || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, politic: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_sleight" />
                        <TextField label="Larcin" variant='outlined' type="" value={cgObj.comps.sleight || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, sleight: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_representation" />
                        <TextField label="Performance" variant='outlined' type="" value={cgObj.comps.representation || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, representation: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_science" />
                        <TextField label="Sciences" variant='outlined' type="" value={cgObj.comps.science || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, science: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_melee" />
                        <TextField label="Mêlée" variant='outlined' type="" value={cgObj.comps.melee || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, melee: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_persuasion" />
                        <TextField label="Persuasion" variant='outlined' type="" value={cgObj.comps.persuasion || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, persuasion: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_tech" />
                        <TextField label="Technologies" variant='outlined' type="" value={cgObj.comps.tech || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, tech: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_survival" />
                        <TextField label="Survie" variant='outlined' type="" value={cgObj.comps.survival || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, survival: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_subterfuge" />
                        <TextField label="Subterfuge" variant='outlined' type="" value={cgObj.comps.subterfuge || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, subterfuge: e.target.value } })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <CgCheckbox name="comps_vigilance" />
                        <TextField label="Vigilance" variant='outlined' type="" value={cgObj.comps.vigilance || ''} onChange={(e) => setCgObj({ ...cgObj, comps: { ...cgObj.comps, vigilance: e.target.value } })}></TextField>
                    </Grid>
                </Grid>
            }
        </>
    )
}