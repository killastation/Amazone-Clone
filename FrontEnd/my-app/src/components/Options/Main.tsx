import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiProductSlice, useGetProductsQuery } from '../../features/user/apiProductSlice';
import { ImageLink, Product, categorySequence } from '../types';
import { apiCategorySlice, useGetCategoriesQuery, useGetMainCategoriesQuery } from '../../features/user/apiCategorySlice';
import "../../css/stars.css";
import { Oval } from  'react-loader-spinner'

const loader=()=> {
  return(
    <div className='m-auto pt-32'>
    <Oval
      height={80}
      width={80}
      color="#46424f"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#424a4f"
      strokeWidth={2}
      strokeWidthSecondary={2}/>
</div>

  )
}

const Product_Component=({ data , productsImages}: { data: Product ,productsImages:ImageLink})=>{
  var stars = 0;

  const handleStarsFunctionality=()=>{
    var sumOfStars = 0;
    data.comments.map(com=>sumOfStars += com.stars);
    stars = Math.round(sumOfStars/(data.comments.length));
  }

  const getStarts=()=>{
    var jsx_stars: JSX.Element[] = [];
    handleStarsFunctionality();
    for(var i = 0;i<5;i++)
    {
      if(i<stars)
      {
        jsx_stars.push(<div key={i} className='star-small ml-0.5'/>);
      }
      else
      {
        jsx_stars.push(<div key={i} className='empty_star-small h-3 ml-0.5' />);
      }
    }

    return jsx_stars;
  }


  return<>
  <div >
  <Link to={"/product/" + data.id}>
    <div className='pb-2 px-3 mt-20 w-full'>
      <div>
          <div className='w-full h-[160px]' style={{ backgroundImage:"url("+ productsImages?.image +")",backgroundPosition:"center",backgroundSize:"contain",backgroundRepeat:"no-repeat"}}>

            </div>
            {/* <img src={data?.image ? "data:image/png;base64," + data?.image : img} className=' w-full h-[100px] ' />         */}
          </div>
          <div className='p-1 '>
            <div className=' max-h-[60px] overflow-hidden '>
              <p className='text-blue-950 text-sm hover:text-red-700 cursor-pointer hover:underline '>
                {data.name}
              </p>
            </div>

          <div className='flex'>
            {getStarts()}
            <span className='ml-1 text-blue-950 hover:text-red-700 cursor-pointer hover:underline text-[12px] font-medium'>{data.comments.length}</span>
          </div>

          <p className='text-sm text-red-700 font-medium'>$ {data.price}</p>
        </div>
      </div>
    </Link>
  </div>
  </>
}


