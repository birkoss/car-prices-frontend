import { Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Navbar.module.css'; 


const Navbar = (props) => {
    const { makes } = props;

    if (!makes || makes.length === 0) {
        return (
            <p>...</p>
        );
    }

  return (
      <React.Fragment>
        {makes.map((make) => {
            return (
            <Link key={make.name} to={"/make/" + make.slug} className={styles.link}>
                <Typography variant="body2">{make.name}</Typography>
            </Link>
            );
        })}
        </React.Fragment>
  );
};
export default Navbar;
