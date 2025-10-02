import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1663143462582 implements MigrationInterface {
  name = 'init1663143462582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loyalty" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "point" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_327d399b9ca75dd638ccbd4b991" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "dateOfBirth" date, "gender" text, "email" text, "mobilePhone" json, "status" "public"."user_status_enum" NOT NULL DEFAULT 'unverified', "facebookId" text, "googleId" text, "password" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "loyalty" DROP COLUMN "point"`);
    await queryRunner.query(
      `ALTER TABLE "loyalty" ADD "point" integer NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "loyalty" ADD "name" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "loyalty" ADD "mimetype" text NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty" ADD "size" integer NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_unique_email ON "user"(email) WHERE status != 'deleted'`
    );
  }

  public async down(): Promise<void> {
    //
  }
}
