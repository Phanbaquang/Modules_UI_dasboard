import { Input, inputClasses } from '@mui/base/Input';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { styled } from '@mui/system';
import { Controller, useForm } from "react-hook-form";
import { useStoreModal } from '../../../store/ModalState/modalState';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MultiImageUploader from '../../ButtonChooseImage';
import servicesInstance from '../../../lib/Service';
import { useCategoryStore } from '../../../store/category';
type Color = {
    name: string;
    codeColor: string;
    id: string;
};

type SizeItem = {
    sizeName: string;
    quantity: number;
};

type ProductSizeDetail = {
    color: Color;
    size: SizeItem[];
};

type SizeDetailArray = ProductSizeDetail[];
const color: Color[] = [
    { name: 'ĐỎ', codeColor: 'FF0000', id: "1" },
    { name: 'Hồng nhạt', codeColor: 'F0728F', id: "2" },
    { name: 'Xanh đậm', codeColor: '000080', id: "3" },
    { name: 'Xanh nhạt', codeColor: '67F0E5', id: "4" },
    { name: 'Trắng', codeColor: 'FFF', id: "5" },
    { name: 'Đen', codeColor: '000', id: "6" },

]
const ModalProduct = () => {
    const { closeModal } = useStoreModal(state => state)
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedColor, setSelectedColor] = useState<Color[]>(color);
    const [colorValue, setColorValue] = useState<string>('');
    const [sizeDetail, setSizeDetail] = useState<SizeDetailArray>([]);
    const { categories } = useCategoryStore(state => state)

    const [options, setOptions] = useState<string[]>(['L', 'XL', 'S', "M", "XXL", "XXXL"]);
    const [value, setValue] = useState<string[]>([]);
    const onSubmit = async (data: any) => {
        console.log(data, 'data')
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        })
        selectedFiles.forEach((file) => {
            formData.append("image[]", file);
        });
        formData.append("sizeDetail", JSON.stringify(sizeDetail));
        try {

            await servicesInstance.post('/product', formData)
        } catch (error) {
        }

    };





    const defaulesizeDetail: ProductSizeDetail = {
        color: { name: "red", codeColor: "FF0000", id: "1" },
        size: value.map((item: string): SizeItem => ({
            sizeName: item,
            quantity: 0,
        })),
    };

    const handleChangeDetailSize = (index: number, sizeIndex: number, value: number) => {
        setSizeDetail((prev) => {
            const newSizeDetail = [...prev];
            const item = newSizeDetail[index];

            const updatedSize = [...item.size];
            updatedSize[sizeIndex] = {
                ...updatedSize[sizeIndex],
                quantity: value,
            };

            newSizeDetail[index] = {
                ...item,
                size: updatedSize,
            };

            return newSizeDetail;
        });
    };
    const onDeleteSizeDetail = (index: number, sizeName: string) => {
        setSizeDetail((prev) => {
            const newSizeDetail = [...prev];
            const item = newSizeDetail[index];

            const updatedSize = item.size.filter((item) => item.sizeName !== sizeName);

            newSizeDetail[index] = {
                ...item,
                size: updatedSize,
            };

            return newSizeDetail;
        });
    }



    return (
        <div style={{ width: '50vw', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className='flex justify-end'>
                <span onClick={closeModal} className='cursor-pointer'> <CloseIcon /> </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-4'>
                    <Controller
                        name="productName"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Tên không được bỏ trống" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Tên sản phẩm"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Email bắt buộc" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Giá sản phẩm"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.category_id}>
                        <InputLabel id="category_id-label">Danh mục sản phẩm</InputLabel>
                        <Controller
                            name="category_id"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Chọn danh mục sản phẩm" }}
                            render={({ field }) => (
                                <Select
                                    {...field}  // Đảm bảo value và onChange được cung cấp bởi react-hook-form
                                    labelId="category_id-label"
                                    label="Danh mục sản phẩm"
                                >
                                    {
                                        categories.map(item => (
                                            <MenuItem value={item?._id}>{item?.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Mô tả ngắn" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Mô tả ngắn"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name="Sales"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Sale"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name="hot"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                                <InputLabel id="hot-label">Sản phẩm hot</InputLabel>
                                <Select
                                    labelId="hot-label"
                                    label="Sản phẩm hot"
                                    {...field}
                                >
                                    <MenuItem value="">Chọn</MenuItem>
                                    <MenuItem value="true">Có</MenuItem>
                                    <MenuItem value="false">Không</MenuItem>
                                </Select>
                                {fieldState.error && (
                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="descriptionDetail"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Mô tả chi tiết" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Mô tả chi tiết "
                                fullWidth
                                margin="normal"
                                {...field}
                                rows={4}
                                multiline
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <MultiImageUploader setSelectedFiles={setSelectedFiles} />

                    <Controller
                        name="descriptionDetail"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Mô tả chi tiết" }}
                        render={({ field, fieldState }) => (
                            <Autocomplete
                                multiple
                                freeSolo
                                options={options}
                                value={value}
                                onChange={(event, newValue) => {
                                    // loại bỏ các giá trị trùng nhau
                                    const unique = [...new Set(newValue.map(item => (typeof item === 'string' ? item : item)))];
                                    setValue(unique);

                                    // nếu có item mới (chưa trong options), thì thêm vào options
                                    const newItems = unique.filter(
                                        item => typeof item === 'string' && !options.includes(item)
                                    );
                                    if (newItems.length > 0) {
                                        setOptions(prev => [...prev, ...newItems]);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Chọn size"
                                        placeholder="Nhập để thêm..."
                                    />
                                )}
                            />
                        )}
                    />
                    <div className='flex  gap-2'>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chọn màu sắc"
                            value={colorValue}
                            onChange={(e) => setColorValue(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#bfedf5', // màu nền dropdown
                                    },
                                },
                            }}
                            sx={{ flexGrow: 1 }}
                        >
                            {
                                selectedColor.map((item) => (
                                    <MenuItem value={item?.id} >
                                        <span style={{ color: `#${item?.codeColor}`, fontWeight: 'bold' }}>

                                            {item?.name}
                                        </span>
                                    </MenuItem>
                                ))
                            }

                        </Select>
                        {
                            value && colorValue &&
                            <Button variant="contained" color="primary" onClick={() => setSizeDetail((pre) => {
                                const foundColor = selectedColor.find((item) => item?.id === colorValue);
                                if (!foundColor) return pre;

                                setSelectedColor((prev) => prev.filter((item) => item?.id !== colorValue));

                                return [...pre, { ...defaulesizeDetail, color: foundColor }];
                            })}>
                                Tạo size
                            </Button>
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    {
                        sizeDetail?.map((item, index) => (
                            <div className='grid grid-cols-2 gap-4 items-center p-4 b'>
                                <span>
                                    <DeleteIcon />
                                    <span style={{ color: `#${item?.color?.codeColor}`, fontWeight: 'bold' }}>
                                        {item?.color?.name}
                                    </span>
                                </span>
                                <div className='flex flex-col gap-2'>
                                    {
                                        item?.size.map((sizeItem: SizeItem, sizeIndex: number) => (
                                            <span style={{ fontWeight: 'bold' }} className='flex gap-2 items-center'>
                                                {sizeItem?.sizeName}: <TextField
                                                    variant="outlined"
                                                    label="Số lượng"
                                                    placeholder="Nhập số lượng"
                                                    value={sizeItem?.quantity}
                                                    onChange={(e) => handleChangeDetailSize(index, sizeIndex, Number(e.target.value))}
                                                />
                                                <span onClick={() => onDeleteSizeDetail(index, sizeItem?.sizeName)} className='cursor-pointer'>
                                                    <CloseIcon />
                                                </span>
                                            </span>
                                        ))
                                    }
                                </div>


                            </div>
                        ))

                    }
                </div>

                <Button type="submit" variant="contained" color="primary">
                    Thêm
                </Button>
            </form>
        </div>
    )
}

export default ModalProduct
const fruits = [
    { label: 'Apple', id: 1 },
    { label: 'Banana', id: 2 },
    { label: 'Cherry', id: 3 },
];

function useEFect(arg0: () => void, arg1: never[]) {
    throw new Error('Function not implemented.');
}
