import React from 'react';
import { shallow } from 'enzyme';
import CompanyLogo from './companyLogo';

describe('<CompanyLogo />', () => {
  test('renders', () => {
    const wrapper = shallow(<CompanyLogo />);
    expect(wrapper).toMatchSnapshot();
  });
});
