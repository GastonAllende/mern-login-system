import React from 'react';
import { shallow } from 'enzyme';
import ProfileLogo from './ProfileLogo';

describe('<ProfileLogo />', () => {
  test('renders', () => {
    const wrapper = shallow(<ProfileLogo />);
    expect(wrapper).toMatchSnapshot();
  });
});
