const lodash = require('lodash');

const ACCESS_CONTROL = 'AccessControl';
const USER_ROLES = 'UserRoles';
const USER_ROLE = 'UserRole';
const CRUD = 'CRUD';

const transform = json => {
  const newJson = [];

  json.forEach(obj => {
    const accessControl = obj[ACCESS_CONTROL];
    const usersRoles = obj[USER_ROLES];

    if (accessControl) {
      if (!lodash.isArray(accessControl) || lodash.isEmpty(accessControl)) {
        throw new Error(`${ACCESS_CONTROL} must be non empty array.`);
      }

      if (obj[USER_ROLE]) {
        throw new Error(`${ACCESS_CONTROL} and ${USER_ROLE} not allowed on the same element.`);
      }

      if (obj[CRUD]) {
        throw new Error(`${ACCESS_CONTROL} and ${CRUD} not allowed on the same element.`);
      }

      accessControl.forEach(ac => {
        const usersRoles = ac[USER_ROLES];
        const crud = ac[CRUD];

        if (!lodash.isArray(usersRoles) || lodash.isEmpty(usersRoles)) {
          throw new Error(`${ACCESS_CONTROL} requires non empty ${USER_ROLES} array.`);
        }

        if (lodash.isEmpty(crud)) {
          throw new Error(`${ACCESS_CONTROL} requires non empty ${CRUD} field.`);
        }

        usersRoles.forEach(userRole => newJson.push(
          lodash(obj)
            .omit(ACCESS_CONTROL)
            .assign(
              {
                [USER_ROLE]: userRole,
                [CRUD]: crud
              })
            .value()));
      });
    } else if (usersRoles) {
      if (!lodash.isArray(usersRoles) || lodash.isEmpty(usersRoles)) {
        throw new Error(`${USER_ROLES} must be non empty array.`);
      }

      if (obj[USER_ROLE]) {
        throw new Error(`${USER_ROLES} and ${USER_ROLE} not allowed on the same element.`);
      }

      const crud = obj[CRUD];

      usersRoles.forEach(userRole => newJson.push(
        lodash(obj)
          .omit(USER_ROLES)
          .assign(
            {
              [USER_ROLE]: userRole,
              [CRUD]: crud
            })
          .value()));
    } else {
      newJson.push(obj);
    }
  });

  return newJson;
};

module.exports = {
  transform
};
