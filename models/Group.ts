import { Table, Column, DataType, Model, HasMany } from "sequelize-typescript";
import { UserGroupAssociation } from "./UserGroupAssociation";

@Table({
  tableName: "groups",
})
export class Group extends Model {
  @Column({ type: DataType.STRING })
  public name!: string;

  @HasMany(() => UserGroupAssociation)
  public userGroupAssociation?: UserGroupAssociation[];
}