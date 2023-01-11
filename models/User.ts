import {
  Table,
  Column,
  DataType,
  HasMany,
  Model,
  BelongsToMany
} from "sequelize-typescript";
import { UserGroupAssociation } from "./UserGroupAssociation";
import { Group } from "./Group";
import { Sequelize } from "sequelize-typescript";
import { Blog } from "./Blog";
import { MinLength, MaxLength, IsNotEmpty, IsEmail, IsEmpty, minLength} from "class-validator";

@Table({
  tableName: "users",
})
export class User extends Model {
  @Column({ type: DataType.STRING })
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  public name!: string;

  @IsEmail({}, {
    message: 'Định dạng email không hợp lệ!'
  })
  @Column({ type: DataType.STRING })
  @MinLength(7, {
    message: 'Email không được ít hơn 7 ký tự'
  })
  
  @Column({ unique: true, type: DataType.STRING })
  @MaxLength(255)
  public email!: string;

  @Column({ type: DataType.STRING })
  @MinLength(6, {
    message: 'Mật khẩu phải dài hơn 6 ký tự'
  })
  @MaxLength(30)
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống'
  })
  public password!: string;

  @Column({ type: DataType.DATE })
  public createdAt!: Date;

  @Column({ type: DataType.DATE })
  public updatedAt!: Date;

  @HasMany(() => UserGroupAssociation)
  public userGroupAssociation?: UserGroupAssociation[];

  @BelongsToMany(() => Group, {
    through: { model: () => UserGroupAssociation },
  })
  public group?: Group[];

  @HasMany(() => Blog)
  public blog?: Blog[]
}