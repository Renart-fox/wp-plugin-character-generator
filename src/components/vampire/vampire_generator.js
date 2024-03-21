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
        },
        'specs': []
    })

    const [specsToRender, setSpecsToRender] = React.useState([]);

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

    const attributes = {
        'strength': 'Force',
        'dexterity': 'Dextérité',
        'stamina': 'Vigueur',
        'charisma': 'Charisme',
        'manipulation': 'Manipulation',
        'composure': 'Sang-Froid',
        'intelligence': 'Intelligence',
        'cunning': 'Astuce',
        'resolve': 'Résolution'
    }

    const comps = {
        'gun': 'Armes à feu',
        'animals': 'Animaux',
        'erudition': 'Érudition',
        'craft': 'Artisanat',
        'command': 'Commandement',
        'finance': 'Finances',
        'athletism': 'Athlétisme',
        'empathy': 'Empathie',
        'investigation': 'Investigation',
        'brawl': 'Bagarre',
        'etiquette': 'Étiquette',
        'medicine': 'Médecine',
        'drive': 'Conduite',
        'night': 'Éxpérience de la rue',
        'occult': 'Occultisme',
        'stealth': 'Furtivité',
        'intimidation': 'Intimidation',
        'politic': 'Politique',
        'sleight': 'Larcin',
        'representation': 'Performance',
        'science': 'Sciences',
        'melee': 'Mêlée',
        'persuasion': 'Persuasion',
        'tech': 'Technologies',
        'survival': 'Survie',
        'subterfuge': 'Subterfuge',
        'vigilance': 'Vigilance',
    };

    const compsLabels = Object.values(comps);

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
        let newCgObj = { ...cgObj };
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
                let res = await cgUtils.executeFunctionByName(name, cgUtils, cgObj.type, cgObj.difficulty, lockedElements, { ...newCgObj });
                newCgObj = res;
            }
        }
        setCgObj({ ...newCgObj });
    }

    const changeObjValue = (type, key, value) => {
        let newCgObj = { ...cgObj };
        newCgObj[type][key] = value;
        setCgObj({ ...newCgObj });
    }

    const changeSpecCompValue = (ind, value) => {
        let newCgObj = { ...cgObj };
        newCgObj.specs[ind]['Comp'] = value;
        setCgObj({ ...newCgObj })
    }

    const changeSpecSpecValue = (ind, value) => {
        let newCgObj = { ...cgObj };
        newCgObj.specs[ind]['Spec'] = value;
        setCgObj({ ...newCgObj })
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
                    {
                        Object.keys(attributes).map((attr) => {
                            return (
                                <Grid item xs={4}>
                                    <CgCheckbox name={"attributes_" + attr} />
                                    <TextField label={attributes[attr]} variant='outlined' type="" value={cgObj.attributes[attr] || ''} onChange={(e) => { changeObjValue('attributes', attr, e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <div hidden id='cg_field_comps' />
                    <Grid item xs={12}><h2>Compétences</h2></Grid>
                    {
                        Object.keys(comps).map((comp) => {
                            return (
                                <Grid item xs={4}>
                                    <CgCheckbox name={"comps_" + comp} />
                                    <TextField label={comps[comp]} variant='outlined' type="" value={cgObj.comps[comp] || ''} onChange={(e) => { changeObjValue('comps', comp, e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12}><h2>Spécialisations</h2></Grid>
                    {
                        cgObj.specs.map((spec, ind) => {
                            let compsCopy = comps;
                            return (
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        label="Compétences"
                                        value={compsCopy[spec['Comp']] || ''}
                                        onChange={(e) => { changeSpecCompValue(ind, e.target.value) }}
                                        sx={{ minWidth: '50ch' }}
                                    >
                                        {compsLabels.map((comp) => (
                                            <MenuItem key={comp} value={comp}>
                                                {comp}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField label="Spécialisation" variant='outlined' type="" value={spec["Spec"] || ''} onChange={(e) => { changeSpecSpecValue(ind, e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                </Grid >
            }
        </>
    )
}