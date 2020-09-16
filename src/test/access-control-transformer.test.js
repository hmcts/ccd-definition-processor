const assert = require('assert').strict;
const accessControlTransformer = require('../main/lib/access-control-transformer');

describe('Access control transformer', () => {

  it('should do nothing if AccessControl and UserRoles are not present', () => {
    const json = [
      {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role1', 'CRUD': 'CD'},
    ];

    const transformedJson = accessControlTransformer.transform(json);
    assert.deepEqual(transformedJson, json);
  });

  describe('UserRoles', () => {
    it('should expand UserRoles', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'UserRoles': ['role1', 'role2'],
          'CRUD': 'CD'
        },
      ];

      const expectedJson = [
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role1', 'CRUD': 'CD'},
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role2', 'CRUD': 'CD'},
      ];

      assert.deepEqual(accessControlTransformer.transform(json), expectedJson);
    });

    it('should throw error when UserRoles is not an array', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'UserRoles': 'role1,role2',
          'CRUD': 'CD'
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('UserRoles must be non empty array.'));
    });

    it('should throw error when UserRoles is empty array', () => {
      const json = [
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRoles': [], 'CRUD': 'CD'},
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('UserRoles must be non empty array.'));
    });

    it('should throw error when UserRoles and UserRole at the same element', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'UserRoles': ['role1'],
          'UserRole': 'role2',
          'CRUD': 'CD'
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('UserRoles and UserRole not allowed on the same element.'));
    });
  });

  describe('AccessControl', () => {
    it('should expand AccessControl', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'AccessControl': [
            {
              'UserRoles': ['role1', 'role2'],
              'CRUD': 'CR'
            },
            {
              'UserRoles': ['role3'],
              'CRUD': 'U'
            }
          ]
        },
      ];

      const expectedJson = [
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role1', 'CRUD': 'CR'},
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role2', 'CRUD': 'CR'},
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'UserRole': 'role3', 'CRUD': 'U'},
      ];

      const transformedJson = accessControlTransformer.transform(json);
      assert.deepEqual(transformedJson, expectedJson);
    });

    it('should throw error when AccessControl is not an array', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': 'role1,role2',
          'CRUD': 'CD'
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl must be non empty array.'));
    });

    it('should throw error when AccessControl is empty array', () => {
      const json = [
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'AccessControl': [], 'CRUD': 'CD'},
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl must be non empty array.'));
    });

    it('should throw error when AccessControl does not have UserRoles filed', () => {
      const json = [
        {'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name', 'AccessControl': [{}]},
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl requires non empty UserRoles array.'));
    });

    it('should throw error when AccessControl does not have CRUD field', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': [{'UserRoles': ''}]
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl requires non empty UserRoles array.'));
    });

    it('should throw error when AccessControl has empty UserRoles filed', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': [{'UserRoles': []}]
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl requires non empty UserRoles array.'));
    });

    it('should throw error when AccessControl does not have CRUD element', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': [{'UserRoles': ['role1']}]
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl requires non empty CRUD field.'));
    });

    it('should throw error when AccessControl and UserRole present at the same element', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': [{'UserRoles': ['role1'], 'CRUD': 'R'}],
          'UserRole': 'role1'
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl and UserRole not allowed on the same element.'));
    });

    it('should throw error when AccessControl and CRUD present at the same element', () => {
      const json = [
        {
          'LiveFrom': '01/01/2017',
          'LiveTo': '01/01/2017',
          'ID': 1,
          'Name': 'name',
          'AccessControl': [{'UserRoles': ['role1'], 'CRUD': 'R'}],
          'CRUD': 'R'
        },
      ];

      assert.throws(() => accessControlTransformer.transform(json), new Error('AccessControl and CRUD not allowed on the same element.'));
    });

  });

});