const Main = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);





  const { data, isSuccess, error } = useMemo(() => useGetProductsQuery(), []);



  const { data: categories, isSuccess: isSuccessCategory } = useGetMainCategoriesQuery();
  const [getSubcategories, { }] = apiCategorySlice.useGetAllSubcategoriesByCategoryIdMutation();

  const [getProductsByCategory, { isLoading }] = apiProductSlice.useGetProductsByCategoryIdMutation();

  var request:any=[];
  data?.payload?.forEach((data:any) => {
    request.push({id:data.id});
  });

  const { data: imagesLinks, isSuccess: isSuccessImagesLinks } = apiProductSlice.useGetLinksForProductByProductsIdsQuery(request) as {
    data: ImageLink[];
    isSuccess: boolean;
  };;  

  console.log(imagesLinks);

  const navigate = useNavigate();

  const getSearchParams = () => {
    return new URLSearchParams(window.location.search);
  };

  var [categoryId, setcategoryId] = useState(getSearchParams().get('id'));




  var [categoriesToView, setCategoriesToView] = useState([]);
  var [products, setProducts] = useState([]);

  var [categoriesSequence, setCategoriesSequence] = useState<categorySequence[]>([]);
  var url = `/products?category=${encodeURIComponent("")}`;

  // console.log("products");
  // console.log(products);


  useEffect(()=>{
    if(categories)
      setCategoriesToView(categories?.payload);

    // console.log("categoriesToView");
    // console.log(categoriesToView);



    // const category = searchParams.get('category');
    getProducts();
    // setProducts();

  }, [categories, categoryId])

  

  const getProducts = async () => {
    var id = parseInt(getSearchParams().get('id')!);

    if (!Number.isInteger(id)) {
      id = -1;
    }
    let response: any = await getProductsByCategory({ id: id });

    // console.log(categoryId);
    // console.log("RESPONSE:");
    // console.log(response.data.payload);

    setProducts((prevProducts) => response?.data?.payload);
  }


  const changeCategory = async (id: number, name: string) => {
    let response: any = await getSubcategories({ id: id });
    // console.log(id);
    // console.log("RESPONSE:");
    // console.log(response.data.payload.subcategories);

    url = `/products?category=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`
    navigate(url);
    if (response?.data?.payload?.subcategories?.length != 0) {

      setCategoriesToView(response?.data?.payload?.subcategories);

      const newCategoriesSequence = [...categoriesSequence];

      const index = newCategoriesSequence.findIndex((category) => category.id === id);
      if (index !== -1) {
        newCategoriesSequence.splice(index + 1);
        setCategoriesSequence(newCategoriesSequence);
      }
      else {
        newCategoriesSequence.push({ id: id, name: name });
        setCategoriesSequence(newCategoriesSequence);
      }

      // console.log(newCategoriesSequence);
    }

    await getProducts();
  }

  const setMainCategories = async () => {
    url = `/products`;
    navigate(url);

    setCategoriesToView(categories?.payload);
    setCategoriesSequence([]);


    await getProducts();
  }

  return (
    <div className='flex p-2 '>

      <div className='whitespace-nowrap pl-2 pr-2 mt-2'>

        <div>
          <h1 className='text-[30px] font-bold'>
            Best Sellers
          </h1>
        </div>

        <div className='ml-3 mt-10'>
          <div onClick={() => { setMainCategories() }} className='font-medium text-sm cursor-pointer'>All Categories</div>

          <div className='ml-1 font-medium text-sm'>
            {categoriesSequence ? categoriesSequence?.map((category: any, id: number) => (
              <div className=' cursor-pointer hover:underline' style={{ marginLeft: id * 6 }} onClick={() => { changeCategory(category.id, category.name) }} key={category.id}>{category.name}</div>
            )) : ""}
          </div>

          <div className='ml-3 text-sm'>
            {categoriesToView?.map((category: any) => (
              <div className=' cursor-pointer hover:underline' onClick={() => { changeCategory(category.id, category.name) }} key={category.id}>{category.name}</div>
            ))}
          </div>
        </div>

        {/* idk */}
        {/* {isSuccessCategory ? categories.payload.map((a:any,id:number)=>{return <div key={id}>
          <div className='text-blue-950 cursor-pointer hover:underline'>{a.name}</div>
          <div className='ml-2'>
            {a.subcategories?.map((sub:any,id:number)=>{return <p key={id} onClick={()=>{toNextCategory(sub.id)}} className='text-blue-950 cursor-pointer hover:underline'>{sub.name}</p>  })}
          </div>
          { fetchedSubcategories ? fetchedSubcategories.map((sub:any,id:number)=>{return <div key={id}>{sub.name}</div>}) : "g"}
        
        
        </div> }) : ""} */}




        {/* <div className='text-blue-950 cursor-pointer hover:underline'>sdfds</div> */}
      </div>

      {!isLoading?
      <div className='grid grid-cols-6 gap-1 pr-44 pl-24 w-full'>
        {/* grid */}
        {products?.map((product: Product, id: number) => {
          const b: Product = product;
          return <div key={id}>{<Product_Component  data={b} productsImages={imagesLinks?.find((img:ImageLink)=>img.productId==product.id)!} />}</div> })}
      </div>
      :loader()}
    </div>
  )
}

export default Main