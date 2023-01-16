import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Category from '../pages/category/[id]/index';
import * as nextRouter from 'next/router';
import * as query from "react-query";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/', query: { id: 1 } }));
query.useQuery = jest.fn();

const expected = [
	{
	  name: "Смартфон Xiaomi 12T, 256 GB, Silver",
	  id: 1
	},
	{
	  name: "Смартфон Infinix Note 11 Pro, 128 GB, Mithril Grey",
	  id: 2
	}
];

describe('Test render Category(Products) page', () => {
	beforeEach(() => jest.resetModules());

	it("test loader", () => {
		query.useQuery.mockImplementation(() => ({ isLoading: true }));
		render(<Category />);
		const loader = screen.getByTestId('loader');
		expect(loader).toBeInTheDocument();
  	});

	it("render without error", () => {
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Category  />);
        const categories = screen.getByRole('button', { name: expected[0].name });
        expect(categories).toHaveClass('row-item');
    });

	it('render empty data', () => {
		query.useQuery.mockImplementation(() => ({ data: null, error: null }));
		render(<Category />);
		const noCategories = screen.getByText('Нет товаров в выбранной категории');
		expect(noCategories).toBeInTheDocument();
	})

    it("render with error", () => {
        query.useQuery.mockImplementation(() => ({ data: null, error: 'Error, status 500' }));
        render(<Category  />);
        const error = screen.getByText('Ошибка: Error, status 500');
        expect(error).toBeInTheDocument();
    });

	it('test search input', () => {
		query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Category />);
        act(() => {
            const name = screen.getByPlaceholderText('Поиск по названию');
            fireEvent.change(name, { target: { value: '128 GB' } });
        });
        waitFor(() =>
            expect(screen.getByRole('button', { name: expected[1].name })).toBeInTheDocument()
        );
    });
})