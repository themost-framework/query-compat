import { TestUtils } from './TestUtils';
import { TestApplication } from './TestApplication';
import '@themost/query-compat/register';


describe('DataQueryable String Functions', () => {
    let app;
    let context;

    beforeAll(async () => {
        app = new TestApplication();
        context = app.createContext();
    });

    afterAll(async () => {
        await context.finalizeAsync();
        await app.finalize();
    });

    it('should use indexOf', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = context.model('Product')
                .where((x) => {
                    return x.name.indexOf('Apple') >= 0;
                }).take(10);
            const results = await query.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.name.indexOf('Apple')).toBeGreaterThanOrEqual(0);
            }
        });
    });

    it('should use toLowerCase', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = context.model('Products')
                .select((x) => {
                    return {
                        name: x.name,
                        lowered: x.name.toLowerCase()
                    }
                }).where((x) => {
                    return x.category.toLowerCase() === 'laptops';
                }).take(10);
            const results = await query.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.name.toLowerCase()).toEqual(result.lowered);
            }
        });
    });

    it('should use toUpperCase', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = context.model('Product')
                .select((x) => {
                    return {
                        name: x.name,
                        upper: x.name.toUpperCase()
                    }
                }).where((x) => {
                    return x.category.toUpperCase() === 'LAPTOPS';
                }).take(10);
            const results = await query.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.name.toUpperCase()).toEqual(result.upper);
            }
        });
    });

    it('should use includes', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = context.model('Product')
                .select((x) => {
                    return {
                        name: x.name
                    }
                }).where((x) => {
                    return x.name.includes('Apple') === true;
                }).take(10);
            const results = await query.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.name.includes('Apple')).toBeTruthy();
            }
        });
    });

    it('should use endsWith', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = context.model('Product')
                .select((x) => {
                    return {
                        name: x.name
                    }
                }).where((x) => {
                    return x.name.endsWith('Air') === true;
                }).take(10);
            const results = await query.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.name.endsWith('Air')).toBeTruthy();
            }
        });
    });

});