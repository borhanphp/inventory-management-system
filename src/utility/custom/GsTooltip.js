import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const GsTooltip = ( args ) => {
    const { text, id } = args;
    const [tooltipOpen, setTooltipOpen] = useState( false );
    const toggle = () => setTooltipOpen( !tooltipOpen );

    return (
        <div>
            <Tooltip
                {...args}
                isOpen={tooltipOpen}
                target={id}
                toggle={toggle}
            >
                {text}
            </Tooltip>
        </div>
    );
}

GsTooltip.args = {
    autohide: true,
    flip: true,
};

GsTooltip.argTypes = {
    placement: {
        control: { type: 'select' },
        options: ['top', 'left', 'right', 'bottom'],
    },
};

export default GsTooltip;