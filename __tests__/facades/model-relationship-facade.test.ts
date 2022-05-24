import { ModelRelationshipFacade } from './../../src/facades/model-relationship-facade';
import { Model } from 'objection';
import { RelationshipEnum } from '../../src/enums/relationship.enum';

class Person extends Model {
    static tableName = 'persons';
}

class Animal extends Model {
    static tableName = 'animals';
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
});