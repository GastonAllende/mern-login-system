import React from 'react';
import { shallow } from 'enzyme';
import LeftNavbar from './leftNavbar';

describe('<LeftNavbar />', () => {
  test('renders', () => {
    const wrapper = shallow(<LeftNavbar />);
    expect(wrapper).toMatchSnapshot();
  });
});
