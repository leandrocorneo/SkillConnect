export interface sendEmailUserInterface {
    sendVerificationCode(userEmail: string, verificationCode: string): Promise<void>;
}