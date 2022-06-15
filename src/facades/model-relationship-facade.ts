import { IRelationshipDebugOptions } from './../interfaces/relationships-debug-opt.interface';
import { RelationshipEnum } from '../enums/relationship.enum';
import { StringUtils } from '../utils/string.utils';
import { Model, ModelClass, RelationType } from 'objection';
import { IObjectionModelRelationship, IObjectionModelRelationshipAddConfig, IObjectionModelRelationshipSchema } from '../interfaces/relationships.interface';
import _ from 'underscore'

export class ModelRelationshipFacade<T extends Model> {
    private _relationshipModel: IObjectionModelRelationship<T> = {};

    constructor(private _modelClass: ModelClass<T>) { }

    set model(modelClass: ModelClass<T>) {
        this._modelClass = modelClass;
    }

    /**
     * Return the relationship model created from adding relationship on "Add" method
     *
     * @return {*}  {IObjectionModelRelationship<T>}
     * @memberof ModelRelationshipFacade
     */
    public getRelationships(opt?: IRelationshipDebugOptions<T>): IObjectionModelRelationship<T> {
        if (opt) {
            _.isFunction(opt?.log)
                ? opt.log(this._relationshipModel)
                : console.log(this._relationshipModel);
        }
        return this._relationshipModel;
    }

    /**
     * Return the name of the relationship between the origin model to the end model.
     * This is created based on the relationship between them.
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @param {RelationshipEnum} relation
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    private getRelationshipName(modelClass: ModelClass<T> | string, relation: RelationshipEnum): string {
        if (modelClass instanceof String || typeof modelClass == 'string')
            return modelClass.toString();
        return relation == RelationshipEnum.HasManyRelation || relation == RelationshipEnum.ManyToManyRelation
            ? StringUtils.pluralize(StringUtils.toLowerFirstLetter(modelClass.name)) //this.pluralizeByRelationship(modelClass.name, relation)
            : StringUtils.toLowerFirstLetter(modelClass.name);
    }

    /**
     * Return the field name of of the foreign key
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    private getForeignKeyFieldName(modelClass: ModelClass<T> | string): string {
        return modelClass instanceof String || typeof modelClass == 'string'
            ? modelClass.toString()
            : `${StringUtils.toLowerFirstLetter(modelClass.name)}Id`;
    }

    /**
     * Return the field name of "from" prop of "join" section
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @param {RelationshipEnum} relation
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    private getFromField(modelClass: ModelClass<T> | string, relation: RelationshipEnum): string {
        if (relation != RelationshipEnum.BelongsToOneRelation)
            return 'id';

        return this.getForeignKeyFieldName(modelClass);
    }

    /**
     * Return the field name of "to" prop of "join" section
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @param {RelationshipEnum} relation
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    private geToField(modelClass: ModelClass<T> | string, relation: RelationshipEnum): string {
        if (relation != RelationshipEnum.HasManyRelation && relation != RelationshipEnum.HasOneRelation)
            return 'id';

        return this.getForeignKeyFieldName(modelClass);
    }

    /**
     * Get the table name of the static prop in ModelClass
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    private getTableName(modelClass: ModelClass<T> | string): string {
        return modelClass instanceof String || typeof modelClass == 'string'
            ? modelClass.toString()
            : modelClass.tableName;
    }

    /**
     * Get the many to many table name (table1_table2)
     *
     * @private
     * @param {(ModelClass<T> | string)} modelClass
     * @return {*}  {string}
     * @memberof ModelRelationshipFacade
     */
    public getThroughTable(modelClass: ModelClass<T> | string, optModelClass?: ModelClass<T>): string {
        return StringUtils.orderAlphabetically([
            optModelClass ? optModelClass.tableName : this._modelClass.tableName,
            this.getTableName(modelClass)
        ]).join('_');
    }

    /**
     * Return model RelationType based on the enum
     *
     * @param {RelationshipEnum} relationshipEnum
     * @return {*}  {RelationType}
     * @memberof ModelRelationshipFacade
     */
    public getRelationshipType(relationshipEnum: RelationshipEnum): RelationType {
        let relation: RelationType;
        switch (relationshipEnum) {
            case RelationshipEnum.BelongsToOneRelation:
                relation = Model.BelongsToOneRelation;
                break;
            case RelationshipEnum.HasManyRelation:
                relation = Model.HasManyRelation;
                break;
            case RelationshipEnum.HasOneRelation:
                relation = Model.HasOneRelation;
                break;
            case RelationshipEnum.ManyToManyRelation:
                relation = Model.ManyToManyRelation;
                break;
            case RelationshipEnum.HasOneThroughRelation:
                relation = Model.HasOneThroughRelation;
                break;
            default:
                throw new Error('Invalid relationship schema.')
        }
        return relation;
    }

