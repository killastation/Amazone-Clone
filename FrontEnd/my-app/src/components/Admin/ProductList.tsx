import { apiProductSlice, useGetProductsQuery } from "../../features/user/apiProductSlice";
import { Product } from "../types";



export const ProductList=()=>{

    const [deleteProduct_,{}] = apiProductSlice.useDeleteProductMutation();

    const deleteProductHandle=(id:number)=>{
        deleteProduct_({id:id});
    }
    
    const {data:products,isSuccess}:{data?: { payload: Product[] },isSuccess:boolean} = useGetProductsQuery();
    return <>
      {
      isSuccess ? products?.payload?.map((product:Product) => (
    <li key={product.id} className="flex justify-between gap-x-6 py-5">
      <div className="flex gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{product.name}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{product.name}</p>
        </div>
      </div>

      <div className="">
        <button
         type="button"
         onClick={()=>{deleteProductHandle(product.id)}}
         className="mt-2 mr-1 inline-flex items-center rounded-md  cursor-pointer  bg-rose-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
         Delete
          </button>
          <button
         type="button"
         className="mt-2 mr-1 inline-flex items-center rounded-md  cursor-pointer  bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
         Edit
          </button>

      </div>
    </li>
  )):""}
  </>;
  }