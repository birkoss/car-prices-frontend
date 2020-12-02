import { Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './Loading.module.css'; 

const Loading = () => {

  return (
    <Box className={styles.container}>
        <CircularProgress />
    </Box>
  );
};
export default Loading;