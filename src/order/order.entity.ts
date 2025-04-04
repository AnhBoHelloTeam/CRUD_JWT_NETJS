import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from '../product/product.entity';

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  customerName: string;

  @Column()
  @Field(() => Int)
  totalPrice: number;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable()
  @Field(() => [Product])
  products: Product[];
}
