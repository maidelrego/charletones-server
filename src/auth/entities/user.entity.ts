import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    default: null,
  })
  cloudinary_id: string;

  @Column('text', {
    default: null,
  })
  avatar: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('boolean', {default: true})
  isActive = true;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles = ['user'];

  // @OneToMany(() => Product, (product) => product.user)
  // product: Product;

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
