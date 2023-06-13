/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import 'reflect-metadata'
import { RouteDefinition } from '../interfaces/routes'
import { HTTP_METHODS } from '../constants/http'

//export const router = Router()

export function Get(_path?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return HttpMethod(target, 'get', propertyKey, _path)
    }
}

export function Post(_path?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return HttpMethod(target, 'get', propertyKey, _path)
    }
}

export function Put(_path?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return HttpMethod(target, 'get', propertyKey, _path)
    }
}

export function Delete(_path?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return HttpMethod(target, 'get', propertyKey, _path)
    }
}

const HttpMethod = (target: any, reqMethod: keyof typeof HTTP_METHODS, method: string, _path?: string) => {
    if (!Reflect.hasMetadata('routes', target.constructor))
        Reflect.defineMetadata('routes', [], target.constructor)
    const routes = Reflect.getMetadata('routes', target.constructor)
    let path: string = !_path ? '' : (_path.startsWith('/') ? _path.slice(1, _path.length - 1) : _path)
    path = path.endsWith('/') ? path.slice(0, -1) : path
    routes.push({
        reqMethod,
        path,
        methods: [method]
    }) as RouteDefinition
    Reflect.defineMetadata('routes', routes, target.constructor)
    return target
}

export function Controller(_prefix: string) {
    return function <T extends { new(...args: any[]): any }>(target: T) {
        if (target) {
            let prefix = _prefix.length > 1 && _prefix.endsWith('/') ? _prefix.slice(0, -1) : _prefix
            prefix = prefix.startsWith('/') ? prefix.slice(1, prefix.length - 1) : prefix
            console.log('prefix', prefix)
            Reflect.defineMetadata('prefix', prefix, target.prototype.constructor)

            return target
        }
    }
}