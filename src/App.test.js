import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Multitenant POC brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/Multitenant POC/i);
  expect(brandElement).toBeInTheDocument();
});
