import React, { useEffect, useState } from "react";
import DashBox from "@/components/DashBox";
import DashBoxHeader from "@/components/DashBoxHeader";
import FlexBetween from "@/components/FlexBetween";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/state/api";
import { Box, FormControl, FormHelperText, FormLabel, IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "@/components/CustomModal";
import AddButton from "@/components/AddButton";
import PageNumberNav from "@/components/PageNumberNav";

const Products = () => {
    const { palette } = useTheme();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 100;
    const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ description: "", expense: "", price: "" });
    const [errors, setErrors] = useState({ description: "", expense: "", price: "" });

    const { data: productData, refetch } = useGetProductsQuery({ page: currentPage, limit: limit });
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleModalOpen = (type: "add" | "edit", productId?: string) => {
        setModalType(type);
        if (type === "add") {
            resetForm();
        } else if (type === "edit" && productId) {
            const productToEdit = productData?.products?.find((p) => p.id === productId);
            if (productToEdit) {
                setSelectedProductId(productToEdit.id);
                setFormData({
                    description: productToEdit.description || "",
                    expense: (productToEdit.expense / 100).toFixed(2) || "",
                    price: (productToEdit.price / 100).toFixed(2) || "",
                });
            }
        }
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const resetForm = () => {
        setSelectedProductId(null);
        setFormData({ description: "", expense: "", price: "" });
        setErrors({ description: "", expense: "", price: "" });
    };

    const handleModalClose = () => {
        setModalType(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        // letters, numbers, and spaces
        const nameRegex = /^[a-zA-Z0-9\s]*$/;
        // numbers only, 2 d.p
        const priceRegex = /^\d*\.?\d{0,2}$/;

        let isValid = true;

        if (name === "description") {
            isValid = nameRegex.test(value);
        } else if (name === "expense" || name === "price") {
            isValid = priceRegex.test(value);
        }

        if (isValid) {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "Invalid input" }));
        }
    };

    const validateForm = () => {
        const newErrors = { description: "", expense: "", price: "" };
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.expense) newErrors.expense = "Expense is required";
        if (!formData.price) newErrors.price = "Price is required";
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const product = {
            description: formData.description,
            expense: Math.round(parseFloat(formData.expense) * 100),
            price: Math.round(parseFloat(formData.price) * 100),
        };

        try {
            if (modalType === "add") {
                await createProduct(product);
            } else if (modalType === "edit" && selectedProductId) {
                await updateProduct({ id: selectedProductId, product });
            }
            await refetch();
            handleModalClose();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (selectedProductId) {
            const confirmed = window.confirm("Are you sure you want to delete this product?");
            if (confirmed) {
                try {
                    await deleteProduct(selectedProductId);
                    await refetch();
                    handleModalClose();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    const renderEditButton = (params: GridCellParams) => (
        <Box display="flex" height="100%">
            <IconButton
                onClick={() => handleModalOpen("edit", params.row.id)}
                sx={{
                    color: palette.grey[800],
                    "&:hover": { color: palette.primary[400] },
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    const productColumns = [
        { field: "description", headerName: "Name", flex: 0.7 },
        { field: "id", headerName: "Product ID", flex: 1.3 },
        { field: "expense", headerName: "Expense", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toFixed(2)}` },
        { field: "price", headerName: "Price", flex: 0.5, valueFormatter: (value: number) => `$${(value / 100).toFixed(2)}` },
        { field: "edit", headerName: "", flex: 0.1, sortable: false, renderCell: renderEditButton },
    ];

    const renderModalContent = () => (
        <Box margin="2rem 1rem">
            <FormControl fullWidth>
                <FormLabel sx={{ fontSize: "medium", marginBottom: "1.5rem" }}><b>{modalType === "add" ? "Enter new product details:" : "Update existing product details:"}</b></FormLabel>
                <Box>
                    <TextField
                        label="Product name"
                        name="description"
                        variant="outlined"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <FormHelperText sx={{ margin: "0 0 1rem 0" }}>
                        {modalType === "add" ? "Unique product ID will be generated automatically" : ""}
                    </FormHelperText>
                </Box>
                <TextField
                    label="Expense"
                    name="expense"
                    type="text"
                    value={formData.expense}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.expense}
                    helperText={errors.expense}
                    slotProps={{
                        input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }
                    }}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.price}
                    helperText={errors.price}
                    slotProps={{
                        input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }
                    }}
                />
            </FormControl>
        </Box>
    );

    return (
        <DashBox height="90vh">
            <FlexBetween mb="1rem">
                <DashBoxHeader title="Product List" />
                <AddButton handler={() => handleModalOpen("add")} />
            </FlexBetween>
            <Box
                m="0.5rem"
                p="0 0.5rem"
                height="88%"
                sx={{
                    "& .MuiDataGrid-root": { color: palette.grey[500], border: "none" },
                    "& .MuiDataGrid-cell": { border: "none", borderBottom: `1px solid ${palette.grey[800]} !important` },
                    "& .MuiDataGrid-columnHeaders": { borderBottom: `1px solid ${palette.grey[800]} !important` },
                    "& .MuiDataGrid-columnSeparator": { visibility: "hidden" },
                }}
            >
                <DataGrid
                    columnHeaderHeight={25}
                    rowHeight={35}
                    hideFooter
                    rows={productData?.products || []}
                    columns={productColumns}
                />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" margin="1.5rem 1rem">
                <PageNumberNav
                    currentPage={currentPage}
                    totalPages={productData?.totalPages ?? 0}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                />
            </Box>
            <CustomModal
                open={modalType !== null}
                title={modalType === "add" ? "ADD NEW PRODUCT" : "EDIT EXISTING PRODUCT"}
                onSave={handleSubmit}
                onClose={handleModalClose}
                onDelete={modalType === "edit" ? handleDelete : undefined}
                content={renderModalContent()}
            />
        </DashBox>
    );
};

export default Products;
