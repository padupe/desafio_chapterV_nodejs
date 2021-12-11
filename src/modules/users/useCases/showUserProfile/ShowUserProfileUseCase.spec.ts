import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Show User Profile', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    });

    it('Should be able to show profile by user_id', async () => {
        const newUser = await createUserUseCase.execute({
            name: 'Usuário Teste',
            email: 'teste@email.com',
            password: 'passTest',
        });

        const idTest = String(newUser.id);

        const findById = await showUserProfileUseCase.execute(idTest);

        expect(findById).toEqual(newUser);
    });

    it('Should not be able show profile by failed user_id', async () => {
        await expect(showUserProfileUseCase.execute('failed_id')).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});