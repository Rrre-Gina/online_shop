import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Login from '../pages/auth';
import * as nextRouter from 'next/router';
import * as query from "react-query";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));
query.useMutation = jest.fn();

describe('test Login page', () => {
    beforeEach(() => {
        jest.resetModules();
        query.useMutation.mockImplementation(() => ({ mutate: () => null }));
        render(<Login />);
    });

    it("render Login page", () => {
        expect(screen.getByRole("heading")).toHaveTextContent('Авторизация');
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
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'user@mail.ru' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, { target: { value: '12' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Password is too short')).toBeInTheDocument()
        );
    });

    it('check errors -> dont find user', () => {
        act(() => {
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'w@w.w' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, { target: { value: '121212' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Cannot find user')).toBeInTheDocument()
        );
    });

    it('check errors -> incorrect password', () => {
        act(() => {
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'user@mail.ru' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, { target: { value: '121212' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByText('Incorrect password')).toBeInTheDocument()
        );
    });

    it('test correct auth', () => {
        act(() => {
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'user@mail.ru' } });
            const password = screen.getByPlaceholderText('Введите пароль');
            fireEvent.change(password, { target: { value: '346488' } });
            fireEvent.click(screen.getByRole('button'));
        });
        waitFor(() =>
            expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
        );
    });
})