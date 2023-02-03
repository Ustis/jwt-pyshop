import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// По dupal address field https://www.drupal.org/project/addressfield
@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //Страна
  @Column({ nullable: false })
  country: string;

  //Область/штат/провинция/регион
  @Column({ nullable: false })
  administrativeArea: string;

  //Город/населенный пункт
  @Column({ nullable: false })
  locality: string;

  //Улица
  @Column({ nullable: false })
  street: string;

  //Квартира/дом
  @Column({ nullable: false })
  premise: string;

  //Почтовый код
  @Column({ nullable: false })
  postalCode: string;
}
