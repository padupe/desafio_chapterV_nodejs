import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Authenticate User', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('Should be able to authenticate an user', async () => {
        const newUser: ICreateUserDTO = {
            name: 'Usuário',
            email: 'usuario@email.com',
            password: 'passwordtest'
        };

        await createUserUseCase.execute(newUser);

        const resultTest = await authenticateUserUseCase.execute({
            email: newUser.email,
            password: newUser.password,
        });

        expect(resultTest).toHaveProperty('token');
    });

    it('Should not be able to authenticate an non existent user', async () => {
        expect(async() => {
            await authenticateUserUseCase.execute({
                email: 'failed@email.com',
                password: 'failedpass',
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to authenticate with incorret password', async () => {
        expect(async() => {
            const failedPass: ICreateUserDTO = {
                name: 'Usuário Certo',
                email: 'usuario@email.com',
                password: 'passok',
            };

            await createUserUseCase.execute(failedPass);

            const failedResultPass = await authenticateUserUseCase.execute({
                email: failedPass.email,
                password: 'passfail',
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it('Should not be able to authenticate with incorret email', async () => {
        expect(async() => {
            const failedEmail: ICreateUserDTO = {
                name: 'Usuário Certo',
                email: 'usuario@email.com',
                password: 'passok',
            };

            await createUserUseCase.execute(failedEmail);

            const failedResultEmail = await authenticateUserUseCase.execute({
                email: 'userfail@email.com',
                password: failedEmail.password,
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
})