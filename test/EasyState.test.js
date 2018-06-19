import React, { Component } from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { view, store } from 'react-easy-state';

describe('nested objects', () => {
    const state = store({ list: [] });

    class TestApp extends Component {
        id = 0

        handleClick = (e) => {
            e.preventDefault();
            state.list.push({
                id: this.id,
            });
            this.id++;
        }

        handleMutate = (e) => {
            e.preventDefault();

            state.list.forEach(k => {
                k.id++;
            });
        }

        render() {
            return (
                <div>
                    <p>
                        {state.list.map(item => (
                            <span key={item.id}>{item.id}</span>
                        ))}
                    </p>
                    <button id="inc" onClick={this.handleClick}>Add</button>
                    <button id="mut" onClick={this.handleMutate}>Mutate</button>
                </div>
            );
        }
    }

    const Wrapped = view(TestApp);

    it('updates the render when state is modified', () => {
        const wrapper = mount(<Wrapped />);

        expect(wrapper.find('p').text()).to.be.equal('');

        wrapper.find('button').first().simulate('click');

        expect(wrapper.find('p').text()).to.be.equal('0');

        wrapper.find('button').first().simulate('click');

        expect(wrapper.find('p').text()).to.be.equal('01');

        wrapper.find('#mut').simulate('click');

        expect(wrapper.find('p').text()).to.be.equal('12');
    });
});