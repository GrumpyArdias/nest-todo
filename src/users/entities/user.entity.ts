import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mail: string;

  @Column()
  password: string;

  constructor(id: number, name: string, mail: string, password: string) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.password = password;
  }
}
