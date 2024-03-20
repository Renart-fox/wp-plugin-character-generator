const { Component, render } = wp.element;
import { useState } from 'react';
import { Checkbox } from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function CgCheckbox(props) {
    const { name } = props;

    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <Checkbox
            checked={isChecked}
            key={name + "_checkbox_key"}
            value={name + "_checkbox"}
            icon={<LockOpenIcon />}
            checkedIcon={<LockIcon />}
            onClick={() => setIsChecked(!isChecked)} />
    )
}