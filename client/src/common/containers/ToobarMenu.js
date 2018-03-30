import React from 'react';
import {FontIcon, ListItem, MenuButton} from "react-md";
import {Link} from "react-router-dom";

const ToolbarMenu = ({id, toolbarActions, onClickItem}) => {
    return (
        <MenuButton
            id={id}
            icon
            menuItems={toolbarActions.map(item => {
                return (
                    <ListItem
                        key={item.to}
                        component={Link}
                        to={item.to}
                        primaryText={item.label}
                        onClick={() => onClickItem(item)}
                        leftIcon={<FontIcon>{item.icon}</FontIcon>}
                    />
                )
            })}>
            more_vert
        </MenuButton>
    )
};

export default ToolbarMenu;
