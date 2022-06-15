import { Model, RelationType, ModelClass } from 'objection';

export interface IObjectionModelRelationship<T extends Model> {
    [key: string]: IObjectionModelRelationshipSchema<T>,
}

export interface IObjectionModelRelationshipSchemaJoin {
    from: string | string[],
    through?: {
        from?: string | string[];
        to?: string | string[];
    },
    to: string | string[];
}

export interface IObjectionModelRelationshipSchema<T extends Model> {
    relation: RelationType;
    modelClass: ModelClass<T> | string;
    join: IObjectionModelRelationshipSchemaJoin
}

export interface IObjectionModelRelationshipAddConfig extends Partial<Omit<IObjectionModelRelationshipSchemaJoin, 'relation' | 'modelClass'>> {
    fromTable?: string;
    toTable?: string;
    fromField?: string;
    toField?: string;
    relationName?: string;
}
