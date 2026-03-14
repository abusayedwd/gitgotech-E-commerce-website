'use client';
import AllHotdealsProduct from "@/components/landingPage/AllHotdealsProduct";
import { useFilterContext } from '@/context/FilterContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { useGetHotDealsQuery, useGetHomeCategoriesQuery } from '@/redux/features/home/homeSlice';

const page = () => {
  const { searchQuery } = useFilterContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { data: categoriesRes } = useGetHomeCategoriesQuery();
  const categories = categoriesRes?.data ?? [];

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
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
};

export default page;
