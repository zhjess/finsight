import React, { useMemo, useState } from "react";
import DashBox from "@/components/DashBox";
import DashBoxHeader from "@/components/DashBoxHeader";
import FlexBetween from "@/components/FlexBetween";
import { useCreateTransactionMutation, useGetProductsQuery, useGetTransactionsQuery, useUpdateTransactionMutation } from "@/state/api";
import { Box, Button, FormControl, FormLabel, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "@/components/CustomModal";
import AddButton from "@/components/AddButton";
import { formatDate } from "@/utils/dateUtils";

interface FormTransactionProduct {
    productId: string;
    quantity: number;
}

interface FormData {
    customer: string;
    transactionProducts: FormTransactionProduct[];
}

const Transactions = () => {
    const { palette } = useTheme();
    const { data: transactionData, refetch } = useGetTransactionsQuery();
    const { data: productData } = useGetProductsQuery();
    const [createTransaction] = useCreateTransactionMutation();
    const [updateTransaction] = useUpdateTransactionMutation();

    const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        customer: "",
        transactionProducts: [{ productId: "", quantity: 0 }],
    });
    const [errors, setErrors] = useState({ customer: "", transactionProducts: "" });

    const products = useMemo(() => {
        if (productData) {
            return productData.map(product => ({
                id: product.id,
                description: product.description,
                price: (product.price / 100).toFixed(2)
            }));
        }
        return [];
    }, [productData]);
    

    const resetForm = () => {
        setSelectedTransactionId(null);
        setFormData({ customer: "", transactionProducts: [{ productId: "", quantity: 0 }] });
        setErrors({ customer: "", transactionProducts: "" });
    };

    const handleModalOpen = (type: "add" | "edit", transactionId?: string) => {
        setModalType(type);
        if (type === "add") {
            resetForm();
        } else if (type === "edit" && transactionId) {
            const transactionToEdit = transactionData?.find((p) => p.id === transactionId);
            if (transactionToEdit) {
                setSelectedTransactionId(transactionToEdit.id);
                setFormData({
                    customer: transactionToEdit.customer || "",
                    transactionProducts: transactionToEdit.transactionProducts || [],
                });
            }
        }
    };

    const handleModalClose = () => {
        setModalType(null);
    };

    const handleTransactionProductsChange = (event: React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>, index: number) => {
        const { name, value } = event.target;
        const updatedProducts = [...formData.transactionProducts];
    
        if (name === "quantity") {
            updatedProducts[index] = { ...updatedProducts[index], [name as string]: value ? Number(value) : "" };
        } else {
            updatedProducts[index] = { ...updatedProducts[index], [name as string]: value };
        }

        setFormData((prev) => {
            const newFormData = { ...prev, transactionProducts: updatedProducts };
            console.log("Updated formData:", newFormData);
            return newFormData;
        });
    };
    
    const handleAddTransactionProduct = () => {
        setFormData((prev) => ({
            ...prev,
            transactionProducts: [...prev.transactionProducts, { productId: "", quantity: 0 }],
        }));
    };

    const validateForm = () => {
        const newErrors = { customer: "", transactionProducts: "" };
        if (!formData.customer) newErrors.customer = "Customer name is required";
    
        const productErrors = formData.transactionProducts.map((product) => {
            if (!product.productId || product.quantity <= 0) {
                return "Product name is required and quantity must be greater than 0";
            }
            return "";
        });
    
        const hasProductErrors = productErrors.some((error) => error !== "");
        if (hasProductErrors) {
            newErrors.transactionProducts = "Product name is required and quantity must be greater than 0";
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (modalType === "add") {
                const transactionData = {
                    transaction: {
                        customer: formData.customer,
                        transactionProducts: formData.transactionProducts,
                    },
                };
                await createTransaction(transactionData);
            } else if (modalType === "edit" && selectedTransactionId) {
                const updatedTransactionData = {
                        transactionId: selectedTransactionId,
                        customer: formData.customer,
                        transactionProducts: formData.transactionProducts,
                    }
                console.log("updated transaction data", updatedTransactionData)
                await updateTransaction(updatedTransactionData);
                };
            await refetch();
            handleModalClose();
        } catch (err) {
            console.error("An error occurred while submitting the transaction", err);
        }
    };

    const renderEditButton = (params: GridCellParams) => (
        <Box display="flex" height="100%">
            <IconButton
                onClick={() => handleModalOpen("edit", params.row.id as string)}
                sx={{
                    color: palette.grey[800],
                    "&:hover": { color: palette.primary[400] },
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    const transactionColumns = [
        {
            field: "updatedAt",
            headerName: "Updated at",
            flex: 0.6,
            renderCell: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
        },
        { field: "id", headerName: "Transaction ID", flex: 1 },
        { field: "customer", headerName: "Customer", flex: 0.5 },
        { field: "edit", headerName: "", flex: 0.1, sortable: false, renderCell: renderEditButton },
    ];

    const renderModalContent = () => (
        <Box margin="2rem 1rem">
            <FormControl fullWidth>
                <FormLabel sx={{ marginBottom: "1rem" }}>
                    <b>{modalType === "add" ? "Enter new transaction details:" : "Update existing transaction details:"}</b>
                </FormLabel>
                <TextField
                    label="Customer name"
                    name="customer"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.customer}
                    helperText={errors.customer}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ marginBottom: "1.5rem" }}
                />
                <FormLabel sx={{ fontSize: "small", marginBottom: "1rem"}}>Transaction items:</FormLabel>
                {formData.transactionProducts.map((transactionProduct, index) => (
                    <Box display="flex" key={index} gap="1rem">
                        <Box flex="3">
                            <FormControl fullWidth sx={{ marginBottom: "1rem"}}>
                                <InputLabel size="small">Product</InputLabel>
                                <Select
                                    label="Product"
                                    name="productId"
                                    size="small"
                                    value={transactionProduct.productId}
                                    onChange={(e) => handleTransactionProductsChange(e, index)}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                width: 400,
                                            }
                                        }
                                    }}
                                >   
                                    {products.map((product) => (
                                        <MenuItem key={product.id} value={product.id}>
                                            {`${product.description} | $${product.price} | ${product.id}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box flex="1">
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                size="small"
                                value={transactionProduct.quantity !== 0 ? transactionProduct.quantity : ""} // prevent from displaying 0
                                onChange={(e) => handleTransactionProductsChange(e, index)}
                                fullWidth
                                margin="none"
                            />
                        </Box>
                    </Box>
                ))}
            </FormControl>
            <Box marginTop="0.5rem">
                <Button
                    onClick={handleAddTransactionProduct}
                    sx={{
                        padding: "0.1rem 1rem",
                        color: "white",
                        backgroundColor: palette.grey[400]
                    }}
                    size="large"
                >
                    <b>+</b>
                </Button>
            </Box>
        </Box>
    );

    return (
        <DashBox height="90vh">
            <FlexBetween mb="1rem">
                <DashBoxHeader title="Transactions (sales)" />
                <AddButton handler={() => handleModalOpen("add")} />
            </FlexBetween>
            <Box
                m="0.5rem"
                p="0 0.5rem"
                height="90%"
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
                    rows={transactionData || []}
                    columns={transactionColumns}
                />
            </Box>
            <CustomModal
                open={modalType !== null}
                title={modalType === "add" ? "ADD NEW TRANSACTION" : "EDIT EXISTING TRANSACTION"}
                onSave={handleSubmit}
                onClose={handleModalClose}
                content={renderModalContent()}
            />
        </DashBox>
    );
};

export default Transactions;
