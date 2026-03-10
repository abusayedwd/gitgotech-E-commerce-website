'use client';
import TopPoduct from '@/components/landingPage/TopPoduct';
import { useFilterContext } from '@/context/FilterContext';
import { useEffect } from 'react';
import { useGetTopProductsQuery } from '@/redux/features/home/homeSlice';

const page = () => {
  const { selectedCategory, searchQuery } = useFilterContext();

  const { data: topProductsData } = useGetTopProductsQuery({
    searchTerm: searchQuery,
    product_category: selectedCategory || ''
  });

  useEffect(() => {
    console.log('Top Products Page - Category:', selectedCategory);
    console.log('Top Products Page - Search:', searchQuery);
    console.log('Top Products API Response:', topProductsData);
  }, [selectedCategory, searchQuery, topProductsData]);

  return (
    <div>
      <TopPoduct 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory}
        products={topProductsData?.data?.data || []}
      />
    </div>
  );
};

export default page;