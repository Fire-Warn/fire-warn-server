import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1703361373401 implements MigrationInterface {
    name = 'initial1703361373401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "district" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "region_id" integer NOT NULL, CONSTRAINT "UQ_d9ed355e46edb25f094ad3a6461" UNIQUE ("name"), CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "incident" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "region_id" integer NOT NULL, "district_id" integer NOT NULL, "community_id" integer NOT NULL, "created_user_id" integer NOT NULL, CONSTRAINT "PK_5f90b28b0b8238d89ee8edcf96e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "community" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "region_id" integer NOT NULL, "district_id" integer NOT NULL, CONSTRAINT "UQ_696fdadbf0a710efbbf9d98ad9f" UNIQUE ("name"), CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "region" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8d766fc1d4d2e72ecd5f6567a02" UNIQUE ("name"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'RegionalAdmin', 'CommunityAdmin', 'Volunteer', 'Operator')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "public"."user_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "region_id" integer NOT NULL, "district_id" integer, "community_id" integer, CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."call_status_enum" AS ENUM('NotInitiated', 'Initiated', 'Answered', 'Hangup')`);
        await queryRunner.query(`CREATE TABLE "call" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" "public"."call_status_enum" NOT NULL, "answered_at" TIMESTAMP, "hungup_at" TIMESTAMP, "incident_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_8b212022b7428232091e2f8aa5c" UNIQUE ("name"), CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "district" ADD CONSTRAINT "FK_ca275ea45810f2eef683f2aa9d0" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_ce0dd7b6a3ae06300b863fc9ccd" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_eb06ab8bb0783f67fb5521bd4de" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_53df5d45389fdde1ed4af1d2c0a" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_4f5fb4621be9d073ceb4b8bf304" FOREIGN KEY ("created_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community" ADD CONSTRAINT "FK_776076caf8686bd2e0ed54af0e9" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community" ADD CONSTRAINT "FK_ef98d13716ddcc3403f6971fdbc" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68c168fe38b5826502b831f9f83" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7fe3e7044d6a8573464c532e4fd" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_174f1ac4a294f1ffc3d9909329f" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_98409dbd3b743d12bf77b451fbd" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_bc257dc1e96bc02fb0ebfea2688" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_bc257dc1e96bc02fb0ebfea2688"`);
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_98409dbd3b743d12bf77b451fbd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_174f1ac4a294f1ffc3d9909329f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7fe3e7044d6a8573464c532e4fd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68c168fe38b5826502b831f9f83"`);
        await queryRunner.query(`ALTER TABLE "community" DROP CONSTRAINT "FK_ef98d13716ddcc3403f6971fdbc"`);
        await queryRunner.query(`ALTER TABLE "community" DROP CONSTRAINT "FK_776076caf8686bd2e0ed54af0e9"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_4f5fb4621be9d073ceb4b8bf304"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_53df5d45389fdde1ed4af1d2c0a"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_eb06ab8bb0783f67fb5521bd4de"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_ce0dd7b6a3ae06300b863fc9ccd"`);
        await queryRunner.query(`ALTER TABLE "district" DROP CONSTRAINT "FK_ca275ea45810f2eef683f2aa9d0"`);
        await queryRunner.query(`DROP TABLE "call"`);
        await queryRunner.query(`DROP TYPE "public"."call_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP TABLE "community"`);
        await queryRunner.query(`DROP TABLE "incident"`);
        await queryRunner.query(`DROP TABLE "district"`);
    }

}
