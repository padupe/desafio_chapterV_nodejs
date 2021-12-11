import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferStatementError {
    export class UserSenderNotFound extends AppError {
        constructor() {
            super("User sender not Found!", 404);
        }
    };

    export class InsufficientFunds extends AppError {
        constructor() {
            super("Insufficient funds.", 401);
        }
    };

    export class TransferToYourSelf extends AppError {
        constructor() {
            super("You can not to transfer to your self!", 401)
        }
    }
};