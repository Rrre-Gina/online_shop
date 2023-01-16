import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Categories from '../pages/categories';
import * as nextRouter from 'next/router';
import * as query from "react-query";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

query.useQuery = jest.fn();

const expected = [
	{
	  name: "Сотовые телефоны",
	  id: 1
	},
	{
	  name: "Гаджеты",
	  id: 2
	}
];

describe('Test render Categories page', () => {
	beforeEach(() => jest.resetModules());

	it("test loader", () => {
		query.useQuery.mockImplementation(() => ({ isLoading: true }));
		render(<Categories />);
		const loader = screen.getByTestId('loader');
		expect(loader).toBeInTheDocument();
  	});

	it("render without error", () => {
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Categories  />);
        const categories = screen.getByRole('button', { name: 'Сотовые телефоны' });
        expect(categories).toHaveClass('row-item');
    });

	it('render empty data', () => {
		query.useQuery.mockImplementation(() => ({ data: null, error: null }));
		render(<Categories />);
		const noCategories = screen.getByText('Категории не найдены');
		expect(noCategories).toBeInTheDocument();
	})

    it("render with error", () => {
        query.useQuery.mockImplementation(() => ({ data: null, error: 'Error, status 500' }));
        render(<Categories  />);
        const error = screen.getByText('Ошибка: Error, status 500');
        expect(error).toBeInTheDocument();
    });

	it('test search input', () => {
		query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Categories  />);
        act(() => {
            const name = screen.getByRole('searchField');
            fireEvent.change(name, { target: { value: 'гаджеты' } });
        });
        waitFor(() =>
            expect(screen.getByRole('button', { name: expected[1].name })).toBeInTheDocument()
        );
    });

})