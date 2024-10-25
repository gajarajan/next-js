import { getCategorylist, getProjectbyCategory } from '@/app/_ulit/GlobalApi'
import React from 'react'
import TopCategoryList from '../_components/TopCategoryList';
import ProductList from '@/app/_component/ProductList';

export default async function ProductCategory({params}) {
    const productList=await getProjectbyCategory(params.categoryName);
    const getcategorylist=await getCategorylist();
  return (
    <div>
        <h2 className='p-4 bg-primary text-white font-bold text-3xl text-center'>
    
    {params.categoryName}
  </h2>
<TopCategoryList getcategorylist={getcategorylist} selectedCategory={params.categoryName} />
<div className='p-5 md:p-10'><ProductList productList={productList}/></div>
    </div>
  ) 
}
