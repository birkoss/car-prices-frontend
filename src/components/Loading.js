import { Box } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import styles from "./Loading.module.css";

const Loading = (props) => {
    let style = styles.container;
    if (props.inside) {
        style = styles.container_simple;
    }
    return (
        <Box className={style}>
            <CircularProgress />
        </Box>
    );
};
export default Loading;
