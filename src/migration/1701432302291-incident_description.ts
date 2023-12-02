import {MigrationInterface, QueryRunner} from "typeorm";

export class incidentDescription1701432302291 implements MigrationInterface {
    name = 'incidentDescription1701432302291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" DROP COLUMN "description"`);
    }

}
