import React from "react";

import SwipeableViews from "react-swipeable-views";

import { Box } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const SwipeableTabs = ({ children, props }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                {children.map((child) => {
                    return (<Tab key={"tab-" + child.props.tab} label={child.props.tab} />)
                })}
            </Tabs>

            <SwipeableViews
                axis={"x"}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {children.map((child, index) => {
                    return (
                        <TabPanel key={"tabpanel-" + child.props.tab} value={value} index={index}>
                            {child}
                        </TabPanel>
                    )
                })}
            </SwipeableViews>
        </Box>
    );
};

export default SwipeableTabs;
