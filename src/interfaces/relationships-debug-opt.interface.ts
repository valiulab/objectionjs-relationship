import { Model } from "objection";
import { IObjectionModelRelationship } from "./relationships.interface";

export interface IRelationshipDebugOptions<T extends Model> {
  log?: ((data: IObjectionModelRelationship<T>) => any) | boolean
}