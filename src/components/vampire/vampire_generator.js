const { Component, render } = wp.element;

import { useState, useEffect } from 'react';

import { Clan, Predation } from './vampire_enum';

import { Grid, TextField } from '@mui/material';
import CgCheckbox from '../checkbox/cg_checkbox';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function VampireGenerator({ signal }) {

    const [cgObj, setCgObj] = React.useState({
        'predation': "",
        'clan': "",
        'sire': "",
        'generation': ""
    })

    const getRandomName = async () => {
        const response = await axios.get('/wordpress/wp-json/cg/v1/RandomName?system=3');
        return response.data["name"];
    }

    useEffect(() => {
        if (signal != null) {
            generate()
        }
    }, [signal])

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
        // Genere un clan aléatoire
        /*
        if (document.querySelector('[value="clan_checkbox"]').checked == false) {
            let numberOfClans = Object.keys(Clan).length;
            let randomClan = Math.floor(Math.random() * numberOfClans);
            setCgObj({ ...cgObj, clan: Clan[randomClan] })
        }
        */
    }

    return (
        <Grid id="generator" container spacing={2} sx={{ width: '100%' }}>
            <Grid item xl={4}>
                <CgCheckbox name="predation" />
                <TextField label="Style de prédation" variant='standard' id="cg_field_predation" type="" value={cgObj.predation} onChange={(e) => setCgObj({ ...cgObj, predation: e.target.value })}></TextField>
            </Grid>
            <Grid item xl={4}>
                <CgCheckbox name="clan" />
                <TextField label="Clan" variant='standard' id="cg_field_clan" type="" value={cgObj.clan} onChange={(e) => setCgObj({ ...cgObj, clan: e.target.value })}></TextField>
            </Grid>
            <Grid item xl={4}>
                <CgCheckbox name="sire" />
                <TextField label="Sire" variant='standard' id="cg_field_sire" type="" value={cgObj.sire} onChange={(e) => setCgObj({ ...cgObj, sire: e.target.value })}></TextField>
            </Grid>
            <Grid item xl={4}>
                <CgCheckbox name="generation" />
                <TextField label="Génération" variant='standard' id="cg_field_generation" type="" value={cgObj.generation} onChange={(e) => setCgObj({ ...cgObj, generation: e.target.value })}></TextField>
            </Grid>
        </Grid>
    )
}