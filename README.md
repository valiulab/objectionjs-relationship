# :rocket: Relation maker for Objection.js

[![npm](https://img.shields.io/npm/v/objectionjs-relationship.svg?style=flat-square)](https://npmjs.org/package/objectionjs-relationship)

This plugin provide a way to create relationship objects between [Objection.js](https://github.com/Vincit/objection.js/) models.

## Doc

For more documentation, you can view the [Github page](https://valiulab-core.github.io/objectionjs-relationship/) of this repository.

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
// Thoses Models are example models like Person or Animal.

const relation = new ModelRelationshipFacade(Person)
  .add(Country, RelationshipEnum.BelongsToOneRelation)
  .add(Animal, RelationshipEnum.HasManyRelation)
  .add(Contact, RelationshipEnum.HasOneRelation)
  .add(Activity, RelationshipEnum.ManyToManyRelation)
  .add(Vehicle, RelationshipEnum.HasOneThroughRelation)
  .getRelationships();

console.log(relation);
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
