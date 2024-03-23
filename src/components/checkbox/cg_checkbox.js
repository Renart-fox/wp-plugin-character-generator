const { Component, render } = wp.element;
import { useState } from 'react';
import { Checkbox } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function CgCheckbox({ name, label = null, onChecked = () => { }, defaultChecked = false }) {

    const [isChecked, setIsChecked] = React.useState(false);

    const changeChecked = () => {
        let checked = !isChecked;
        setIsChecked(checked);
        onChecked(checked);
    }

    if (label == null)
        return (
            <Checkbox
                defaultChecked={defaultChecked}
                checked={isChecked}
                key={name + "_checkbox_key"}
                value={name + "_checkbox"}
                icon={<LockOpenIcon />}
                checkedIcon={<LockIcon />}
                onClick={() => { changeChecked() }} />
        )
    else {
        return (
            <FormControlLabel control={
                <Checkbox
                    defaultChecked={defaultChecked}
                    checked={isChecked}
                    key={name + "_checkbox_key"}
                    value={name + "_checkbox"}
                    onClick={() => { changeChecked() }}
                />
            }
                label={label} />
        )
    }
}