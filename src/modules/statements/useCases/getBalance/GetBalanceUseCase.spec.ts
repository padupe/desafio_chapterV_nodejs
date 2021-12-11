import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Get Balance', () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    });

    it('Should be able to show Balance by user_id', async () => {
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

        await statementsRepositoryInMemory.create({
            user_id: idUser,
            type: newDeposit.type,
            amount: newDeposit.amount,
            description: newDeposit.description,
        });

        const newWithdrawal = {
            type: OperationType.WITHDRAW, amount: 600, description: 'Empréstimo'
        };

        await statementsRepositoryInMemory.create({
            user_id: idUser,
            type: newWithdrawal.type,
            amount: newWithdrawal.amount,
            description: newWithdrawal.description,
        });

        const responseTest = await getBalanceUseCase.execute({ user_id: idUser });

        expect(responseTest.statement.length).toBe(2);
        expect(responseTest.balance).toBe(400);
    });

    it('Should not be able to show Balance by wrong user_id', () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: 'failed_id' })
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});