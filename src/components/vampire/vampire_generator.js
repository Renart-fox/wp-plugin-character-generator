const { Component, render } = wp.element;

import { useState, useEffect } from 'react';

import { Attributes, Skills } from './vampire_enum';

import { Grid, TextField, MenuItem } from '@mui/material';
import CgCheckbox from '../checkbox/cg_checkbox';
import * as cgUtils from './generator_tools'
import axios from 'axios';
import Divider from '@mui/material/Divider';

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
        'skills': {
            0: "0",
            1: "0",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
            14: "0",
            15: "0",
            16: "0",
            17: "0",
            18: "0",
            19: "0",
            20: "0",
            21: "0",
            22: "0",
            23: "0",
            24: "0",
            25: "0",
            26: "0",
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

    //const compsLabels = Object.values(comps);

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
                    <div hidden id='cg_field_attributes' />
                    <Grid item xs={12}><h1>Attributs</h1></Grid>
                    {
                        Object.keys(Attributes).map((attr) => {
                            return (
                                <Grid item xs={4}>
                                    <h3>{Attributes[attr]}</h3>
                                    <CgCheckbox name={"attributes_" + attr} />
                                    <TextField variant='outlined' type="" value={cgObj.attributes[attr] || ''} onChange={(e) => { changeObjValue('attributes', attr, e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12}><Divider /></Grid>
                    <div hidden id='cg_field_skills' />
                    <Grid item xs={12}><h1>Compétences</h1></Grid>
                    {
                        Skills.map((skill) => {
                            return (
                                <Grid item xs={4}>
                                    <h3>{skill['fullname']}</h3>
                                    <CgCheckbox name={"skills_" + skill['name']} />
                                    <TextField variant='outlined' type="" value={cgObj.skills[skill['id']] || ''} onChange={(e) => { changeObjValue('skills', skill['id'], e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12}><h1>Spécialisations</h1></Grid>
                    {
                        /*cgObj.specs.map((spec, ind) => {
                            let compsCopy = { ...comps };
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
                        })*/
                    }
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
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12}><h1>Concept</h1></Grid>
                    <Grid item xs={4}>
                        <h3>Style de prédation</h3>
                        <CgCheckbox name="predation" />
                        <TextField variant='outlined' id="cg_field_predation" type="" value={cgObj.predation || ''} onChange={(e) => setCgObj({ ...cgObj, predation: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Clan</h3>
                        <CgCheckbox name="clan" />
                        <TextField variant='outlined' id="cg_field_clan" type="" value={cgObj.clan || ''} onChange={(e) => setCgObj({ ...cgObj, clan: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Sire</h3>
                        <CgCheckbox name="sire" />
                        <TextField variant='outlined' id="cg_field_sire" type="" value={cgObj.sire || ''} onChange={(e) => setCgObj({ ...cgObj, sire: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Génération</h3>
                        <CgCheckbox name="generation" />
                        <TextField variant='outlined' id="cg_field_generation" type="" value={cgObj.generation || ''} onChange={(e) => setCgObj({ ...cgObj, generation: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Points de Sang</h3>
                        <CgCheckbox name="blood" />
                        <TextField variant='outlined' id="cg_field_blood" type="" value={cgObj.blood || ''} onChange={(e) => setCgObj({ ...cgObj, blood: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={12}><Divider /></Grid>
                    <div hidden id='cg_field_attributes' />
                    <Grid item xs={12}><h1>Attributs</h1></Grid>
                    {
                        Object.keys(Attributes).map((attr) => {
                            return (
                                <Grid item xs={4}>
                                    <h3>{Attributes[attr]}</h3>
                                    <CgCheckbox name={"attributes_" + attr} />
                                    <TextField variant='outlined' type="" value={cgObj.attributes[attr] || ''} onChange={(e) => { changeObjValue('attributes', attr, e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12}><Divider /></Grid>
                    <div hidden id='cg_field_skills' />
                    <Grid item xs={12}><h1>Compétences</h1></Grid>
                    {
                        Skills.map((skill) => {
                            return (
                                <Grid item xs={4}>
                                    <h3>{skill['fullname']}</h3>
                                    <CgCheckbox name={"skills_" + skill['name']} />
                                    <TextField variant='outlined' type="" value={cgObj.skills[skill['id']] || ''} onChange={(e) => { changeObjValue('skills', skill['id'], e.target.value) }}></TextField>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12}><h1>Spécialisations</h1></Grid>
                    {
                        /*cgObj.specs.map((spec, ind) => {
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
                        })*/
                    }
                </Grid >
            }
        </>
    )
}