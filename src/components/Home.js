import React from 'react';
import Card from './Card';
import data from '../data/temp.json'; // Adjust the path if necessary
// import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container mx-auto px-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((card, index) => (
                    
                    <Card
                        key={index}
                        img={card.img}
                        jobslip={card.jobslip}
                        itemName={card.title}
                        status={card.status}
                        category={card.category}
                        fabricator={card.fabricator}
                        clothname={card.clothname}
                        quality={card.quality}
                        meter={card.meter}
                    />
                    
                ))}
            </div>
        </div>
    );
}
