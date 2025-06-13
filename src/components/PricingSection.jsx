import React from "react";
import '../styles/pricing_page.css'
import pricingData from '../data/pricingData.json';


const PricingSection = () => {
  return (
    <>
  
     <section id="pricing" className="py-16 px-6 md:px-12 bg-gray-50">
      <h3 className="text-3xl font-bold text-center mb-10">OUR DAILY PRODUCTS</h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingData.map(({ id, image, title, price, rating, purchases }) => (
          <div key={id} className="bg-white p-6 rounded-xl shadow-md text-center">
            <img src={image} alt={title} className="mx-auto mb-4 rounded-lg w-36 h-36 object-cover" />
            <h4 className="font-bold text-xl mb-2">{title}</h4>
            <p className="text-2xl font-semibold mb-2">${parseFloat(price).toFixed(2)}</p>
           
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default PricingSection;
