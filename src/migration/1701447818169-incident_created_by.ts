import {MigrationInterface, QueryRunner} from "typeorm";

export class incidentCreatedBy1701447818169 implements MigrationInterface {
    name = 'incidentCreatedBy1701447818169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" ADD "created_user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_4f5fb4621be9d073ceb4b8bf304" FOREIGN KEY ("created_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_4f5fb4621be9d073ceb4b8bf304"`);
        await queryRunner.query(`ALTER TABLE "incident" DROP COLUMN "created_user_id"`);
    }

}
