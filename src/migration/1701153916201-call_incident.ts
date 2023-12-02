import {MigrationInterface, QueryRunner} from "typeorm";

export class callIncident1701153916201 implements MigrationInterface {
    name = 'callIncident1701153916201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "incident" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "region_id" integer NOT NULL, "community_id" integer NOT NULL, CONSTRAINT "PK_5f90b28b0b8238d89ee8edcf96e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."call_status_enum" AS ENUM('NotInitiated', 'Initiated', 'Answered', 'Hangup')`);
        await queryRunner.query(`CREATE TABLE "call" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" "public"."call_status_enum" NOT NULL, "answered_at" TIMESTAMP, "hungup_at" TIMESTAMP, "incident_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_8b212022b7428232091e2f8aa5c" UNIQUE ("name"), CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_ce0dd7b6a3ae06300b863fc9ccd" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_53df5d45389fdde1ed4af1d2c0a" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_98409dbd3b743d12bf77b451fbd" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_bc257dc1e96bc02fb0ebfea2688" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_bc257dc1e96bc02fb0ebfea2688"`);
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_98409dbd3b743d12bf77b451fbd"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_53df5d45389fdde1ed4af1d2c0a"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_ce0dd7b6a3ae06300b863fc9ccd"`);
        await queryRunner.query(`DROP TABLE "call"`);
        await queryRunner.query(`DROP TYPE "public"."call_status_enum"`);
        await queryRunner.query(`DROP TABLE "incident"`);
    }

}
