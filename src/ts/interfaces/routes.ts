export interface RouteDefinition {
    reqMethod: 'get' | 'post' | 'delete' | 'patch' | 'put'
    path: string
    methods: string[]
}