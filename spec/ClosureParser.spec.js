import { QueryEntity, QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';
import { SqliteAdapter } from '@themost/sqlite';
import '@themost/query-compat/register';

describe('ClosureParser', () => {

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

    it('should use order by with object destructuring', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select(({id, name, price}) => {
           id,
           name,
           price
        }).from(products).orderBy(({price}) => price);
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (let index = 0; index < items.length; index++) {
            if (index > 0) {
                expect(items[index-1].price).toBeLessThanOrEqual(items[index].price);
            }
        }
    });

    it('should use order by descending', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select(({id, name, price}) => {
           id,
           name,
           price
        }).from(products).orderByDescending((x) => x.price);
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (let index = 0; index < items.length; index++) {
            if (index > 0) {
                expect(items[index-1].price).toBeGreaterThanOrEqual(items[index].price);
            }
        }
    });

    it('should use order by descending with object destructuring', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select(({id, name, price}) => {
           id,
           name,
           price
        }).from(products).orderByDescending(({price}) => price);
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (let index = 0; index < items.length; index++) {
            if (index > 0) {
                expect(items[index-1].price).toBeGreaterThanOrEqual(items[index].price);
            }
        }
    });

    it('should use order by with function', async () => {
        const products = new QueryEntity('ProductData');
        const query = new QueryExpression().select(({id, name, price, releaseDate}) => {
           id,
           name,
           price,
           releaseDate
        }).from(products).orderBy((x) => x.releaseDate.getFullYear())
        const items = await db.executeAsync(query);
        expect(items).toBeTruthy();
        expect(items.length).toBeTruthy();
        for (let index = 0; index < items.length; index++) {
            if (index > 0) {
                expect(
                    items[index-1].releaseDate.getFullYear()
                    ).toBeLessThanOrEqual(
                        items[index].releaseDate.getFullYear()
                    );
            }
        }
    });
});