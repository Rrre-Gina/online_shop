import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Home from '../pages/index';
import * as nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

it("render Home page with heading", () => {
  	render(<Home />);
	expect(screen.getByRole("heading")).toHaveTextContent('Home');
	const tree = renderer.create(<Home />).toJSON();
	expect(tree).toMatchSnapshot();
});