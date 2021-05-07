import React from 'react';

import {Device} from '@/classes/Device';

import '@/general.scss';

// Definition of State and Props
type DeviceDialogProps = {
    device: Device | undefined,
    close_function: () => void,
}

type DeviceDialogState = {
    
}

class DeviceDialog extends React.Component<DeviceDialogProps, DeviceDialogState> {
    constructor(props: DeviceDialogProps) {
        super(props);
    }

    render() {
        return (
            <div className="DeviceDialog">
                <p> Device </p>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
}

export default DeviceDialog;