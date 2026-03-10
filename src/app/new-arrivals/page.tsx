'use client';
import NewArrivals from "@/components/landingPage/NewArrivals";
import { useFilterContext } from '@/context/FilterContext';
import { useEffect } from 'react';
import { useGetNewestProductsQuery } from '@/redux/features/home/homeSlice';

const page = () => {
  const { selectedCategory, searchQuery } = useFilterContext();

  const { data: newArrivalsData } = useGetNewestProductsQuery({
    searchTerm: searchQuery,
    product_category: selectedCategory || ''
  });

  useEffect(() => {
    console.log('New Arrivals Page - Category:', selectedCategory);
    console.log('New Arrivals Page - Search:', searchQuery);
    console.log('New Arrivals API Response:', newArrivalsData);
  }, [selectedCategory, searchQuery, newArrivalsData]);

  return (
    <div>
      <NewArrivals 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory}
        products={newArrivalsData?.data?.data || []}
      />
    </div>
  );
};

export default page;
