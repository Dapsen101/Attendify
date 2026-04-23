// This is a basic test file for the App component.
// It uses React Testing Library to render the App and check for content.
// The test looks for the text "learn react" (case-insensitive) in the rendered output.
// This is a placeholder test that should be updated with actual tests for Attendx.
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

