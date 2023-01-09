import {
  Table,
  Column,
  DataType,
  IsEmail,
  HasMany,
  Model,
} from "sequelize-typescript";
import { UserGroupAssociation } from "./UserGroupAssociation";

@Table({
  tableName: "user",
})
export class User extends Model {
  @Column({ type: DataType.STRING })
  public name!: string;

  @IsEmail
  @Column({ type: DataType.STRING })
  public email!: string;

  @Column({ type: DataType.STRING })
  public password!: string;

  @Column({ type: DataType.DATE })
  public createdAt!: Date;

  @Column({ type: DataType.DATE })
  public updatedAt!: Date;

  @Column({ type: DataType.DATE })
  public deleteAt!: Date;

  @HasMany(() => UserGroupAssociation)
  public userGroupAssociation?: UserGroupAssociation[];
}