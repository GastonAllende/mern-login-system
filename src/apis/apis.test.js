import React from 'react';
import { shallow } from 'enzyme';
import Apis from './apis';

describe('<Apis />', () => {
  test('renders', () => {
    const wrapper = shallow(<Apis />);
    expect(wrapper).toMatchSnapshot();
  });
});
