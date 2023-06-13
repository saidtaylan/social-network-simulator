export interface GraphQLDecoratorResolvers {
    Mutation: string[],
    Query: string[]
}

export interface GraphQLResolvers {
    Mutation: {
        [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    Query: {
        [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
    }
}