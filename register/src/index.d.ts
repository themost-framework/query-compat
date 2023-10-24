import { SyncSeriesEventEmitter } from '@themost/events';

declare module "@themost/query" {

    type QueryFunc<T> = (value: T, ...param: any[]) => any;

    type QueryJoinFunc<T, J> = (value1: T, value2: J, ...param: any[]) => any;

    interface QueryExpression {
        where<T>(expr: (value: T, ...param: any[]) => any, params?: any): this;
        where(expr: string | any): this;
        select<T>(expr: QueryFunc<T>, params?: any): this;
        select<T, J>(expr: QueryJoinFunc<T, J>, params?: any): this;
        from(entity: string): this;
        from(entity: QueryEntity): this;
        join(entity: any, props?: any, alias?: any): this;
        join(entity: QueryEntity): this;
        leftJoin(entity: any, props?: any, alias?: any): this;
        leftJoin(entity: QueryEntity): this;
        rightJoin(entity: any, props?: any, alias?: any): this;
        rightJoin(entity: QueryEntity): this;
        with(obj: any): this;
        with<T, J>(expr: (value: T, otherValue: J, ...param: any[]) => any, params?: any): this;
        orderBy(expr: string | any): this;
        orderBy<T>(expr: QueryFunc<T>, params?: any): this;
        orderByDescending(expr: string | any): this;
        orderByDescending<T>(expr: QueryFunc<T>, params?: any): this;
        thenBy(expr: string | any): this;
        thenBy<T>(expr: QueryFunc<T>, params?: any): this;
        thenByDescending(expr: string | any): this;
        thenByDescending<T>(expr: (value: T) => any): this;
        groupBy(...expr: (string | any)[]): this;
        groupBy<T>(arg1: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, arg3: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, arg3: QueryFunc<T>,
            arg4: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, arg3: QueryFunc<T>,
            arg4: QueryFunc<T>, arg5: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, arg3: QueryFunc<T>,
            arg4: QueryFunc<T>, arg5: QueryFunc<T>, arg6: QueryFunc<T>, params?: any): this;
        groupBy<T>(arg1: QueryFunc<T>, arg2: QueryFunc<T>, arg3: QueryFunc<T>,
            arg4: QueryFunc<T>, arg5: QueryFunc<T>, arg6: QueryFunc<T>, arg7: QueryFunc<T>, params?: any): this;
    
        resolvingMember: SyncSeriesEventEmitter<{ target: QueryExpression, member: string }>;
        resolvingJoinMember: SyncSeriesEventEmitter<{ target: QueryExpression, member: string, fullyQualifiedMember?: string }>;
        resolvingMethod: SyncSeriesEventEmitter<{ target: QueryExpression, method: string }>;
    }
}

declare module "@themost/data" {

    interface DataQueryable {
        where(attr: string): this;
        where<T>(expr: (value: T, ...param: any) => any, params?: any): this;
        select<T>(expr: (value: T, ...param: any) => any, params?: any): this;
        select<T,J>(expr: (value1: T, value2: J, ...param: any) => any, params?: any): this;
        select(...attr: any[]): this;
        orderBy(attr: any): this;
        orderBy<T>(expr: (value: T) => any): this;
        orderByDescending(attr: any): this;
        orderByDescending<T>(expr: (value: T) => any): this;
        thenBy(attr: any): this;
        thenBy<T>(expr: (value: T) => any): this;
        thenByDescending(attr: any): this;
        thenByDescending<T>(expr: (value: T) => any): this;
        groupBy(...attr: any[]): this;
        groupBy<T>(...args: [...expr:[(value: T) => any], params?: any]): this;
        expand(...attr: any[]): this;
        expand<T>(...args: [...expr:[(value: T) => any], params?: any]): this;
    }

    interface DataModel {
        filterAsync(params: any): Promise<DataQueryable>;
    }
}

export { };