    /**
     * Create a relationship and add it inside of the class, saving the relationship mapping model inside.
     * It will be able to get from the getter.
     * Return the same class for chaining pattern.
     *
     * @param {(ModelClass<T> | string)} modelClass
     * @param {RelationshipEnum} relationshipTypeEnum
     * @param {IObjectionModelRelationshipAddConfig} [config]
     * @return {ModelRelationshipFacade}  {this}
     * @memberof ModelRelationshipFacade
     */
    public add(modelClass: ModelClass<T> | string, relationshipTypeEnum: RelationshipEnum, config?: IObjectionModelRelationshipAddConfig): this {
        if (((modelClass instanceof String || typeof modelClass == 'string') && !modelClass) || !(modelClass as ModelClass<T>).tableName)
            throw new Error('Model class param is empty or do not have tableName defined');

        if (!this._modelClass.tableName)
            throw new Error('Base Model class passed on constructor do not have tableName defined');

        const {
            fromTable,
            toTable,
            fromField,
            toField,
            relationName,
            ...joinConfig
        } = config || {}

        const finalFromTable = fromTable ?? this._modelClass.tableName;
        const finalToTable = toTable ?? this.getTableName(modelClass);
        const finalFromField = fromField ?? this.getFromField(modelClass, relationshipTypeEnum);
        const finalToField = toField ?? this.geToField(this._modelClass, relationshipTypeEnum);
        const relation: RelationType = this.getRelationshipType(relationshipTypeEnum);
        const relationship: IObjectionModelRelationshipSchema<T> = {
            relation,
            modelClass,
            join: {
                from: `${finalFromTable}.${finalFromField}`,
                to: `${finalToTable}.${finalToField}`,
                ...joinConfig,
            }
        }

        if (relationshipTypeEnum == RelationshipEnum.ManyToManyRelation || relationshipTypeEnum == RelationshipEnum.HasOneThroughRelation) {
            const throughTable = this.getThroughTable(modelClass);
            relationship.join = {
                ...relationship.join,
                through: {
                    from: `${throughTable}.${this.getForeignKeyFieldName(this._modelClass)}`,
                    to: `${throughTable}.${this.getForeignKeyFieldName(modelClass)}`,
                    ...joinConfig?.through
                }
            }
        }

        this._relationshipModel[relationName || this.getRelationshipName(modelClass, relationshipTypeEnum)] = relationship;

        return this;
    }

    /**
     * Shortcut for RelationshipEnum.BelongsToOneRelation
     *
     * @param {(ModelClass<T> | string)} modelClass
     * @param {IObjectionModelRelationshipAddConfig} [config]
     * @return {ModelRelationshipFacade}  {this}
     * @memberof ModelRelationshipFacade
     */
    public belongsToOne(modelClass: ModelClass<T> | string, config?: IObjectionModelRelationshipAddConfig): this {
        return this.add(modelClass, RelationshipEnum.BelongsToOneRelation, config);
    }

    /**
     * Shortcut for RelationshipEnum.HasManyRelation
     *
     * @param {(ModelClass<T> | string)} modelClass
     * @param {IObjectionModelRelationshipAddConfig} [config]
     * @return {ModelRelationshipFacade}  {this}
     * @memberof ModelRelationshipFacade
     */
    public hasMany(modelClass: ModelClass<T> | string, config?: IObjectionModelRelationshipAddConfig): this {
        return this.add(modelClass, RelationshipEnum.HasManyRelation, config);
    }

    /**
    * Shortcut for RelationshipEnum.HasOneRelation
    *
    * @param {(ModelClass<T> | string)} modelClass
    * @param {IObjectionModelRelationshipAddConfig} [config]
    * @return {ModelRelationshipFacade}  {this}
    * @memberof ModelRelationshipFacade
    */
    public hasOne(modelClass: ModelClass<T> | string, config?: IObjectionModelRelationshipAddConfig): this {
        return this.add(modelClass, RelationshipEnum.HasOneRelation, config);
    }

    /**
    * Shortcut for RelationshipEnum.ManyToManyRelation
    *
    * @param {(ModelClass<T> | string)} modelClass
    * @param {IObjectionModelRelationshipAddConfig} [config]
    * @return {ModelRelationshipFacade}  {this}
    * @memberof ModelRelationshipFacade
    */
    public manyToMany(modelClass: ModelClass<T> | string, config?: IObjectionModelRelationshipAddConfig): this {
        return this.add(modelClass, RelationshipEnum.ManyToManyRelation, config);
    }

    /**
     * Shortcut for RelationshipEnum.HasOneThroughRelation
     *
     * @param {(ModelClass<T> | string)} modelClass
     * @param {IObjectionModelRelationshipAddConfig} [config]
     * @return {ModelRelationshipFacade}  {this}
     * @memberof ModelRelationshipFacade
     */
    public hasOneThrough(modelClass: ModelClass<T> | string, config?: IObjectionModelRelationshipAddConfig): this {
        return this.add(modelClass, RelationshipEnum.HasOneThroughRelation, config);
    }
}