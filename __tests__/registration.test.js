import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Registration from '../pages/registration';
import * as nextRouter from 'next/router';
import * as query from "react-query";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

query.useMutation = jest.fn();

describe('test Registration page', () => {
    beforeEach(() => {
        jest.resetModules();
        query.useMutation.mockImplementation(() => ({ mutate: () => null }));
        render(<Registration />);
    });

    it("render Registration page", () => {
        expect(screen.getByRole("heading")).toHaveTextContent('Регистрация');
    });

    it('check errors -> required fields', () => {
        act(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getAllByText('Поле обязательно для заполнения')).toBeInTheDocument()
        );
    });

    it('check errors -> incorrect email', () => {
        act(() => {
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'name' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Некорректный email')).toBeInTheDocument()
        );
    });

    it('check errors -> short password', () => {
        act(() => {
            const name = screen.getByPlaceholderText('Введите имя');
            fireEvent.change(name, { target: { value: 'User Test' } });
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, {target: { value: 'testuser@mail.ru' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, {target: { value: '12' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Password is too short')).toBeInTheDocument()
        );
    });

    it('check errors -> same login', () => {
        act(() => {
            const name = screen.getByPlaceholderText('Введите имя');
            fireEvent.change(name, { target: { value: 'User Test' } });
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'user@mail.ru' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, { target: { value: '121212' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Email already exists')).toBeInTheDocument()
        );
    });

    it('test correct registration', () => {
        act(() => {
            const name = screen.getByPlaceholderText('Введите имя');
            fireEvent.change(name, { target: { value: 'User Test' } });
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, {target: {value: 'testuser@mail.ru'}});
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, {target: {value: '123123'}});
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByRole('heading', { name: 'Авторизация' })).toBeInTheDocument()
        );
    });
})