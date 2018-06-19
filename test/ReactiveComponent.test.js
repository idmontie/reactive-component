import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { ReactiveComponent } from '../src/ReactiveComponent';

describe('ReactiveComponent', () => {
    describe('simple counter', () => {
        class TestApp extends ReactiveComponent {
            state = {
                counter: 0,
            }

            handleClick = (e) => {
                e.preventDefault();
                this.state.counter++;
            }

            render() {
                return (
                    <div>
                        <p>{this.state.counter}</p>
                        <button onClick={this.handleClick}>Increase</button>
                    </div>
                );
            }
        }

        it('updates the render when state is modified', () => {
            const wrapper = mount(<TestApp />);

            expect(wrapper.find('p').text()).to.be.equal('0');

            wrapper.find('button').simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('1');

            wrapper.find('button').simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('2');

            wrapper.find('button').simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('3');
        });
    });

    describe.only('nested objects', () => {
        class TestApp extends ReactiveComponent {
            id = 0

            state = {
                list: [],
            }

            handleClick = (e) => {
                e.preventDefault();
                this.state.list.push({
                    id: this.id,
                });
                this.id++;
            }

            handleMutate = (e) => {
                e.preventDefault();

                console.log(this.state.list);
                this.state.list.forEach(k => {
                    k.id++;
                });
                console.log(this.state.list);
            }

            render() {
                return (
                    <div>
                        <p>
                            {this.state.list.map(item => (
                                <span key={item.id}>{item.id}</span>
                            ))}
                        </p>
                        <button id="inc" onClick={this.handleClick}>Add</button>
                        <button id="mut" onClick={this.handleMutate}>Mutate</button>
                    </div>
                );
            }
        }

        it('updates the render when state is modified', () => {
            const wrapper = mount(<TestApp />);

            expect(wrapper.find('p').text()).to.be.equal('');

            wrapper.find('button').first().simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('0');

            wrapper.find('button').first().simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('01');

            wrapper.find('#mut').simulate('click');

            expect(wrapper.find('p').text()).to.be.equal('12');
        });
    });
});
