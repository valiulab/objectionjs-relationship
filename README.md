# Relation maker for Objection.js

[![npm](https://img.shields.io/npm/v/objectionjs-relationship.svg?style=flat-square)](https://npmjs.org/package/objectionjs-relationship)

![node](https://img.shields.io/node/v/objectionjs-relationship.svg?style=flat-square)

[![Build Status](https://img.shields.io/travis/seegno/objectionjs-relationship/main.svg?style=flat-square)](https://travis-ci.org/seegno/objectionjs-relationship)

[![Coverage Status](https://img.shields.io/coveralls/seegno/objectionjs-relationship/main.svg?style=flat-square)](https://coveralls.io/github/seegno/objectionjs-relationship?branch=main)

This plugin provide a way to create relationship objects between [Objection.js](https://github.com/Vincit/objection.js/) models.

## Installation

### NPM

```sh

npm i objectionjs-relationship --save

```

### Yarn

```sh

yarn add objectionjs-relationship

```

## Usage

#### Basic Use

```js
import {
  ModelRelationshipFacade,
  RelationshipEnum,
} from "objectionjs-relationship";

class Person extends Model {
  static tableName = "persons";
}

class Animal extends Model {
  static tableName = "animals";

  static relationMappings = new ModelRelationshipFacade(Animal)
    .add(Person, RelationshipEnum.BelongsToOneRelation)
    .getRelationships();

  // static relationMappings: {
  //     animal: {
  //         relation: Model.BelongsToOneRelation,
  //         modelClass: Animal,
  //         join: {
  //             from: 'animals.personId',
  //             to: 'persons.id'
  //         }
  //     }
  // }
}
```

#### Chaining Relationships

```js
// Those are Example models like Person or Animal

const relation = new ModelRelationshipFacade(Person)
    .add(Country, RelationshipEnum.BelongsToOneRelation)
    .add(Animal, RelationshipEnum.HasManyRelation)
    .add(Contact, RelationshipEnum.HasOneRelation)
    .add(Activity, RelationshipEnum.ManyToManyRelation)
    .add(Vehicle, RelationshipEnum.HasOneThroughRelation)
    .getRelationships();

console.log(relation);
Output:
{
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'persons.countryId',
        to: 'countries.id'
      }
    },
    animals: {
      relation: Model.HasManyRelation,
      modelClass: Animal,
      join: {
        from: 'persons.id',
        to: 'animals.personId'
      }
    },
    contact: {
      relation: Model.HasOneRelation,
      modelClass: Contact,
      join: {
        from: 'persons.id',
        to: 'contacts.personId'
      }
    },
    activities: {
      relation: Model.ManyToManyRelation,
      modelClass: Activity,
      join: {
        from: 'persons.id',
        through: {
          // activities_persons is the join table.
          from: 'activities_persons.personId',
          to: 'activities_persons.activityId'
        },
        to: 'activities.id'
      }
    },
    vehicle: {
      relation: Model.HasOneThroughRelation,
      modelClass: Vehicle,
      join: {
        from: 'persons.id',
        through: {
          // activities_persons is the join table.
          from: 'activities_persons.personId',
          to: 'activities_persons.activityId'
        },
        to: 'vehicles.id'
      }
    }
};

```

## Options

**IObjectionModelRelationshipAddConfig:** This interface is the option object that you can send to the add function and override the relation fields.

These options can be provided when instantiating the plugin:

## Tests

Run the tests from the root directory:

```sh

npm test

```

## Contributing & Development

### Contributing

Found a bug or want to suggest something? Take a look first on the current and closed [issues](https://github.com/valiulab-core/objectionjs-relationship/issues). If it is something new, please [submit an issue](https://github.com/valiulab-core/objectionjs-relationship/issues/new).

### Develop

It will be awesome if you can help us evolve `objectionjs-relationship`. Want to help?

1. [Fork it](https://github.com/valiulab-core/objectionjs-relationship).

2. `npm install`.

3. Hack away.

4. Run the tests: `npm test`.

5. Create a [Pull Request](https://github.com/valiulab-core/objectionjs-relationship/compare).