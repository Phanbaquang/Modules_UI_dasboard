import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useStoreModal } from "../../store/ModalState/modalState";
import ModalProduct from "../ModalGlobal/Product";
import servicesInstance from "../../lib/Service";
import { useCategoryStore } from "../../store/category";
import { toast } from "react-toastify";

interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	img: string;
	quanity: number;
	imageName: string[];
	sale?: number;
}

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const { openModal, isOpen } = useStoreModal(state => state);
	const { setCategories, categories , settotalProduct } = useCategoryStore(state => state)
	const [productsData, setProductsData] = useState([])

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		try {

			const filtered = products.filter((product) =>
				product.name?.toLowerCase().includes(term) ||
				product.category?.toLowerCase().includes(term)
			);
			setFilteredProducts(filtered);
		} catch (error) {
			console.log()
		}


	};
	const getTotalQuantity = (data: any) => {
		return data.reduce((total: number, item: any) => {
			const sizeTotal = item.size.reduce((sum: any, s: any) => sum + s.quantity, 0);
			return total + sizeTotal;
		}, 0);
	};
	useEffect(() => {
		let categories: any[] = []
		const fetchCategory = async () => {
			const res = await servicesInstance.get('/category')
			if (res?.data) {
				categories = res.data?.data
				setCategories(res.data?.data)
			}

		}
		fetchCategory()
		const fetchData = async () => {
			try {
				const res = await servicesInstance.get('/product');
				if (res?.data?.data) {
					const data: Product[] = res.data.data.map((item: any) => ({
						id: item._id,
						name: item.productName,
						price: Number(item.price),
						category: categories?.find(_item => _item?._id === item?.category_id)?.name || 'Unknown',
						img: item.image ? item.image.split(',')[0] : '',
						quanity: getTotalQuantity(item.sizeDetail) || 0,
						sale: item.sale || 0,
						imageName: item?.imageName
					}));
					categories?.find(_item => _item?._id === res.data.data[0]?.category_id)
					console.log(categories?.find(_item => _item?._id === res.data.data[0]?.category_id), 'fdsfdsfdsfd')
					setProducts(data);
					setFilteredProducts(data);
					setProductsData(res.data.data)
					settotalProduct(res.data.totalCount)
				}
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};


		fetchData();
	}, [!isOpen]);

	const handleDeleProduct = async (id: string, imageName: string[]) => {

		try {
			const res = await servicesInstance.delete('/productId', {
				params: {
					_id: id,
					imageName: imageName, // mảng tên ảnh
				},
				paramsSerializer: params => {
					return new URLSearchParams(params).toString();
				}
			});
			if (res?.data) {
				const filteProduct = products?.filter(item => item?.id !== id)
				setProducts(filteProduct);
				setFilteredProducts(filteProduct);
				toast.success('Delete product success!')
			} else {
				toast.error('Delete product fail!')
				
			}
			
		} catch (error) {
				toast.error('Delete product fail!')

		}

	}



	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'>

				<div className='flex justify-between items-center mb-6 gap-4 flex-wrap'>
					<h2 className='text-xl font-semibold text-gray-100'>Product List</h2>

					<div onClick={() => openModal(<ModalProduct productData={undefined} />)} className='cursor-pointer text-green-400 hover:text-green-300'>
						<AddBoxIcon fontSize="large" />
					</div>

					<div className='relative w-full max-w-xs'>
						<input
							type='text'
							placeholder='Search products...'
							className='w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
							onChange={handleSearch}
							value={searchTerm}
						/>
						<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Category</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Price</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Quanity</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Sales</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{filteredProducts.map((product) => (
								<motion.tr
									key={product.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
										<img src={product.img} alt='Product img' className='size-10 rounded-full' />
										{product.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${product.price.toFixed(2)}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.quanity}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.sale}%</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
											<Edit size={18} onClick={() => openModal(<ModalProduct  productData={productsData?.find(item => item?._id === product?.id)} />)} />
										</button>
										<button className='text-red-400 hover:text-red-300'>
											<Trash2 size={18} onClick={() => handleDeleProduct(product?.id, product.imageName)} />
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</motion.div>
	);
};

export default ProductsTable;
