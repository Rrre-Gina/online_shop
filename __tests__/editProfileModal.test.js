import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EditProfileModal from '../components/editProfileModal';
import * as query from "react-query";

query.useMutation = jest.fn();

const closeModal = () => null;
const userInfo = {
    name: 'Test User',
    email: 'testuser@mail.ru'
};
const fetchUserInfo = () => null;

describe('test Edit Profile modal', () => {
    beforeEach(() => {
        jest.resetModules();
        query.useMutation.mockImplementation(() => ({ mutate: () => null }));
        render(<EditProfileModal closeModal={ closeModal } userInfo={ userInfo } fetchUserInfo={ fetchUserInfo } />);
    });

    it("render modal", () => {
        expect(screen.getByText('Редактировать данные')).toBeInTheDocument();
    });

    it('check errors -> required fields', () => {
        act(() => {
            const name = screen.getByPlaceholderText('Введите имя');
            fireEvent.change(name, { target: { value: '' } });
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getAllByText('Поле обязательно для заполнения')).toBeInTheDocument()
        );
    });

    it('check errors -> incorrect email', () => {
        act(() => {
            const login = screen.getByPlaceholderText('Введите логин');
            fireEvent.change(login, { target: { value: 'login' } });
            fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
        });
        waitFor(() =>
            expect(screen.getByText('Некорректный email')).toBeInTheDocument()
        );
    });

})