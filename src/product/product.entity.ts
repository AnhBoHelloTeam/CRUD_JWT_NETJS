import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from '../order/order.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  stock: number;

  @ManyToMany(() => Order, (order) => order.products)
  @JoinTable()
  orders: Order[];
}
