import { Typography } from "@material-ui/core";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <div className={styles.container}>
            <Typography variant="h3" component="h1">Not Found</Typography>
        </div>
    );
}

export default NotFoundPage;
