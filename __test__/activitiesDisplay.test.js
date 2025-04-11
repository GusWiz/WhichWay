import ActivitiesDisplay from "../src/components/Createtrip-Components/ActivitiesDisplay";
import { within, render, screen} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockFood = [{ name: 'Pizza', imgSrc: '/pizza.jpg', priceRange: '$$', rating: '4.5', userRatingCount: 123, groupSize: '2-4' }];
const mockEntertainment = [{ name: 'Bowling', imgSrc: '/bowling.jpg', priceRange: '$$', rating: '4.2', userRatingCount: 200, groupSize: '2-6' }];
const mockOutdoor = [];

const mockHandle = jest.fn();


describe(ActivitiesDisplay, () =>{

    it("renders the correct entertainment options in the Entertainment section", () => {
        render(
            <ActivitiesDisplay
              foodOptions={mockFood}
              selectedFoods={[]}
              handleSelectFood={mockHandle}
              entertainmentOptions={mockEntertainment}
              selectedEntertainment={[]}
              handleSelectEntertainment={mockHandle}
              outdoorOptions={mockOutdoor}
              selectedOutdoor={[]}
              handleSelectOutdoor={mockHandle}
            />
          );


        const entertainmentSection = screen.getByTestId('entertainment-section');

        expect(within(entertainmentSection).getByText('Bowling')).toBeInTheDocument();

    })
})
