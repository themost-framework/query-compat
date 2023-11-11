import { TestUtils } from './TestUtils';
import { TestApplication } from './TestApplication';
import '@themost/query-compat/register';
import { OpenDataQuery, OpenDataQueryFormatter } from '@themost/query-compat';

describe('OpenDataQuery.arithmetic', () => {
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

    it('should use add', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = new OpenDataQuery().from('Products')
                .select((x) => {
                    return {
                        name: x.name,
                        originalPrice: x.price,
                        price: x.price + 25
                    }
                }).where((x) => {
                    return x.category === 'Laptops';
                }).take(10);
            const queryParams = new OpenDataQueryFormatter().formatSelect(query);
            const q = await context.model('Product').filterAsync(queryParams);
            const results = await q.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.originalPrice + 25).toEqual(result.price);
            }
        });
    });

    it('should use subtract', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = new OpenDataQuery().from('Products')
                .select((x) => {
                    return {
                        name: x.name,
                        originalPrice: x.price,
                        price: x.price - 25
                    }
                }).where((x) => {
                    return x.category === 'Laptops';
                }).take(10);
            const queryParams = new OpenDataQueryFormatter().formatSelect(query);
            const q = await context.model('Product').filterAsync(queryParams);
            const results = await q.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.originalPrice - 25).toEqual(result.price);
            }
        });
    });

    it('should use multiply', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = new OpenDataQuery().from('Products')
                .select((x) => {
                    return {
                        name: x.name,
                        originalPrice: x.price,
                        price: x.price * 0.75
                    }
                }).where((x) => {
                    return x.category === 'Laptops';
                }).take(10);
            const queryParams = new OpenDataQueryFormatter().formatSelect(query);
            const q = await context.model('Product').filterAsync(queryParams);
            const results = await q.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.originalPrice * 0.75).toEqual(result.price);
            }
        });
    });

    it('should use divide', async () => {
        await TestUtils.executeInTransaction(context, async () => {
            const query = new OpenDataQuery().from('Products')
                .select((x) => {
                    return {
                        name: x.name,
                        originalPrice: x.price,
                        price: x.price / 1.5
                    }
                }).where((x) => {
                    return x.category === 'Laptops';
                }).take(10);
            const queryParams = new OpenDataQueryFormatter().formatSelect(query);
            const q = await context.model('Product').filterAsync(queryParams);
            const results = await q.getItems();
            expect(results.length).toBeTruthy();
            for (const result of results) {
                expect(result.originalPrice / 1.5).toEqual(result.price);
            }
        });
    });

});
