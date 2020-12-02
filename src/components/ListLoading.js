import React from 'react';

function ListLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {

    console.log(isLoading);

    if (!isLoading) return <Component {...props} />;

    console.log("-----");

    return (
      <p style={{ textAlign: 'center', fontSize: '30px' }}>
        Hold on, fetching data may take some time :)
      </p>
    );
  };
}
export default ListLoading;