import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import OrderModal from '../components/orderModal';
import * as query from "react-query";

query.useMutation = jest.fn();

const productsInfo = { id: 1, amount: 1, name: 'item.name', prise: 102990 };
const closeModal = () => null;
const sum = 102990;

describe('test Create Order modal', () => {
    beforeEach(() => {
        jest.resetModules();
        query.useMutation.mockImplementation(() => ({ mutate: () => null }));
        render(<OrderModal closeModal={ closeModal } productsInfo={ productsInfo } sum={ sum } />);
    });

    it("render modal", () => {
        expect(screen.getByText('Детали заказа')).toBeInTheDocument();
    });

    it('check errors -> required fields', () => {
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getAllByText('Поле не может быть пустым')).toBeInTheDocument()
        );
    });

    it('check errors -> incorrect date', () => {
        act(() => {
            const date = screen.getByPlaceholderText('Укажите дату');
            fireEvent.change(date, { target: { value: '12.12.12121' } });
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getByText('Некорректная дата')).toBeInTheDocument()
        );
    });

    it('check errors -> incorrect phone number', () => {
        act(() => {
            const phone = screen.getByPlaceholderText('Контактный номер');
            fireEvent.change(phone, { target: { value: '123123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getByText('Некорректный формат')).toBeInTheDocument()
        );
    });

    it('test correct order create', () => {
        act(() => {    
            const address = screen.getByPlaceholderText('Укажите адрес');
            const date = screen.getByPlaceholderText('Укажите дату');
            const phone = screen.getByPlaceholderText('Контактный номер');
            fireEvent.change(address, { target: { value: 'Test addr, 12-3' } });
            fireEvent.change(date, { target: { value: '12.12.2022' } });
            fireEvent.change(phone, { target: { value: '87077077007' } });
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getByText('Выбранных товаров нет')).toBeInTheDocument()
        );
    });
    
})