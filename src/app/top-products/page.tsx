'use client';
import TopPoduct from '@/components/landingPage/TopPoduct';
import { useFilterContext } from '@/context/FilterContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { useGetTopProductsQuery, useGetHomeCategoriesQuery } from '@/redux/features/home/homeSlice';

const page = () => {
  const { searchQuery } = useFilterContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { data: categoriesRes } = useGetHomeCategoriesQuery();
  const categories = categoriesRes?.data ?? [];

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
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
};

export default page;