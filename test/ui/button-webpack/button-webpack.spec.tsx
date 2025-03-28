import React from 'react';
import { render } from '@testing-library/react';
import { BasicButtonWebpack } from './button-webpack.composition.js';

it('should render the correct text', () => {
  const { getByText } = render(<BasicButtonWebpack />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
