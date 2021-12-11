import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class statementsAddTransfer1639180786550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'statements',
            new TableColumn({
                name: 'sender_id',
                type: 'uuid',
                isNullable: true
            })
        );

        await queryRunner.changeColumn(
            'statements',
            'type',
            new TableColumn({
                name: 'type',
                type: 'enum',
                enum: ['deposit', 'transfer', 'withdraw']
            })
        );

        await queryRunner.createForeignKey(
            'statements',
            new TableForeignKey({
                name: 'FKStatementSender',
                columnNames: ['sender_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onUpdate: "SET NULL",
                onDelete: "SET NULL",
            })
        );
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("statements", "FKStatementSender");

        await queryRunner.changeColumn(
            "statements",
            "type",
            new TableColumn({
                name: "type",
                type: "enum",
                enum: ["deposit", "withdraw"],
            })
        );

    await queryRunner.dropColumn("statements", "sender_id");
    };
};
