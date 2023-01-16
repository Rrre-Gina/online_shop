import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Cart from '../pages/cart';
import * as nextRouter from 'next/router';
import * as query from "react-query";
import { Store } from '../context/context';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

query.useQuery = jest.fn();

const state = {
    userToken: 'user123token456',
    totalSum: 722970,
    cart: [
        { 
            category: 1, 
            categoryName: "Сотовые телефоны", 
            products: [
                {
                    amount: 2,
                    id: 1,
                    name: "Смартфон Xiaomi 12T, 256 GB, Silver",
                    description: "Артикул: 165245 / Размер экрана, дюйм: 6.67 / Разрешение экрана: 2712 x 1220 / Тип матрицы: CrystalRes AMOLED / Объем оперативной памяти: 8 ГБ / Объем встроенной памяти: 256 ГБ / Модель процессора: Dimensity 8100-Ultra / Частота процессора: 2.85 ГГц + 2.0 ГГц / Основная камера, Мп: 108 + 8 + 2 / Фронтальная камера, Мп: 20 / Беспроводные интерфейсы: Wi-Fi; Bluetooth; NFC; IrDA / Емкость аккумулятора: 5000 мАч / Дополнительно: Энергоэффективный техпроцесс 5 нм; Графический процессор: Mali-G610 MC6; Частота дискретизации касания: 480 Гц",
                    prise: 299990,
                    image: "https://static.shop.kz/upload/iblock/9ff/7pi57r108elabi1fvewj0fjycl15ulwx/165245_01.jpg"
                },
                {
                    amount: 1,
                    id: 2,
                    name: "Смартфон Infinix Note 11 Pro, 128 GB, Mithril Grey",
                    description: "Артикул: 165054 / Размер экрана, дюйм: 6.95 / Разрешение экрана: 2460 x 1080 / Тип матрицы: IPS / Объем оперативной памяти: 8 ГБ / Объем встроенной памяти: 128 ГБ / Модель процессора: Helio G96 / Частота процессора: 2.05 ГГц + 2.0 ГГц / Основная камера, Мп: 64 + 13 + 2 / Фронтальная камера, Мп: 16 / Беспроводные интерфейсы: Wi-Fi; Bluetooth / Емкость аккумулятора: 5000 мАч / Дополнительно: Быстрая зарядка 33Вт; Графический ускоритель Mali-G57 MC2; Частота дискретизации касания: 180 Гц",
                    prise: 122990,
                    image: "https://static.shop.kz/upload/iblock/645/3pcctfh4z4fh4ruabcc1mr7w3ln5vki0/165054_01.jpg"
                }
            ] 
        }
    ]
}

describe('Test render Cart page', () => {
    beforeEach(() =>  jest.resetModules());

    it("test authentification", () => {
        query.useQuery.mockImplementation(() => ({ isLoading: false }));
        render(<Cart />);
        const text = screen.getByText('Для перехода в корзину необходимо');
        expect(text).toHaveClass('need-auth');
    });

    it("render cart", () => {
        render(
            <Store.Provider value={{ state }}>
                <Cart />
            </Store.Provider>
        );
        const productName = screen.getByRole('heading', { name: state.cart[0].products[0].name });
        expect(productName).toBeInTheDocument();
    });

    it("check total sum", () => {
        render(
            <Store.Provider value={{ state }}>
                <Cart />
            </Store.Provider>
        );
        const totalSum = state.cart[0].products[0].amount * state.cart[0].products[0].prise + state.cart[0].products[1].amount * state.cart[0].products[1].prise;
        expect(screen.getByTestId('totalSum').textContent).toBe('Общая цена за все товары: ' + totalSum);
    });

    it("check counter", () => {
        render(
            <Store.Provider value={{ state, dispatch: () => null }}>
                <Cart />
            </Store.Provider>
        );

        const counter = screen.getAllByTitle('counter');
        const add_btn = screen.getAllByRole('button', { name: '+' });

        act(() => {
            fireEvent.click(add_btn[0]);
        });
        waitFor(() =>
            expect(counter[0]).toBe(3)
        );
    });

})






