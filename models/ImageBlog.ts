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
import { Blog } from "./Blog";
import { Sequelize } from "sequelize-typescript";

@Table({
  tableName: 'imageblogs'
})
export class ImageBlog extends Model {
  @Column({ type: DataType.STRING })
  public link!: string;

  @ForeignKey(() => Blog)
  @Column({ type: DataType.INTEGER })
  public blogId!: number

  @BelongsTo(() => Blog)
  public blog?: Blog[]
}
