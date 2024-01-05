import {MigrationInterface, QueryRunner} from "typeorm";

export class callIvrInteraction1704453859903 implements MigrationInterface {
    name = 'callIvrInteraction1704453859903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."call_ivr_interaction_enum" AS ENUM('Accepted', 'Denied', 'Ignored')`);
        await queryRunner.query(`ALTER TABLE "call" ADD "ivr_interaction" "public"."call_ivr_interaction_enum" NOT NULL DEFAULT 'Ignored'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call" DROP COLUMN "ivr_interaction"`);
        await queryRunner.query(`DROP TYPE "public"."call_ivr_interaction_enum"`);
    }

}
