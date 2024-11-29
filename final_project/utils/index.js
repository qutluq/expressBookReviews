const compareNames = (name1, name2) => name1.toLowerCase().trim() === name2.toLowerCase().trim()

const userExists = (users, username) => {
    let filteredUsers = users.filter((user) => {
      return compareNames(user.username, username);
    });
    return filteredUsers.length > 0;
  };

  const userCredentialsAreValid = (users, username, password) => {
    let filteredUsers = users.filter((user) => {
      return compareNames(user.username, username);
    });
    return filteredUsers.length > 0 && filteredUsers[0].password === password;
  };

module.exports = {compareNames, userExists, userCredentialsAreValid}