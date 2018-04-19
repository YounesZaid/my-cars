import React from 'react';

const CarItem = ({ car, deleteCar }) => (
   <div className="pt-card pt-elevation-0 pt-interactive car-item">
      <h5><a href="#carName">{car.carName}</a></h5>
      <img src="data:image/png;base64,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" alt="#carName"/>
      <p>Back-end infrastructure for integrating, managing, 
         and securing data of any kind,
            from any source, at massive scale.
      </p>
      <a href="#deleteCar" onClick={e => {
         e.preventDefault();
         deleteCar(car.carId);
      }}><i className="zmdi zmdi-close zmdi-hc-2x"></i></a>
   </div>
)

export default CarItem;