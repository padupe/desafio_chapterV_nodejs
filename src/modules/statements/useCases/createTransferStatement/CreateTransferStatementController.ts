import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferStatementUseCase } from './CreateTransferStatementUseCase';

export class CreateTransferStatementController {
    async handle(request: Request, response: Response): Promise<Response> {

        const { id: sender_id } = request.user;
        const { description, amount } = request.body;
        const { recipient_id } = request.params;

        const createTransferStatementUseCase = container.resolve(
            CreateTransferStatementUseCase
        );
        
        const newStatement = await createTransferStatementUseCase.execute({
            sender_id, description, amount, recipient_id
        });

        return response.json(newStatement);
    };
};