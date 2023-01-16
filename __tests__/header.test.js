import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import Header from '../components/header';
import * as nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

describe('testing header component', () => {
    beforeEach(() => render(<Header />));

    it("render header component", () => {
        expect(screen.getByRole("navigation")).toHaveTextContent('Главная');
        const tree = renderer.create(<Header />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('check links', () => {
        expect(screen.getByText('Главная')).toHaveAttribute('href', '/');
        expect(screen.getByText('Категории')).toHaveAttribute('href', '/categories');
        expect(screen.getByText('Корзина')).toHaveAttribute('href', '/cart');
        expect(screen.getAllByText('Профиль')[0]).toHaveAttribute('href', '/profile');
        expect(screen.getByText('Войти')).toHaveAttribute('href', '/auth');
    });

    it('check active class', () => {
        act(() => {
            fireEvent.focus(screen.getByText('Категории'));
        });
        waitFor(() =>
            expect(screen.getByText('Категории')).toHaveClass('active')
        );
    });
});
