export declare class RequestPasswordResetDto {
    email: string;
}
export declare class VerifyResetCodeDto {
    email: string;
    code: string;
}
export declare class ResetPasswordWithCodeDto {
    email: string;
    code: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}
