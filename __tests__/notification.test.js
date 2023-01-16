import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Notification from '../components/notification';

const close = () => null;

it("render notification component", () => {
    render(<Notification text='Ошибка 500, попробуйте еще раз' close={ close } />);
    const notification = screen.getByTestId('notification');
    expect(notification).toHaveClass('notification');
    expect(notification).toHaveTextContent('Ошибка 500, попробуйте еще раз');

    const tree = renderer.create(<Notification text='Ошибка 500, попробуйте еще раз' close={ close } />).toJSON();
    expect(tree).toMatchSnapshot();
});
