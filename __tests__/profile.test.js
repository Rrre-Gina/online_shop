import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../pages/profile';
import * as nextRouter from 'next/router';
import * as query from "react-query";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

query.useQuery = jest.fn();

jest.spyOn(Storage.prototype, 'getItem');

const expected = {
    name: 'Test User',
    email: 'test@user.test',
}

describe('Test render Profile page', () => {
    beforeEach(() => jest.resetModules());

    it("test authentification", () => {
        query.useQuery.mockImplementation(() => ({ isLoading: false }));
        render(<Profile />);
        const text = screen.getByText('Для перехода в профиль необходимо');
        expect(text).toHaveClass('need-auth');
    });

    it("test loader", () => {
		query.useQuery.mockImplementation(() => ({ isLoading: true }));
		render(<Profile />);
		const loader = screen.getByTestId('loader');
		expect(loader).toBeInTheDocument();
  	});

    it("render without error", () => {
        Storage.prototype.getItem = jest.fn(() => '123user456id');
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Profile />);
        const user = screen.getByLabelText('user-email');
        expect(user).toHaveTextContent(expected.email);
    });

    it("render with error", () => {
        query.useQuery.mockImplementation(() => ({ data: null, error: 'Error, status 500' }));
        render(<Profile />);
        const error = screen.getByText('Ошибка: Error, status 500');
        expect(error).toBeInTheDocument();
    });

})






