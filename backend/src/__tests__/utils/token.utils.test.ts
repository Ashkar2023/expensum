import { signJWT, verifyJWT, decodeJWT, TokenType } from '../../utils/token.utils.ts';

const secret = 'test-secret';
const payload = { userId: 1 };

describe('Token Utils', () => {
    let token: string;

    it('should sign a JWT', async () => {
        token = await signJWT({ payload, secret, tokenType: 'ACCESS' as TokenType });
        expect(token).toBeDefined();
    });

    it('should verify a JWT', async () => {
        const verifiedPayload = await verifyJWT({ jwt: token, secret });
        expect(verifiedPayload).toHaveProperty('userId', 1);
    });

    it('should decode a JWT', () => {
        const decoded = decodeJWT(token);
        expect(decoded).toHaveProperty('userId', 1);
    });
});