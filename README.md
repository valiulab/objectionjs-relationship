# 🚀 Relation maker for Objection.js

[![npm](https://img.shields.io/npm/v/objectionjs-relationship.svg?style=flat-square)](https://npmjs.org/package/objectionjs-relationship)

This plugin provide a way to create relationship objects between [Objection.js](https://github.com/Vincit/objection.js/) models.

## Doc

For more documentation, you can view the [Github page](https://valiulab.github.io/objectionjs-relationship/) of this repository.

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

class Animal extends Model {
  static tableName = "animals";
}

class Person extends Model {
  static tableName = "persons";

  /** Example 1: */
  static relationMappings = new ModelRelationshipFacade(Person)
    .belongsToOne(Animal)
    .getRelationships();

  /** Example 2: Or you can use the add function, sending the relation type */
  static relationMappings = new ModelRelationshipFacade(Person)
    .add(Animal, RelationshipEnum.BelongsToOneRelation)
    .getRelationships();

  // Result:
  // static relationMappings: {
  //     animal: {
  //         relation: Model.BelongsToOneRelation,
  //         modelClass: Animal,
  //         join: {
  //             from: 'persons.animalId',
  //             to: 'animals.id'
  //         }
  //     }
  // }
}
```

#### Chaining Relationships

```js
// Thoses Models are example models like Person or Animal.

/** Example 1 */
const relation = new ModelRelationshipFacade(Person)
  .belongsToOne(Country)
  .hasMany(Animal)
  .hasOne(Contact)
  .manyToMany(Activity)
  .hasOneThrough(Vehicle);
  .getRelationships();

/** Example 2 */
const relationWithAddFunction = new ModelRelationshipFacade(Person)
  .add(Country, RelationshipEnum.BelongsToOneRelation)
  .add(Animal, RelationshipEnum.HasManyRelation)
  .add(Contact, RelationshipEnum.HasOneRelation)
  .add(Activity, RelationshipEnum.ManyToManyRelation)
  .add(Vehicle, RelationshipEnum.HasOneThroughRelation)
  .getRelationships();

// Output:
// {
//   country: {
//       relation: Model.BelongsToOneRelation,
//       modelClass: Country,
//       join: {
//           from: 'persons.countryId',
//           to: 'countries.id'
//       }
//   },
//   animals: {
//       relation: Model.HasManyRelation,
//       modelClass: Animal,
//       join: {
//           from: 'persons.id',
//           to: 'animals.personId'
//       }
//   },
//   contact: {
//       relation: Model.HasOneRelation,
//       modelClass: Contact,
//       join: {
//           from: 'persons.id',
//           to: 'contacts.personId'
//       }
//   },
//   activities: {
//       relation: Model.ManyToManyRelation,
//       modelClass: Activity,
//       join: {
//           from: 'persons.id',
//           through: {
//               from: 'activities_persons.personId',
//               to: 'activities_persons.activityId'
//           },
//           to: 'activities.id'
//       }
//   },
//   vehicle: {
//       relation: Model.HasOneThroughRelation,
//       modelClass: Vehicle,
//       join: {
//           from: 'persons.id',
//           through: {
//               from: 'persons_vehicles.personId',
//               to: 'persons_vehicles.vehicleId'
//           },
//           to: 'vehicles.id'
//       }
//   }
// };
```

## Options

**IObjectionModelRelationshipAddConfig:** This interface are the option that you can send to the add function and override the relation fields.

These options can be provided when instantiating the plugin.

#### Example 1

```js
import { ModelRelationshipFacade } from "objectionjs-relationship";

class Animal extends Model {
  static tableName = "pets";
}

class Person extends Model {
  static tableName = "owners";

  static relationMappings = new ModelRelationshipFacade(Person)
    .belongsToOne(Animal, {
      relationName: "pet",
      fromField: "petId",
      fromTable: "owners",
      toField: "superId",
      toTable: "pets",
    })
    .getRelationships();

  // Result:
  // static relationMappings: {
  //   pet: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Animal,
  //       join: {
  //           from: 'owners.petId',
  //           to: 'pets.superId'
  //       }
  //   }
  // }
}
```

#### Example 2

```js
import { ModelRelationshipFacade } from "objectionjs-relationship";

class Animal extends Model {
  static tableName = "pets";
}

class Person extends Model {
  static tableName = "owners";

  static relationMappings = new ModelRelationshipFacade(Person)
    .belongsToOne(Animal, {
      relationName: "pet",
      from: "owners.petId",
      to: "pets.superId",
    })
    .getRelationships();

  // Result:
  // static relationMappings: {
  //   pet: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Animal,
  //       join: {
  //           from: 'owners.petId',
  //           to: 'pets.superId'
  //       }
  //   }
  // }
}
```

The same can be done with _through_ relationship. Read the _IObjectionModelRelationshipAddConfig_ interface.

### Debugger helper

You can send a options object to the **getRelationships**, witch one of the props is **log**

This was created for the purpose of testing. Log param can be a boolean or a function that will get an IObjectionModelRelationship as a parameter to do whatever the function wants to do with the data, like print with a custom logger or something.

```js
import {
  ModelRelationshipFacade,
  IObjectionModelRelationship,
} from "objectionjs-relationship";

class Animal extends Model {
  static tableName = "animals";
}

class Person extends Model {
  static tableName = "persons";

  /** Example with default logger */
  static relationMappings = new ModelRelationshipFacade(Person)
    .belongsToOne(Animal)
    .getRelationships({
      log: true,
    });

  /** Example with custom log strategy */
  static relationMappings = new ModelRelationshipFacade(Person)
    .belongsToOne(Animal)
    .getRelationships({
      log: (relations: IObjectionModelRelationship<Animal>) => {
        // You can same logger or wathever you want
        console.log(relations);
      },
    });
}
```

The terminal will show _(console.log as default)_:

```
{
    animal: {
        relation: Model.BelongsToOneRelation,
        modelClass: Animal,
        join: {
            from: 'animals.personId',
            to: 'persons.id'
        }
    }
}
```

## Tests

Run the tests from the root directory:

```sh
npm test
```

## Contributing & Development

### Contributing

Found a bug or want to suggest something? Take a look first on the current and closed [issues](https://github.com/valiulab/objectionjs-relationship/issues). If it is something new, please [submit an issue](https://github.com/valiulab/objectionjs-relationship/issues/new).

### Develop

It will be awesome if you can help us evolve `objectionjs-relationship`. Want to help?

1. [Fork it](https://github.com/valiulab/objectionjs-relationship).

2. `npm install`.

3. Hack away.

4. Run the tests: `npm test`.

5. Create a [Pull Request](https://github.com/valiulab/objectionjs-relationship/compare).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
