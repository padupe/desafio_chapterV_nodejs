import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create Statment', () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it('Should be able to create a new Statement', async () => {
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

        const newStatementDeposit = await createStatementUseCase.execute({
            user_id: idUser,
            type: newDeposit.type,
            amount: newDeposit.amount,
            description: newDeposit.description,
        });

        const newWithdrawal = {
            type: OperationType.WITHDRAW, amount: 10, description: 'Estacionamento'
        };

        const newStatementWithdrawal = await createStatementUseCase.execute({
            user_id: idUser,
            type: newWithdrawal.type,
            amount: newWithdrawal.amount,
            description: newWithdrawal.description,
        });

        expect(newStatementDeposit).toHaveProperty('id');
        expect(newStatementWithdrawal).toHaveProperty('id');
    });

    it('Should not to able to create a new Deposit a user failed', () => {
        expect(async () => {
            const newDeposit = {
                type: OperationType.DEPOSIT, amount: 100, description: 'Pix'
            };

            await createStatementUseCase.execute({
                user_id: 'failed_id',
                type: newDeposit.type,
                amount: newDeposit.amount,
                description: newDeposit.description,
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it('Should not to able to create a new Withdrawal a user failed', () => {
        expect(async () => {
            const newWithdrawal = {
                type: OperationType.WITHDRAW, amount: 10, description: 'Estacionamento'
            };

            await createStatementUseCase.execute({
                user_id: 'failed_id',
                type: newWithdrawal.type,
                amount: newWithdrawal.amount,
                description: newWithdrawal.description,
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it('Should not be able to create a new withdrawal with a balance less than the amount', () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'Correntista Negativado',
                email: 'correntistanegativado@email.com',
                password: 'passTestNeg',
            };

            const newUser = await usersRepositoryInMemory.create(user);

            const newWithdrawal = {
                type: OperationType.WITHDRAW, amount: 100, description: 'Energia'
            };

            await createStatementUseCase.execute({
                user_id: newUser.id as string,
                type: newWithdrawal.type,
                amount: newWithdrawal.amount,
                description: newWithdrawal.description,
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    })
});