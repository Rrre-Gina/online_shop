import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Product from '../pages/category/[id]/product/[prodId]/index';
import * as nextRouter from 'next/router';
import * as query from "react-query";
import { Store } from '../context/context';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/', query: { prodId: 1 }, push: ()  => null }));

query.useQuery = jest.fn();

const expected = {
    id: 1,
    name: "Смартфон Xiaomi 12T, 256 GB, Silver",
    category: 1,
    categoryName: "Сотовые телефоны",
    description: "Артикул: 165245 / Размер экрана, дюйм: 6.67 / Разрешение экрана: 2712 x 1220 / Тип матрицы: CrystalRes AMOLED / Объем оперативной памяти: 8 ГБ / Объем встроенной памяти: 256 ГБ / Модель процессора: Dimensity 8100-Ultra / Частота процессора: 2.85 ГГц + 2.0 ГГц / Основная камера, Мп: 108 + 8 + 2 / Фронтальная камера, Мп: 20 / Беспроводные интерфейсы: Wi-Fi; Bluetooth; NFC; IrDA / Емкость аккумулятора: 5000 мАч / Дополнительно: Энергоэффективный техпроцесс 5 нм; Графический процессор: Mali-G610 MC6; Частота дискретизации касания: 480 Гц",
    prise: 299990,
    image: "https://static.shop.kz/upload/iblock/9ff/7pi57r108elabi1fvewj0fjycl15ulwx/165245_01.jpg",
    merchantId: ["123M23ERCH789"],
    merchantName: ["Shop.kz"]
}

const state = {
    userToken: '123user456token',
    cart: []
}

describe('Test render Product page', () => {
    beforeEach(() => jest.resetModules());

    it("test loader", () => {
		query.useQuery.mockImplementation(() => ({ isLoading: true }));
		render(<Product />);
		const loader = screen.getByTestId('loader');
		expect(loader).toBeInTheDocument();
  	});

    it("render without error", () => {
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(<Product />);
        const product = screen.getByRole('heading');
        expect(product).toHaveClass('product__name');
    });

    it("render with error", () => {
        query.useQuery.mockImplementation(() => ({ data: null, error: 'Error, status 500' }));
        render(<Product  />);
        const error = screen.getByText('Ошибка: Error, status 500');
        expect(error).toBeInTheDocument();
    });

    it("render with access rights + add product", () => {
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(
            <Store.Provider value={{ state, dispatch: () => null }}>
                <Product />
            </Store.Provider>
        );

        const add_btn = screen.getByRole('button', { name: 'Добавить в корзину' });

        act(() => {
            fireEvent.click(add_btn);
        });
        waitFor(() =>
            expect(screen.getAllByTitle('counter')).toBe(1)
        );
    });

    it("check go to cart button", () => {
        query.useQuery.mockImplementation(() => ({ data: expected, error: null }));
        render(
            <Store.Provider value={{ state, dispatch: () => null }}>
                <Product />
            </Store.Provider>
        );
        
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Перейти в корзину' }));
        });
        waitFor(() =>
            expect(global.window.location.href).toBe('http://localhost/cart')
        );
    });

})
