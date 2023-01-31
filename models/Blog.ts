import {
  Table,
  Column,
  DataType,
  IsEmail,
  HasMany,
  BelongsTo,
  ForeignKey,
  Model,
} from "sequelize-typescript";
import { User } from "./User";
import { Sequelize } from "sequelize-typescript";

@Table({
  tableName: "blogs",
})
export class Blog extends Model {
  @Column({ type: DataType.STRING })
  public title!: string;

  @Column({ type: DataType.STRING })
  public description: string;

  @Column({ type: DataType.TEXT('long') })
  public content!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  public userId!: number;

  @Column({ type: DataType.INTEGER })
  public count_view!: number;

  @Column({ type: DataType.STRING })
  public thumbmail!: string;

  @BelongsTo(() => User)
  public user?: User[];
}