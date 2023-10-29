import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1698423507034 implements MigrationInterface {
    name = 'initial1698423507034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'RegionalAdmin', 'CommunityAdmin', 'Volunteer')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "public"."user_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "region_id" integer NOT NULL, "community_id" integer NOT NULL, CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "region" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8d766fc1d4d2e72ecd5f6567a02" UNIQUE ("name"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "community" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "region_id" integer NOT NULL, CONSTRAINT "UQ_696fdadbf0a710efbbf9d98ad9f" UNIQUE ("name"), CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68c168fe38b5826502b831f9f83" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_174f1ac4a294f1ffc3d9909329f" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community" ADD CONSTRAINT "FK_776076caf8686bd2e0ed54af0e9" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community" DROP CONSTRAINT "FK_776076caf8686bd2e0ed54af0e9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_174f1ac4a294f1ffc3d9909329f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68c168fe38b5826502b831f9f83"`);
        await queryRunner.query(`DROP TABLE "community"`);
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
