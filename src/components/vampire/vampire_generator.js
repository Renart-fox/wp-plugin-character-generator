const { Component, render } = wp.element;

import { useState, useEffect } from 'react';

import { Attributes, Skills, Disciplines, Clans } from './vampire_enum';

import { Grid, TextField, MenuItem, Button, Checkbox } from '@mui/material';
import CgCheckbox from '../checkbox/cg_checkbox';
import * as cgUtils from './generator_tools'
import axios from 'axios';
import Divider from '@mui/material/Divider';

const prefix = window.location.href.includes('localhost') ? '/wordpress/wp-json' : '/wp-json';

export default function VampireGenerator({ signal, update, startingCgObj, disableSystemChoice }) {

    const [cgObj, setCgObj] = React.useState({
        'type': 0,
        'goule': false,
        'predation': "",
        'clan': 0,
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
        'specs': [],
        'disciplines': []
    })

    const [setup, setSetup] = React.useState(false);
    const [forceGouleCheck, setForceGouleCheck] = React.useState(null);

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

    useEffect(() => {
        if (cgObj.type == 0 && cgObj.difficulty > 3)
            setCgObj({ ...cgObj, difficulty: 0 })
        else if (cgObj.type == 1 && cgObj.difficulty < 4) {
            setCgObj({ ...cgObj, difficulty: 4 })
        }
    }, [cgObj.type])

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

    }, [startingCgObj])

    useEffect(() => {
        if (setup == true)
            disableSystemChoice(true);
        setSetup(true)
        update(cgObj);
        setForceGouleCheck(cgObj.goule);
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
        newCgObj.specs[ind]['comp'] = value;
        setCgObj({ ...newCgObj })
    }

    const changeSpecSpecValue = (ind, value) => {
        let newCgObj = { ...cgObj };
        newCgObj.specs[ind]['spec'] = value;
        setCgObj({ ...newCgObj })
    }

    const changeDiscDiscValue = (ind, value) => {
        let newCgObj = { ...cgObj };
        newCgObj.disciplines[ind]['id'] = value;
        setCgObj({ ...newCgObj })
    }

    const changeDiscPower = (discInd, powerInd, value) => {
        let newCgObj = { ...cgObj };
        let discPowers = newCgObj.disciplines[discInd];
        const newDiscPowers = [
            ...discPowers.slice(0, powerInd),
            value,
            ...discPowers.slice(powerInd)
        ];
        newCgObj.disciplines[discInd] = newDiscPowers;
        setCgObj({ ...newCgObj });
    }

    const gouleChecked = (value) => {
        setCgObj({ ...cgObj, goule: value });
    }

    return (
        <>
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
            <Grid id="generator" container spacing={2} sx={{ width: '100%' }}>
                {
                    cgObj.type == 0 && <Grid item xs={12}>
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
                        <br />
                        <CgCheckbox name='goule' label='Est une goule ?' onChecked={gouleChecked} forceCheck={forceGouleCheck} />
                    </Grid>
                }
                {
                    cgObj.type == 1 && <Grid item xs={12}>
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
                }
                {
                    cgObj.type == 1 && <>
                        <Grid item xs={12}><Divider /></Grid>
                        <Grid item xs={12}><h1>Concept</h1></Grid>
                        <Grid item xs={4}>
                            <h3>Style de prédation</h3>
                            <CgCheckbox name="predation" />
                            <TextField variant='outlined' id="cg_field_predation" type="" value={cgObj.predation || ''} onChange={(e) => setCgObj({ ...cgObj, predation: e.target.value })}></TextField>
                        </Grid>
                    </>
                }
                {

                    (cgObj.type == 1 || cgObj.goule) && <>
                        <Grid item xs={4}>
                            <h3>{cgObj.type == 1 ? "Clan" : "Clan de lae Maître·sse"}</h3>
                            <CgCheckbox name="clan" />
                            <TextField
                                id="cg_field_clan"
                                select
                                value={cgObj.clan}
                                label={cgObj.type == 1 ? "Clan" : "Clan de lae Maître·sse"}
                                onChange={(e) => { setCgObj({ ...cgObj, clan: e.target.value }); }}
                                sx={{ minWidth: '30ch' }}
                            >
                                {Clans.map((clan) => (
                                    <MenuItem key={clan.id} value={clan.id}>
                                        {clan.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <h3>{cgObj.type == 1 ? "Sire/Dame" : "Maître·sse"}</h3>
                            <CgCheckbox name="sire" />
                            <TextField variant='outlined' id="cg_field_sire" type="" value={cgObj.sire || ''} onChange={(e) => setCgObj({ ...cgObj, sire: e.target.value })}></TextField>
                        </Grid>
                    </>
                }
                {
                    cgObj.type == 1 && <>
                        <Grid item xs={4}>
                            <h3>Génération</h3>
                            <CgCheckbox name="generation" />
                            <TextField variant='outlined' id="cg_field_generation" type="" value={cgObj.generation || ''} onChange={(e) => setCgObj({ ...cgObj, generation: e.target.value })}></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <h3>Puissance de Sang</h3>
                            <CgCheckbox name="blood" />
                            <TextField variant='outlined' id="cg_field_blood" type="" value={cgObj.blood || ''} onChange={(e) => setCgObj({ ...cgObj, blood: e.target.value })}></TextField>
                        </Grid>
                    </>
                }
                <Grid item xs={12}><Divider /></Grid>
                <div hidden id='cg_field_attributes' />
                <Grid item xs={12}><h1>Attributs</h1></Grid>
                {
                    Object.keys(Attributes).map((attr) => {
                        return (
                            <Grid item xs={4}>
                                <h3>{Attributes[attr]}</h3>
                                <CgCheckbox name={"attributes_" + attr} />
                                <TextField variant='outlined' type="" value={cgObj.attributes[attr] || ''} onChange={(e) => { changeObjValue('attributes', attr, parseInt(e.target.value) > 5 ? 5 : parseInt(e.target.value)) }}></TextField>
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
                                <CgCheckbox name={"skills_" + skill['id']} />
                                <TextField variant='outlined' type="" value={cgObj.skills[skill['id']] || ''} onChange={(e) => { changeObjValue('skills', skill['id'], parseInt(e.target.value) > 5 ? 5 : parseInt(e.target.value)) }}></TextField>
                            </Grid>
                        )
                    })
                }
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}><h1>Spécialisations</h1></Grid>
                {
                    cgObj.specs.map((spec, ind) => (
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Compétence"
                                value={spec['comp']}
                                onChange={(e) => { changeSpecCompValue(ind, e.target.value) }}
                                sx={{ minWidth: '50ch' }}
                            >
                                {Skills.map((skill) => (
                                    <MenuItem key={skill['name']} value={skill['id']}>
                                        {skill['fullname']}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField label="Spécialisation" variant='outlined' type="" value={spec["spec"] || ''} onChange={(e) => { changeSpecSpecValue(ind, e.target.value) }}></TextField>
                        </Grid>
                    ))
                }
                <Grid item xs={12}>
                    <Button variant='outlined' id='create_spec' onClick={() => {
                        let newSpec = [...cgObj.specs];
                        newSpec.push({ comp: 0, spec: "" });
                        setCgObj({ ...cgObj, specs: newSpec });
                    }}>
                        Ajouter une spécialisation
                    </Button>
                </Grid>
                {
                    (cgObj.type == 1 || cgObj.goule) && <>
                        <div hidden id='cg_field_disciplines' />
                        <Grid item xs={12}><Divider /></Grid>
                        <Grid item xs={12}><h1>Disciplines</h1></Grid>
                        {
                            cgObj.disciplines.map((disc, discInd) => (
                                <Grid item xs={4}>
                                    {/*CgCheckbox name={"disciplines_" + disc['id']} />*/}
                                    <TextField
                                        select
                                        label="Discipline"
                                        value={disc['id']}
                                        onChange={(e) => { changeDiscDiscValue(discInd, e.target.value) }}
                                        sx={{ minWidth: '35ch' }}
                                    >
                                        {Disciplines.map((disc) => (
                                            <MenuItem key={disc['name']} value={disc['id']}>
                                                {disc['name']}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    {
                                        cgObj.disciplines[discInd]["powers"].map((power, powerInd) => (
                                            <Grid item xs={12} sx={{ m: 2 }}>
                                                <TextField label={String(powerInd + 1)} variant='outlined' type="" value={power || ''} onChange={(e) => { changeDiscPower(discInd, powerInd, e.target.value) }}></TextField>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            ))
                        }
                        <Grid item xs={12}>
                            <Button variant='outlined' id='create_disc' onClick={() => {
                                let newDisc = [...cgObj.disciplines];
                                newDisc.push({ id: 0, "name": "", "level": 0, "powers": ["", "", "", "", ""] });
                                setCgObj({ ...cgObj, disciplines: newDisc });
                            }}>
                                Ajouter une discipline
                            </Button>
                        </Grid>
                    </>
                }
            </Grid >
        </>
    )
}