import React, { Component } from 'react';
import { observable, observe } from '@nx-js/observer-util';

function recurse(val, setState) {
    if (typeof val === 'object') {
        if (!(val instanceof Array)) {
            const newVal = {};
            Object.keys(val).forEach(k => {
                newVal[k] = createStore(val[k], setState);
            });
            return newVal;
        } else {
            console.log('neasdfsadf');
            return val.map(v => {
                return createStore(v, setState);
            });
        }
    } 
    return val;
}

function createStore(state, setState) {
    if (typeof state !== 'object') {
        return state;
    }

    const obj = {
        get(target, key) {
            if (key in target) {
                return target[key]; 
            } else {
                return null;
            }
        },
        
        set(target, key, val) {
            console.log(key, val);
            target[key] = recurse(val);

            setState(target, setState);

            return true;
        },
    };

    return new Proxy(recurse(state, setState), obj);
}

export class ReactiveComponent extends Component {
    get state() {
        return this.__state;
    }

    set state(val) {
        if (!this.__state) {
            this.__state = observable(val);
            observe(() => {
                console.log(this.__state);
                this.setState(this.__state);
            });
            //createStore(val, this.setState.bind(this));
        }
    }
}