import React, {PureComponent} from 'react';
import { FontIcon, injectTooltip } from 'react-md';

const styles = {
    tooltipContainer: {
        position: 'relative',
        display: 'inline-block',
        margin: '.3em',
    }
};


class TooltipIcon extends PureComponent {
    render() {
        const { children, iconClassName, tooltip, clickHandler } = this.props;

        return (
            <div style={styles.tooltipContainer}>
                {tooltip}
                <FontIcon className={iconClassName} onClick={clickHandler}>{children}</FontIcon>
            </div>
        )
    }
}

export default injectTooltip(TooltipIcon);
