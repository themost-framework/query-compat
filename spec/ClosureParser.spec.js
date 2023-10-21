import { ClosureParser } from '@themost/query-compat/closures';
describe('Module', () => {
    it('should create instance', () => {
        const parser = new ClosureParser();
        expect(parser).toBeTruthy();
    })
});