const { Component, render } = wp.element;
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const queryClient = new QueryClient();

const Generator = () => {

    const translateSystemName = (system) => {
        switch (system) {
            case "v5e":
                return "Vampire : La Mascarade";
            case "dd5e":
                return "D&D 5e";
            default:
                return "Cyberpunk RED";
        }
    }

    const [isLoading, setIsLoading] = useState(true)
    const [systems, setSystems] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    const [systemToRender, setSystemToRender] = useState(<h1>D&D5e</h1>);

    const [snackState, setSnackState] = useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'right',
        message: 'Le personnage a bien été sauvegardé',
        alert: 'success'
    });

    //const [character, setCharacter] = useState({})

    const [characterState, setCharacterState] = useState({
        id: -1,
        system: 1,
        name: "",
        cg_obj: {}
    })

    const { vertical, horizontal, open } = snackState;


    const handleSnackClose = (event, reason) => {
        setSnackState({ ...snackState, open: false })
    };

    const snackAction = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    const fetchSystems = async () => {
        const response = await axios.get('/wordpress/wp-json/cg/v1/Systems');
        fetchCharacter();
        setSystems(response.data)
        setDataFetched(true);
    }

    const fetchCharacter = async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const characterId = urlParams.get('value')

        if (characterId !== null) {
            const response = await axios.get('/wordpress/wp-json/cg/v1/Character?id=' + characterId);
            let character = response.data[0];
            setCharacterState({ ...characterState, system: character.systemId, name: character.name, cg_obj: character.cg_obj, id: characterId })
            renderGenerator(character.systemId);
        }

        setIsLoading(false);
    }

    if (dataFetched == false)
        fetchSystems();

    var mutation = useMutation({
        mutationFn: () => {
            return axios.post('/wordpress/wp-json/cg/v1/Save', JSON.stringify(characterState), {
                headers: {
                    "Content-Type": "application/json; charset= UTF-8",
                    'X-WP-Nonce': window.wpnonce
                }
            })
        },
        onError: () => { setSnackState({ ...snackState, open: true, message: 'Erreur dans l\'enregistrement du personnage. Contactez Miel', alert: 'error' }) },
        onSuccess: () => { setSnackState({ ...snackState, open: true, message: 'Le personnage a bien été sauvegardé', alert: 'success' }) }
    })

    const generateCharacter = async () => {
        const response = await axios.get('/wordpress/wp-json/cg/v1/RandomName?system=' + characterState.system);
        setCharacterState({ ...characterState, name: response.data["name"] })
    }

    const renderGenerator = (system) => {
        switch (system) {
            case "1":
                setSystemToRender(<h1>D&D5e</h1>)
                break;
            case "2":
                setSystemToRender(<h1>Cyberpunk RED</h1>)
                break;
            case "3":
                setSystemToRender(<h1>Vampire : La Mascarade</h1>)
                break;
        }

    };

    return (
        !isLoading && <>
            <Box
                sx={{
                    '& > :not(style)': { m: 2, width: '50ch' },
                }}
                noValidate
                autoComplete="off">
                <TextField id="cg-data-characterName" label="Nom du personnage" variant="standard" type="" defaultValue={characterState.name} value={characterState.name} onChange={(e) => { setCharacterState({ ...characterState, name: e.target.value }) }} />
                <TextField
                    id="cg-data-system"
                    select
                    label="Système"
                    defaultValue={1}
                    value={characterState.system}
                    onChange={(e) => { setCharacterState({ ...characterState, system: e.target.value }); renderGenerator(e.target.value); }}
                >
                    {systems.map((option) => (
                        <MenuItem key={option.ID} value={option.ID}>
                            {translateSystemName(option.Systeme)}
                        </MenuItem>
                    ))}
                </TextField>
                {
                    systemToRender
                }
                <br />
                <Button variant="contained" onClick={() => generateCharacter()} sx={{ mr: '1rem' }}>Lancer les dés !</Button>
                <Button variant="contained" onClick={() => { mutation.mutate() }}>Sauvegarder le personnage</Button>
            </Box >

            <Snackbar
                open={snackState.open}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                message={snackState.message}
                action={snackAction}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleSnackClose}
                    severity={snackState.alert}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackState.message}
                </Alert>
            </Snackbar>
        </>
    );
}

function GeneratorComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <Generator />
        </QueryClientProvider>
    );
}

render(
    <GeneratorComponent />,
    document.getElementById('cg-generator')
);