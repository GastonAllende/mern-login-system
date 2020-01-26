import React from 'react';
import { shallow } from 'enzyme';
import RightNavbar from './rightNavbar';

describe('<RightNavbar />', () => {
  test('renders', () => {
    const wrapper = shallow(<RightNavbar />);
    expect(wrapper).toMatchSnapshot();
  });
});
