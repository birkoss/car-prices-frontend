import React from 'react';
const List = (props) => {
    const { makes } = props;

    console.log(makes);

    if (!makes || makes.length === 0) {
        return (
            <p>No makes, sorry</p>
        );
    }

    console.log("---===---");

  return (
      <div>
    <h2 className='list-head'>Makes</h2>
    <ul>
      {makes.map((make) => {
        return (
          <li key={make.slug} className='list'>
            <span className='make-name'>{make.name}</span>
            <span className='make-slug'>{make.slug}</span>
          </li>
        );
      })}
    </ul>
    </div>
  );
};
export default List;
