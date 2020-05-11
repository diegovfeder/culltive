import React from 'react';

const User: React.FC<Props> = ({user}) => {
  return (
    <div>
      <strong>Nome: </strong> {user.name} <br />
      <strong>E-mail: </strong> {user.email} <br /> <br />
    </div>
  );
};

export default User;
