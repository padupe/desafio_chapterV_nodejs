import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    });

    it('Should be able to create a new user', async () => {
        const newUser = await createUserUseCase.execute({
            name: 'Novo Usuário',
            email: 'novousuario@email.com',
            password: '1234'
        });

        expect(newUser).toHaveProperty('id');
    });

    it('Should not be able to create a new user with a email exists', async () => {
        expect(async() => {
            await createUserUseCase.execute({
                name: 'Novo Usuário',
                email: 'novousuario@email.com',
                password: '1234'
            });

            await createUserUseCase.execute({
                name: 'Nova Usuária',
                email: 'novousuario@email.com',
                password: '1234'
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});