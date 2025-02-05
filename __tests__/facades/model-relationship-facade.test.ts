import { Model } from 'objection';
import { RelationshipEnum } from '../../src/enums/relationship.enum';
import { ModelRelationshipFacade } from './../../src/facades/model-relationship-facade';

class Person extends Model {
    static tableName = 'persons';
}

class Animal extends Model {
    static tableName = 'animals';
}

class Country extends Model {
    static tableName = 'countries';
}

class Contact extends Model {
    static tableName = 'contacts';
}

class Activity extends Model {
    static tableName = 'activities';
}

class Vehicle extends Model {
    static tableName = 'vehicles';
}


describe("[Main Facade Test]", () => {

    it("should return BelongsToOneRelation relationship object", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.add(Animal, RelationshipEnum.BelongsToOneRelation);
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animal: {
                relation: Model.BelongsToOneRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.animalId',
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return BelongsToOneRelation relationship object and log it", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.belongsToOne(Animal);
        expect(modelRelationshipFacade.getRelationships({
            log: (relations) => {
                console.log(relations);
            },
        })).toEqual({
            animal: {
                relation: Model.BelongsToOneRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.animalId',
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return BelongsToOneRelation relationship object with specific relation name", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.belongsToOne(Animal, { relationName: 'pet' });
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            pet: {
                relation: Model.BelongsToOneRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.animalId',
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return BelongsToOneRelation relationship object with specific relation name and specific base fields", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.belongsToOne(Animal, {
            relationName: 'pet',
            fromField: 'petId',
            fromTable: 'owners',
            toField: 'superId',
            toTable: 'pets',
        });
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            pet: {
                relation: Model.BelongsToOneRelation,
                modelClass: Animal,
                join: {
                    from: 'owners.petId',
                    to: 'pets.superId'
                }
            }
        });
    });

    it("should return BelongsToOneRelation relationship object with specific relation name and specific fields of join", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.belongsToOne(Animal, {
            relationName: 'pet',
            from: 'owners.petId',
            to: 'pets.superId'
        });
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            pet: {
                relation: Model.BelongsToOneRelation,
                modelClass: Animal,
                join: {
                    from: 'owners.petId',
                    to: 'pets.superId'
                }
            }
        });
    });

    it("should return HasManyRelation relationship object", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.add(Animal, RelationshipEnum.HasManyRelation);
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animals: {
                relation: Model.HasManyRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.id',
                    to: 'animals.personId'
                }
            }
        });
    });

    it("should return HasOneRelation relationship object", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.add(Animal, RelationshipEnum.HasOneRelation);
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animal: {
                relation: Model.HasOneRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.id',
                    to: 'animals.personId'
                }
            }

        });
    });

    it("should return ManyToManyRelation relationship object", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.add(Animal, RelationshipEnum.ManyToManyRelation);
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animals: {
                relation: Model.ManyToManyRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.id',
                    through: {
                        // persons_animals is the join table.
                        from: 'animals_persons.personId',
                        to: 'animals_persons.animalId'
                    },
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return HasOneThroughRelation relationship object", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.add(Animal, RelationshipEnum.HasOneThroughRelation);
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animal: {
                relation: Model.HasOneThroughRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.id',
                    through: {
                        // persons_animals is the join table.
                        from: 'animals_persons.personId',
                        to: 'animals_persons.animalId'
                    },
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return HasOneThroughRelation relationship object with specific relation through", () => {
        const modelRelationshipFacade = new ModelRelationshipFacade(Person);
        modelRelationshipFacade.hasOneThrough(Animal, {
            through: {
                from: 'pets_owners.ownerId',
                to: 'pets_owners.petId',
            }
        });
        expect(modelRelationshipFacade.getRelationships()).toEqual({
            animal: {
                relation: Model.HasOneThroughRelation,
                modelClass: Animal,
                join: {
                    from: 'persons.id',
                    through: {
                        // persons_animals is the join table.
                        from: 'pets_owners.ownerId',
                        to: 'pets_owners.petId'
                    },
                    to: 'animals.id'
                }
            }
        });
    });

    it("should return all relationships object", () => {
        expect(new ModelRelationshipFacade(Person)
            .add(Country, RelationshipEnum.BelongsToOneRelation)
            .add(Animal, RelationshipEnum.HasManyRelation)
            .add(Contact, RelationshipEnum.HasOneRelation)
            .add(Activity, RelationshipEnum.ManyToManyRelation)
            .add(Vehicle, RelationshipEnum.HasOneThroughRelation).getRelationships())
            .toEqual({
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
                            from: 'persons_vehicles.personId',
                            to: 'persons_vehicles.vehicleId'
                        },
                        to: 'vehicles.id'
                    }
                }
            });
    });

    it("should return all relationships object based in shortcuts", () => {
        expect(new ModelRelationshipFacade(Person)
            .belongsToOne(Country)
            .hasMany(Animal)
            .hasOne(Contact)
            .manyToMany(Activity)
            .hasOneThrough(Vehicle).getRelationships())
            .toEqual({
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
                            from: 'persons_vehicles.personId',
                            to: 'persons_vehicles.vehicleId'
                        },
                        to: 'vehicles.id'
                    }
                }
            });
    });
});
