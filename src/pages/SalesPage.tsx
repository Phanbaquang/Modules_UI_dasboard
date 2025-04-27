import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Button, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { CloudUpload, Edit, Add } from "@mui/icons-material";
import { set, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import servicesInstance from "../lib/Service";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface IFormInput {
	name: string;
	image: FileList | null;
	description: string;
	categoryId: string;
}

const SalesPage = () => {
	const [deaafultValues, setDefaultValues] = useState<
		{
			_id: string;
			name: string;
			description: string;
		}
	>()

	const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<IFormInput>({
		defaultValues: {},
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [idUpdate, setidUpdate] = useState<string>("");
	const categoryId = watch("categoryId");
	const onSubmit = async (data: IFormInput) => {

		const formData = new FormData();

		formData.append("name", data.name);
		formData.append("description", data.description);

		if (imageFile) {
			formData.append("image", imageFile);
		}
		if (edit) {
			formData.append("_id", idUpdate);
			try {
				const response = await servicesInstance.put("/categoryId", formData);
				if (response) {
					console.log(response, 'fdsfsdfds')
					toast.success("Category updated successfully!");
					setCategoryData((prev) => prev.map((item) => item._id === idUpdate ? { ...item, ...response.data } : item));
				} else {
					toast.error("Failed to update category!");
				}
			} catch (error) {
				toast.error("Failed to update category!");
			}

		} else {
			try {
				const response = await servicesInstance.post("/category", formData);
				if (response) {
					toast.success("Category created successfully!");
					setCategoryData((prev) => [
						response.data,
						...prev,
					]);
					reset({
						description: '',
						name: ''
					})
				} else {
					toast.error("Failed to create category!");
				}
			} catch (error) {
				toast.error("Failed to create category!");
			}
		}

	};
	// Xử lý file image upload
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setImageFile(file); // Lưu file ảnh vào state
			setImagePreview(URL.createObjectURL(file)); // Hiển thị ảnh preview
		}
	};

	// Xử lý xóa ảnh
	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null); // Xóa ảnh preview và file
	};
	const [edit, setEdit] = useState<boolean>(false);
	const handleEdit = (id: string) => {
		const categoy = categoryData.find((item) => item._id === id)
		setidUpdate(id)
		reset({
			name: categoy?.name,
			description: categoy?.description,
		})
		setImagePreview(categoy.image);
		setEdit(true);
	};

	const handleCreateSubCategories = (id: string) => {
		setValue("categoryId", id);
	}

	const onCreateSubCategory = async (data: IFormInput) => {
		console.log(data, 'data')
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("description", data.description);
		formData.append("categoryId", data.categoryId);
		if (imageFile) {
			formData.append("image", imageFile);
		}
		try {
			const response = await servicesInstance.post("/sub_category", formData);
			if (response) {
			} else {
				toast.error("Failed to create Sub category!");
			}
		} catch (error) {
			toast.error("Failed to create Sub category!");
		}
	}


	const handleDelete = async (id: string, imageName: string) => {
		try {
			const response = await servicesInstance.delete('/categoryId', {
				params: {
					_id: id,
					imageName: imageName
				}
			});
			if (response) {
				setCategoryData((prev) => prev.filter((category) => category._id !== id));
				toast.success('Delete success!');
			}
		} catch (error) {
		}
	};
	const [categoryData, setCategoryData] = useState<any[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await servicesInstance.get('/category');
				if (res?.data?.data) {
					setCategoryData(res?.data?.data);
				}
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		}
		fetchData();
	}, []);

	const handelCancel = () => {
		setEdit(false);
		reset({
			name: "",
			description: "",
		})
		setImagePreview(null);
	}
	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Category" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Category</h2>

					<form onSubmit={handleSubmit(categoryId ? onCreateSubCategory : onSubmit)} className="space-y-4">
						<div>
							{
								categoryId && (
									<TextField
										label="Category Id"
										variant="outlined"
										fullWidth
										{...register("categoryId", {
											required: "Category Id is required",
											maxLength: { value: 50, message: "Category Id is too long" }
										})}
										error={!!errors.categoryId}
										helperText={errors.categoryId?.message}
										className="mb-4"
										slotProps={{
											inputLabel: { shrink: true },
										}}
										disabled
										value={categoryData?.find((item) => item._id === categoryId)?.name || ""}
									/>
								)
							}
						</div>
						{/* Name */}
						<div>
							<TextField
								label="Category Name"
								variant="outlined"
								fullWidth
								{...register("name", { required: "Name is required", maxLength: { value: 50, message: "Name is too long" } })}
								error={!!errors.name}
								helperText={errors.name?.message}
								className="mb-4"
								slotProps={{
									inputLabel: { shrink: true },
								}}
							/>
						</div>


						{/* Custom Image Upload */}
						<div className="flex items-center justify-start gap-4">
							<input
								type="file"
								accept="image/*"
								{...register("image", { required: imagePreview ? false : "Image is required" })}
								onChange={handleImageChange}
								className="hidden"
								id="image-upload"
							/>
							<label htmlFor="image-upload">
								<Button
									variant="contained"
									component="span"
									color="primary"
									startIcon={<CloudUpload />}
									className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								>
									Choose Image
								</Button>
							</label>
							{errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
						</div>

						{/* Image Preview */}
						{imagePreview && (
							<div className="mb-4 flex flex-col items-center">
								<img
									src={imagePreview}
									alt="Image Preview"
									className="w-[200px] h-[200px] object-cover rounded-md shadow-md"
								/>
								<Button
									variant="outlined"
									color="secondary"
									onClick={handleRemoveImage}
									className=" w-[200px] mt-4"
									sx={{ marginTop: '12px' }}
								>
									Remove Image
								</Button>
							</div>
						)}

						{/* Description */}
						<div>
							<TextField
								label="Description"
								variant="outlined"
								multiline
								rows={4}
								fullWidth
								{...register("description")}
								className="mb-4"
								slotProps={{
									inputLabel: { shrink: true },
								}}
							/>
						</div>

						{/* Submit Button */}
						{
							edit ? (
								<>
									<Button type="submit" variant="contained" color="primary" fullWidth>
										Update Category
									</Button>
									<Button onClick={handelCancel} variant="contained" color="error" fullWidth>
										Cancel
									</Button>
								</>
							) : (
								<Button type="submit" variant="contained" color="primary" fullWidth>
									{categoryId ? "Create Sub Category" : "Create Category"}
								</Button>
							)
						}

					</form>
				</div>
				<TableContainer
					component={Paper}
					sx={{
						marginTop: 4,
						backgroundColor: 'transparent', // Make background transparent
						color: 'white', // Set text color to white
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell className="font-bold text-white" style={{ color: '#fff' }}>Category Name</TableCell>
								<TableCell className="font-bold text-white" style={{ color: '#fff' }}>Image</TableCell>
								<TableCell className="font-bold text-white" style={{ color: '#fff' }}>Description</TableCell>
								<TableCell className="font-bold text-white" style={{ color: '#fff' }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categoryData.map((category) => (
								<TableRow key={category.id}>
									<TableCell style={{ color: '#fff' }}>{category.name}</TableCell>
									<TableCell>
										<img
											src={category.image}
											alt={category.name}
											className="w-16 h-16 object-cover rounded-md"
										/>
									</TableCell>
									<TableCell style={{ color: '#fff' }}>{category.description}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											size="small"
											onClick={() => handleEdit(category._id)}
											className="mr-2 text-white border-white hover:bg-gray-700"
										>
											<Edit fontSize="small" />
											Edit
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											size="small"
											onClick={() => handleDelete(category._id, category.imageName[0])}
											className="text-white border-white hover:bg-gray-700"
										>
											<Trash2 size={18} />
											Delete
										</Button>
										<Button
											variant="outlined"
											color="info"
											size="small"
											onClick={() => handleCreateSubCategories(category._id)}
											className="text-white border-white hover:bg-gray-700"
										>
											<Add />
											Create sub categories
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

			</main>
		</div>
	);
};

export default SalesPage;
