import { QueryEntity, QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';
import { SqliteAdapter } from '@themost/sqlite';
import '@themost/query-compat/operators';

describe('Module', () => {

    /**
     * @type {import('@themost/sqlite').SqliteAdapter}
     */
    let db;
    beforeAll(() => {
        db = new SqliteAdapter({
            name: 'local',
            database: './spec/db/local.db'
        });
    })

    it('should create instance', () => {
        const parser = new ClosureParser();
        expect(parser).toBeTruthy();
    });

    it('should use select', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select((x) => {
           x.id,
           x.name,
           x.price
        }).from(products);
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (const item of items) {
            expect(Object.keys(item)).toEqual([
                'id',
                'name',
                'price'
            ]);
        }
    });

    it('should use select with object destructuring', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select(({id, name, price}) => {
           id,
           name,
           price
        }).from(products);
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (const item of items) {
            expect(Object.keys(item)).toEqual([
                'id',
                'name',
                'price'
            ]);
        }
    });
});