import { Model, RelationType, ModelClass } from 'objection';

export interface IObjectionModelRelationship<T extends Model> {
    [key: string]: IObjectionModelRelationshipSchema<T>,
}

export interface IObjectionModelRelationshipSchema<T extends Model> {
    relation: RelationType;
    modelClass: ModelClass<T> | string;
    join: {
        from: string,
        through?: {
            from?: string;
            to?: string;
        },
        to: string;
    }
}

export interface IObjectionModelRelationshipAddConfig {
    from?: string;
    through?: {
        from?: string;
        to?: string;
    }
    to?: string;
    fromTable?: string;
    toTable?: string;
    fromField?: string;
    toField?: string;
}
