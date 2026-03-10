'use client';
import AllHotdealsProduct from "@/components/landingPage/AllHotdealsProduct";
import { useFilterContext } from '@/context/FilterContext';
import { useEffect } from 'react';
import { useGetHotDealsQuery } from '@/redux/features/home/homeSlice';

const page = () => {
  const { selectedCategory, searchQuery } = useFilterContext();

  const { data: hotDealsData } = useGetHotDealsQuery({
    searchTerm: searchQuery,
    product_category: selectedCategory || ''
  });

  useEffect(() => {
    console.log('Hot Deals Page - Category:', selectedCategory);
    console.log('Hot Deals Page - Search:', searchQuery);
    console.log('Hot Deals API Response:', hotDealsData);
  }, [selectedCategory, searchQuery, hotDealsData]);

  return (
    <div>
      <AllHotdealsProduct 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory}
        products={hotDealsData?.data?.data || []}
      />
    </div>
  );
};

export default page;
