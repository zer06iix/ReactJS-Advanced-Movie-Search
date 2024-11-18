/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import Slide from '../Slide';

const CurrentSlide = forwardRef(({ slide }, ref) => {
    return <Slide slide={slide} posterDetail={true} ref={ref} />;
});

export default CurrentSlide;
