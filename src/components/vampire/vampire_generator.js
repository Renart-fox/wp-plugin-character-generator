const { Component, render } = wp.element;

import { useState, useEffect } from 'react';

import { Clan, Predation } from './vampire_enum';

import { Grid, TextField, MenuItem } from '@mui/material';
import CgCheckbox from '../checkbox/cg_checkbox';
import axios from 'axios';

const prefix = window.location.href.includes('localhost') ? '/wordpress/wp-json' : 'https://initiative.knaudin.fr/wp-json';

export default function VampireGenerator({ signal, update, startingCgObj }) {

    const [cgObj, setCgObj] = React.useState({
        'type': 1,
        'predation': "",
        'clan': "",
        'sire': "",
        'generation': ""
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
        if (setup == false) {
            console.log(startingCgObj)
            setCgObj({ ...startingCgObj })
            setSetup(true)
        }

    }, [startingCgObj])

    useEffect(() => {
        if (cgObj != startingCgObj)
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
                    switch (simpleName) {
                        case 'clan':
                            newCgObj['clan'] = Clan[Math.floor(Math.random() * Object.keys(Clan).length)]
                            break;
                        case 'sire':
                            newCgObj['sire'] = await getRandomName()
                            break;
                        case 'predation':
                            newCgObj['predation'] = Predation[Math.floor(Math.random() * Object.keys(Predation).length)]
                            break;
                        case 'generation':
                            newCgObj['generation'] = 4 + Math.floor(Math.random() * 9) + ""
                            break;
                    }

                }
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

                </Grid>
            }
            {
                cgObj.type == 1 && <Grid id="generator" container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xl={4}>
                        <CgCheckbox name="predation" />
                        <TextField label="Style de prédation" variant='outlined' id="cg_field_predation" type="" value={cgObj.predation || ''} onChange={(e) => setCgObj({ ...cgObj, predation: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xl={4}>
                        <CgCheckbox name="clan" />
                        <TextField label="Clan" variant='outlined' id="cg_field_clan" type="" value={cgObj.clan || ''} onChange={(e) => setCgObj({ ...cgObj, clan: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xl={4}>
                        <CgCheckbox name="sire" />
                        <TextField label="Sire" variant='outlined' id="cg_field_sire" type="" value={cgObj.sire || ''} onChange={(e) => setCgObj({ ...cgObj, sire: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xl={4}>
                        <CgCheckbox name="generation" />
                        <TextField label="Génération" variant='outlined' id="cg_field_generation" type="" value={cgObj.generation || ''} onChange={(e) => setCgObj({ ...cgObj, generation: e.target.value })}></TextField>
                    </Grid>
                </Grid>
            }
        </>
    )
}