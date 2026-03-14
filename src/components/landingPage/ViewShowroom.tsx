import React from 'react';
import TopPoduct from './TopPoduct';
import { useGetShowroomProductQuery } from '@/redux/features/home/homeSlice';

const ViewShowroom = () => {
 
    const {data: showroomProduct} = useGetShowroomProductQuery(shworoomId)

    return (
        <div>
            <h1>view showroom product</h1>
        </div>
    );
};

export default ViewShowroom;