import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import CreateTrip from '../../pages/CreateTrip';

describe('CreateTrip Component', () => {
    it('should render CreateTrip component', () => {
        render(<CreateTrip />);
        expect(createTripElement).toBeInTheDocument();
    });

    it('should handle activity selection', () =>  {
        render(<CreateTrip />);
        const foodCheckbox = screen.getByLabel('Chilis');
        fireEvent.click(foodCheckbox);
        expect(foodCheckbox.checked).toBe(true);
    });

    it('should handle form submission', () => {
        render(<CreateTrip />);
        const createButton = screen.getByText('Create Iterary');
        fireEvent.click(createButton);
        expect(screen.getByText('Itinerary Created!')).toBeInTheDocument();
    });
});
