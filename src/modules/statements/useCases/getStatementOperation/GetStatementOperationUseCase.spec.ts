import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Get Statement Operation', () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it('Should be able to show a Statement Operation by user_id', async () => {
        const user: ICreateUserDTO = {
            name: 'Correntista Test',
            email: 'correntista@email.com',
            password: 'passTest',
        };

        const newUser = await usersRepositoryInMemory.create(user);

        const idUser = String(newUser.id);

        const newDeposit = {
            type: OperationType.DEPOSIT, amount: 1000, description: 'Pix'
        };

        const newStatementDeposit = await statementsRepositoryInMemory.create({
            user_id: idUser,
            type: newDeposit.type,
            amount: newDeposit.amount,
            description: newDeposit.description,
        });

        const idStatement = String(newStatementDeposit.id);

        const responseTest = await getStatementOperationUseCase.execute({
            user_id: idUser,
            statement_id: idStatement
        });

        expect(responseTest).toHaveProperty('id');
        expect(responseTest).toHaveProperty('type');
        expect(responseTest).toHaveProperty('description');
    })
});